import { HStack, Text, VStack } from '@chakra-ui/react';
import React, {
  FC,
  ReactNode,
  TransitionEvent,
  useEffect,
  useState,
} from 'react';
import {
  IoAddCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoScanOutline,
  IoSendOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import Divider from '@extension/components/Divider';
import IconButton from '@extension/components/IconButton';
import KibisisIcon from '@extension/components/KibisisIcon';
import SideBarAccountItem from './SideBarAccountItem';
import SideBarActionItem from './SideBarActionItem';
import SideBarSkeletonAccountItem from './SideBarSkeletonAccountItem';

// constants
import {
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  SETTINGS_ROUTE,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// enums
import { AccountTabEnum } from '@extension/enums';

// features
import { saveActiveAccountDetails } from '@extension/features/accounts';
import { initializeSendAsset } from '@extension/features/send-assets';
import { setScanQRCodeModal } from '@extension/features/system';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectActiveAccountDetails,
  useSelectAccountsFetching,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
} from '@extension/types';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccount = useSelectActiveAccount();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const fetchingAccounts = useSelectAccountsFetching();
  const network = useSelectSelectedNetwork();
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // state
  const [width, setWidth] = useState<number>(SIDEBAR_MIN_WIDTH);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHeaderShowing, setIsHeaderShowing] = useState<boolean>(false);
  // handlers
  const onCloseSideBar = () => {
    setIsHeaderShowing(false);
    setIsOpen(false);
  };
  const handleOpenToggleClick = () => {
    setIsHeaderShowing(false);
    setIsOpen(!isOpen);
  };
  const handleAccountClick = async (id: string) => {
    await dispatch(
      saveActiveAccountDetails({
        accountId: id,
        tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
      })
    );
    navigate(`${ACCOUNTS_ROUTE}`, {
      replace: true,
    });

    onCloseSideBar();
  };
  const handleAddAccountClick = () => {
    onCloseSideBar();
    navigate(ADD_ACCOUNT_ROUTE);
  };
  const handleScanQRCodeClick = () =>
    dispatch(
      setScanQRCodeModal({
        allowedAuthorities: [], // allow all
        allowedParams: [], // allow all
      })
    );
  const handleSendAssetClick = () => {
    let fromAccount: IAccountWithExtendedProps | null;

    if (activeAccount && network) {
      fromAccount = activeAccount;

      // if the active account is a watch account, get the first account that is not a watch account
      if (activeAccount.watchAccount) {
        fromAccount = accounts.find((value) => !value.watchAccount) || null;
      }

      if (!fromAccount) {
        return;
      }

      dispatch(
        initializeSendAsset({
          fromAddress: AccountService.convertPublicKeyToAlgorandAddress(
            fromAccount.publicKey
          ),
          selectedAsset: network.nativeCurrency, // use native currency
        })
      );
    }
  };
  const handleSettingsClick = () => {
    onCloseSideBar();
    navigate(SETTINGS_ROUTE);
  };
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'width' && width >= SIDEBAR_MAX_WIDTH) {
      setIsHeaderShowing(true);
    }
  };
  const renderAccounts: () => ReactNode = () => {
    if (fetchingAccounts || !network) {
      return Array.from({ length: 3 }, (_, index) => (
        <SideBarSkeletonAccountItem key={`sidebar-fetching-item-${index}`} />
      ));
    }

    return accounts.map((value, index) => (
      <SideBarAccountItem
        account={value}
        accounts={accounts}
        active={activeAccount ? value.id === activeAccount.id : false}
        key={`sidebar-item-${index}`}
        network={network}
        onClick={handleAccountClick}
      />
    ));
  };

  useEffect(() => {
    if (isOpen) {
      setWidth(SIDEBAR_MAX_WIDTH);

      return;
    }

    setWidth(SIDEBAR_MIN_WIDTH);
  }, [isOpen]);

  return (
    <VStack
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
      borderRightColor={borderColor}
      borderRightStyle="solid"
      borderRightWidth={SIDEBAR_BORDER_WIDTH}
      h="100vh"
      left={0}
      onTransitionEnd={handleTransitionEnd}
      overflowX="hidden"
      position="absolute"
      spacing={0}
      top={0}
      transition="width 0.3s ease"
      w={`${width}px`}
      zIndex={10}
    >
      <HStack justifyContent="flex-end" w="full">
        {isHeaderShowing && (
          <HStack flexGrow={1} px={2} spacing={1} w="full">
            <KibisisIcon color={primaryColor} h={5} w={5} />
            <Text color={defaultTextColor} fontSize="sm">
              {__APP_TITLE__}
            </Text>
          </HStack>
        )}
        <IconButton
          aria-label="Open drawer"
          borderRadius={0}
          colorScheme="gray"
          icon={isOpen ? IoChevronBack : IoChevronForward}
          onClick={handleOpenToggleClick}
          variant="ghost"
        />
      </HStack>

      <Divider />

      {/*accounts*/}
      <VStack flexGrow={1} overflowY="scroll" spacing={0} w="full">
        {renderAccounts()}
      </VStack>

      <Divider />

      {/*send asset*/}
      {accounts.some((value) => !value.watchAccount) && (
        <SideBarActionItem
          icon={IoSendOutline}
          label={t<string>('labels.sendAsset', {
            nativeCurrency: network?.nativeCurrency.symbol,
          })}
          onClick={handleSendAssetClick}
        />
      )}

      {/*scan qr code*/}
      <SideBarActionItem
        icon={IoScanOutline}
        label={t<string>('labels.scanQRCode')}
        onClick={handleScanQRCodeClick}
      />

      {/*add account*/}
      <SideBarActionItem
        icon={IoAddCircleOutline}
        label={t<string>('labels.addAccount')}
        onClick={handleAddAccountClick}
      />

      {/*settings*/}
      <SideBarActionItem
        icon={IoSettingsOutline}
        label={t<string>('labels.settings')}
        onClick={handleSettingsClick}
      />
    </VStack>
  );
};

export default SideBar;
