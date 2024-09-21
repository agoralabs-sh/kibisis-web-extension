import { HStack, Text, VStack } from '@chakra-ui/react';
import React, {
  type FC,
  type TransitionEvent,
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
import ScrollableContainer from '@extension/components/ScrollableContainer';
import SideBarAccountList from '@extension/components/SideBarAccountList';
import SideBarActionItem from './SideBarActionItem';

// constants
import {
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  BODY_BACKGROUND_COLOR,
  SETTINGS_ROUTE,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// enums
import { AccountTabEnum } from '@extension/enums';

// features
import {
  saveAccountsThunk,
  saveActiveAccountDetails,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { setScanQRCodeModal } from '@extension/features/layout';
import { initialize as initializeSendAssets } from '@extension/features/send-assets';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectAccounts,
  useSelectAccountsFetching,
  useSelectActiveAccount,
  useSelectActiveAccountDetails,
  useSelectAvailableAccountsForSelectedNetwork,
  useSelectSettingsSelectedNetwork,
} from '@extension/selectors';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const navigate = useNavigate();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccount = useSelectActiveAccount();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const availableAccounts = useSelectAvailableAccountsForSelectedNetwork();
  const fetchingAccounts = useSelectAccountsFetching();
  const network = useSelectSettingsSelectedNetwork();
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
  const handleAddAccountClick = () => {
    onCloseSideBar();
    navigate(ADD_ACCOUNT_ROUTE);
  };
  const handleOnAccountClick = async (id: string) => {
    await dispatch(
      saveActiveAccountDetails({
        accountId: id,
        tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
      })
    );
    dispatch(
      updateAccountsThunk({
        accountIDs: [id],
        notifyOnNewTransactions: true,
        refreshTransactions: true,
      })
    );
    navigate(`${ACCOUNTS_ROUTE}`, {
      replace: true,
    });

    onCloseSideBar();
  };
  const handleOnAccountSort = (_accounts: IAccountWithExtendedProps[]) =>
    dispatch(
      saveAccountsThunk(
        _accounts.map((value, index) => ({
          ...value,
          index,
        }))
      )
    );
  const handleScanQRCodeClick = () =>
    dispatch(
      setScanQRCodeModal({
        allowedAuthorities: [], // allow all
        allowedParams: [], // allow all
      })
    );
  const handleSendAssetClick = () => {
    let fromAccount: IAccountWithExtendedProps | null;

    if (!activeAccount || !network) {
      return;
    }

    // for the active account is eligible, use it as the from account, otherwise get the first account in the list
    fromAccount =
      availableAccounts.find((value) => value.id === activeAccount.id) ||
      availableAccounts[0] ||
      null;

    if (!fromAccount) {
      return;
    }

    dispatch(
      initializeSendAssets({
        sender: fromAccount,
        asset: network.nativeCurrency, // use native currency
      })
    );
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

  useEffect(() => {
    if (isOpen) {
      setWidth(SIDEBAR_MAX_WIDTH);

      return;
    }

    setWidth(SIDEBAR_MIN_WIDTH);
  }, [isOpen]);

  return (
    <VStack
      backgroundColor={BODY_BACKGROUND_COLOR}
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
            <KibisisIcon
              boxSize={calculateIconSize('md')}
              color={primaryColor}
            />
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
          minW={`${SIDEBAR_MIN_WIDTH}px`}
          onClick={handleOpenToggleClick}
          variant="ghost"
        />
      </HStack>

      <Divider />

      {/*accounts*/}
      <ScrollableContainer
        direction="column"
        flexGrow={1}
        m={0}
        p={0}
        spacing={0}
        w="full"
      >
        <SideBarAccountList
          accounts={accounts}
          activeAccount={activeAccount}
          isLoading={fetchingAccounts}
          network={network}
          onClick={handleOnAccountClick}
          onSort={handleOnAccountSort}
        />
      </ScrollableContainer>

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
