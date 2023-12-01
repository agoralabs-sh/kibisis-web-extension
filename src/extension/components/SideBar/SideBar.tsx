import { HStack, Text, VStack } from '@chakra-ui/react';
import React, {
  FC,
  ReactNode,
  TransitionEvent,
  useState,
  useEffect,
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
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// components
import Divider from '@extension/components/Divider';
import IconButton from '@extension/components/IconButton';
import KibisisIcon from '@extension/components/KibisisIcon';
import SideBarAccountItem from './SideBarAccountItem';
import SideBarActionItem from './SideBarActionItem';
import SideBarSkeletonAccountItem from './SideBarSkeletonAccountItem';

// constants
import {
  ADD_ACCOUNT_ROUTE,
  ACCOUNTS_ROUTE,
  SETTINGS_ROUTE,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// features
import { initializeSendAsset } from '@extension/features/send-assets';
import { openWalletConnectModal } from '@extension/features/sessions';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import { IAccount, IAppThunkDispatch, INetwork } from '@extension/types';

// utils
import { createNativeCurrencyAsset } from '@extension/utils';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  // hooks
  const borderColor: string = useBorderColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const network: INetwork | null = useSelectSelectedNetwork();
  // state
  const [activeAccountAddress, setActiveAccountAddress] = useState<
    string | null
  >(null);
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
  const handleAccountClick = (address: string) => {
    onCloseSideBar();
    navigate(`${ACCOUNTS_ROUTE}/${address}`);
  };
  const handleAddAccountClick = () => {
    onCloseSideBar();
    navigate(ADD_ACCOUNT_ROUTE);
  };
  const handleConnectWalletClick = () => dispatch(openWalletConnectModal());
  const handleSendAssetClick = () => {
    if (network) {
      dispatch(
        initializeSendAsset({
          fromAddress: activeAccountAddress || null,
          selectedAsset: createNativeCurrencyAsset(network),
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
    if (fetchingAccounts) {
      return Array.from({ length: 3 }, (_, index) => (
        <SideBarSkeletonAccountItem key={`sidebar-fetching-item-${index}`} />
      ));
    }

    return accounts.map((value, index) => (
      <SideBarAccountItem
        active={
          activeAccountAddress
            ? AccountService.convertPublicKeyToAlgorandAddress(
                value.publicKey
              ) === activeAccountAddress
            : false
        }
        account={value}
        key={`sidebar-item-${index}`}
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
  useEffect(() => {
    if (location.pathname.includes(ACCOUNTS_ROUTE)) {
      const pathnames: string[] = location.pathname
        .split('/')
        .filter((value) => value.length > 0);
      const addressIndex: number = pathnames.findIndex(
        (value) => value === 'accounts'
      );

      // if we have an address, get the address path, ie. /address/XXXX/...
      if (addressIndex >= 0) {
        setActiveAccountAddress(pathnames[addressIndex + 1] || null);

        return;
      }
    }

    setActiveAccountAddress(null);
  }, [location]);

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

      {/* accounts */}
      <VStack flexGrow={1} overflowY="scroll" spacing={0} w="full">
        {renderAccounts()}
      </VStack>

      <Divider />

      {/* send asset */}
      <SideBarActionItem
        icon={IoSendOutline}
        label={t<string>('labels.sendAsset', {
          nativeCurrency: network?.nativeCurrency.code
            ? `${network?.nativeCurrency.code}/`
            : '',
        })}
        onClick={handleSendAssetClick}
      />

      {/* connect dapp */}
      <SideBarActionItem
        icon={IoScanOutline}
        label={t<string>('labels.connectWallet')}
        onClick={handleConnectWalletClick}
      />

      {/* add account */}
      <SideBarActionItem
        icon={IoAddCircleOutline}
        label={t<string>('labels.addAccount')}
        onClick={handleAddAccountClick}
      />

      {/* settings */}
      <SideBarActionItem
        icon={IoSettingsOutline}
        label={t<string>('labels.settings')}
        onClick={handleSettingsClick}
      />
    </VStack>
  );
};

export default SideBar;
