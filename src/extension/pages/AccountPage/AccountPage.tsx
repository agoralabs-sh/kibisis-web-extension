import {
  Heading,
  HStack,
  Icon,
  Spacer,
  type StackProps,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoAdd,
  IoCloudOfflineOutline,
  IoGiftOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoPencil,
  IoQrCodeOutline,
  IoStarOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import ActivityTab from '@extension/components/ActivityTab';
import AssetsTab from '@extension/components/AssetsTab';
import CopyIconButton from '@extension/components/CopyIconButton';
import EmptyState from '@extension/components/EmptyState';
import IconButton from '@extension/components/IconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import OverflowMenu from '@extension/components/OverflowMenu';
import NativeBalance from '@extension/components/NativeBalance';
import NetworkSelect from '@extension/components/NetworkSelect';
import NFTsTab from '@extension/components/NFTsTab';
import PolisAccountBadge from '@extension/components/PolisAccountBadge';
import ReKeyedAccountBadge from '@extension/components/RekeyedAccountBadge';
import WatchAccountBadge from '@extension/components/WatchAccountBadge';
import AccountPageSkeletonContent from './AccountPageSkeletonContent';

// constants
import {
  ACCOUNT_PAGE_HEADER_ITEM_HEIGHT,
  ADD_ACCOUNT_ROUTE,
  DEFAULT_GAP,
} from '@extension/constants';

// enums
import { AccountTabEnum } from '@extension/enums';

// features
import {
  removeAccountByIdThunk,
  saveActiveAccountDetails,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { setConfirmModal, setWhatsNewModal } from '@extension/features/layout';
import { updateTransactionParamsForSelectedNetworkThunk } from '@extension/features/networks';
import {
  setAccountAndType as setReKeyAccount,
  TReKeyType,
} from '@extension/features/re-key-account';
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';
import { savePolisAccountIDThunk } from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import EditAccountModal from '@extension/modals/EditAccountModal';
import ShareAddressModal from '@extension/modals/ShareAddressModal';

// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectActiveAccountDetails,
  useSelectActiveAccountInformation,
  useSelectActiveAccountTransactions,
  useSelectAccountsFetching,
  useSelectSettingsFetching,
  useSelectIsOnline,
  useSelectNetworks,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettingsSelectedNetwork,
  useSelectSettings,
  useSelectSystemInfo,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  INetwork,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isEditAccountModalOpen,
    onClose: onEditAccountModalClose,
    onOpen: onEditAccountModalOpen,
  } = useDisclosure();
  const {
    isOpen: isShareAddressModalOpen,
    onClose: onShareAddressModalClose,
    onOpen: onShareAddressModalOpen,
  } = useDisclosure();
  const navigate = useNavigate();
  // selectors
  const account = useSelectActiveAccount();
  const accountInformation = useSelectActiveAccountInformation();
  const accounts = useSelectAccounts();
  const accountTransactions = useSelectActiveAccountTransactions();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const fetchingAccounts = useSelectAccountsFetching();
  const fetchingSettings = useSelectSettingsFetching();
  const online = useSelectIsOnline();
  const network = useSelectSettingsSelectedNetwork();
  const networks = useSelectNetworks();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  const settings = useSelectSettings();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // misc
  const _context = 'account-page';
  const canReKeyAccount = () => {
    if (!account || !accountInformation) {
      return false;
    }

    // if it is a watch account, but it has been re-keyed and the re-key is available, we can re-key
    if (account.watchAccount) {
      return !!(
        accountInformation.authAddress &&
        isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      );
    }

    return true;
  };
  // handlers
  const handleActivityScrollEnd = () => {
    if (account && accountTransactions && accountTransactions.next) {
      dispatch(
        updateAccountsThunk({
          accountIDs: [account.id],
        })
      );
    }
  };
  const handleAddAccountClick = () => navigate(ADD_ACCOUNT_ROUTE);
  const handleOnEditAccountClick = () => onEditAccountModalOpen();
  const handleOnMakePrimaryClick = () =>
    account && dispatch(savePolisAccountIDThunk(account.id));
  const handleOnWhatsNewClick = () => dispatch(setWhatsNewModal(true));
  const handleOnRefreshActivityClick = () => {
    dispatch(
      updateAccountsThunk({
        accountIDs: accounts.map(({ id }) => id),
        information: false, // get account information
        notifyOnNewTransactions: true,
        refreshTransactions: true, // get latest transactions
      })
    );
  };
  const handleNetworkSelect = async (value: INetwork) => {
    await dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        general: {
          ...settings.general,
          selectedNetworkGenesisHash: value.genesisHash,
        },
      })
    ).unwrap();

    // when the settings have been updated, fetch update the account and transaction params
    dispatch(
      updateAccountsThunk({
        accountIDs: accounts.map(({ id }) => id),
      })
    );
    dispatch(updateTransactionParamsForSelectedNetworkThunk());
  };
  const handleReKeyAccountClick = (type: TReKeyType) => () =>
    account &&
    dispatch(
      setReKeyAccount({
        account,
        type,
      })
    );
  const handleRemoveAccountClick = () => {
    if (account) {
      dispatch(
        setConfirmModal({
          description: t<string>('captions.removeAccount', {
            address: ellipseAddress(
              convertPublicKeyToAVMAddress(
                PrivateKeyRepository.decode(account.publicKey)
              ),
              {
                end: 10,
                start: 10,
              }
            ),
          }),
          onConfirm: () => dispatch(removeAccountByIdThunk(account.id)),
          title: t<string>('headings.removeAccount'),
          ...(!account.watchAccount && {
            warningText: t<string>('captions.removeAccountWarning'),
          }),
        })
      );
    }
  };
  const handleTabChange = (tabIndex: AccountTabEnum) => {
    if (account) {
      dispatch(
        saveActiveAccountDetails({
          accountId: account.id,
          tabIndex,
        })
      );
    }
  };
  // renders
  const renderContent = () => {
    const headerContainerProps: StackProps = {
      alignItems: 'flex-start',
      px: DEFAULT_GAP - 2,
      spacing: DEFAULT_GAP / 3,
      w: 'full',
    };
    let address: string;

    if (fetchingAccounts || fetchingSettings) {
      return (
        <AccountPageSkeletonContent
          {...headerContainerProps}
          pt={DEFAULT_GAP - 2}
        />
      );
    }

    if (account && accountInformation && network) {
      address = convertPublicKeyToAVMAddress(
        PrivateKeyRepository.decode(account.publicKey)
      );

      return (
        <>
          {/*header*/}
          <VStack {...headerContainerProps}>
            {/*top elements*/}
            <HStack
              minH={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT}
              pt={DEFAULT_GAP - 2}
              w="full"
            >
              {/*network connectivity*/}
              {!online && (
                <Tooltip
                  aria-label="Offline icon"
                  label={t<string>('captions.offline')}
                >
                  <span
                    style={{
                      height: '1em',
                      lineHeight: '1em',
                    }}
                  >
                    <Icon as={IoCloudOfflineOutline} color="red.500" />
                  </span>
                </Tooltip>
              )}

              <Spacer />

              {/*what's new*/}
              <Tooltip label={t<string>('labels.whatsNew')}>
                <IconButton
                  aria-label={t<string>('labels.whatsNew')}
                  icon={IoGiftOutline}
                  onClick={handleOnWhatsNewClick}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*network selection*/}
              <NetworkSelect
                _context={_context}
                networks={networks}
                onSelect={handleNetworkSelect}
                size="xs"
                value={network}
              />
            </HStack>

            {/*name/address*/}
            <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
              <Tooltip label={account.name || address}>
                <Heading
                  color={defaultTextColor}
                  maxW="650px" // full address length
                  noOfLines={1}
                  size="md"
                  textAlign="left"
                  w="full"
                >
                  {account.name || address}
                </Heading>
              </Tooltip>

              {/*address*/}
              {account.name && (
                <Tooltip label={address}>
                  <Text
                    color={subTextColor}
                    fontSize="xs"
                    textAlign="left"
                    w="full"
                  >
                    {ellipseAddress(address, { end: 15, start: 15 })}
                  </Text>
                </Tooltip>
              )}
            </VStack>

            {/*balance*/}
            <HStack
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
              w="full"
            >
              <NativeBalance
                atomicBalance={new BigNumber(accountInformation.atomicBalance)}
                minAtomicBalance={
                  new BigNumber(accountInformation.minAtomicBalance)
                }
                nativeCurrency={network.nativeCurrency}
              />
            </HStack>

            {/*controls*/}
            <HStack
              alignItems="center"
              h={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT}
              justifyContent="flex-end"
              spacing={1}
              w="full"
            >
              {/*edit account*/}
              <Tooltip label={t<string>('labels.editAccount')}>
                <IconButton
                  aria-label={t<string>('labels.editAccount')}
                  icon={IoPencil}
                  onClick={handleOnEditAccountClick}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*copy address*/}
              <CopyIconButton
                ariaLabel={t<string>('labels.copyAddress')}
                tooltipLabel={t<string>('labels.copyAddress')}
                value={address}
              />

              {/*open address on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={explorer.accountURL(address)}
                />
              )}

              {/*share address*/}
              <Tooltip label={t<string>('labels.shareAddress')}>
                <IconButton
                  aria-label="Show QR code"
                  icon={IoQrCodeOutline}
                  onClick={onShareAddressModalOpen}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*overflow menu*/}
              <OverflowMenu
                context={_context}
                items={[
                  // make primary
                  ...(!account ||
                  !systemInfo ||
                  systemInfo.polisAccountID !== account.id
                    ? [
                        {
                          icon: IoStarOutline,
                          label: t<string>('labels.makePrimary'),
                          onSelect: handleOnMakePrimaryClick,
                        },
                      ]
                    : []),
                  // re-key
                  ...(canReKeyAccount()
                    ? [
                        {
                          icon: IoLockClosedOutline,
                          label: t<string>('labels.reKey'),
                          onSelect: handleReKeyAccountClick('rekey'),
                        },
                      ]
                    : []),
                  // undo re-key
                  ...(accountInformation.authAddress &&
                  isReKeyedAuthAccountAvailable({
                    accounts,
                    authAddress: accountInformation.authAddress,
                  })
                    ? [
                        {
                          icon: IoLockOpenOutline,
                          label: t<string>('labels.undoReKey'),
                          onSelect: handleReKeyAccountClick('undo'),
                        },
                      ]
                    : []),
                  // remove account
                  {
                    icon: IoTrashOutline,
                    label: t<string>('labels.removeAccount'),
                    onSelect: handleRemoveAccountClick,
                  },
                ]}
              />
            </HStack>

            {/*badges*/}
            <VStack alignItems="flex-end" spacing={DEFAULT_GAP / 3} w="full">
              <HStack
                alignItems="center"
                spacing={DEFAULT_GAP / 3}
                justifyContent="flex-end"
                w="full"
              >
                {/*polis account badge*/}
                {account &&
                  systemInfo &&
                  systemInfo.polisAccountID === account.id && (
                    <PolisAccountBadge />
                  )}

                {/*watch account badge*/}
                {renderWatchAccountBadge()}
              </HStack>

              {/*re-keyed badge*/}
              {renderReKeyedAccountBadge()}
            </VStack>
          </VStack>

          <Spacer />

          {/*assets/nfts/activity tabs*/}
          <Tabs
            colorScheme={primaryColorScheme}
            defaultIndex={
              activeAccountDetails?.tabIndex || AccountTabEnum.Assets
            }
            isLazy={true}
            m={0}
            onChange={handleTabChange}
            sx={{ display: 'flex', flexDirection: 'column' }}
            w="full"
          >
            <TabList>
              <Tab>{t<string>('labels.assets')}</Tab>
              <Tab>{t<string>('labels.nfts')}</Tab>
              <Tab>{t<string>('labels.activity')}</Tab>
            </TabList>

            <TabPanels sx={{ display: 'flex', flexDirection: 'column' }}>
              <AssetsTab _context={_context} account={account} />

              <NFTsTab account={account} />

              <ActivityTab
                _context={_context}
                account={account}
                accounts={accounts}
                fetching={fetchingAccounts}
                network={network}
                onRefreshClick={handleOnRefreshActivityClick}
                onScrollEnd={handleActivityScrollEnd}
              />
            </TabPanels>
          </Tabs>
        </>
      );
    }

    return (
      <>
        {/*empty state*/}
        <Spacer />

        <EmptyState
          button={{
            icon: IoAdd,
            label: t<string>('buttons.addAccount'),
            onClick: handleAddAccountClick,
          }}
          description={t<string>('captions.noAccountsFound')}
          text={t<string>('headings.noAccountsFound')}
        />

        <Spacer />
      </>
    );
  };
  const renderReKeyedAccountBadge = () => {
    let isAuthAccountAvailable = false;

    if (accountInformation && accountInformation.authAddress) {
      isAuthAccountAvailable = isReKeyedAuthAccountAvailable({
        accounts,
        authAddress: accountInformation.authAddress,
      });

      return (
        <ReKeyedAccountBadge
          authAddress={accountInformation.authAddress}
          isAuthAccountAvailable={isAuthAccountAvailable}
          tooltipLabel={
            isAuthAccountAvailable
              ? t<string>('labels.reKeyedToAccount', {
                  address: accountInformation.authAddress,
                })
              : undefined
          }
        />
      );
    }

    return null;
  };
  const renderWatchAccountBadge = () => {
    const watchAccountBadge = <WatchAccountBadge />;

    // if this is a re-keyed account
    if (accountInformation && accountInformation.authAddress) {
      // if no auth account is present, or the auth account is a watch account, show a watch badge
      if (
        !isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      ) {
        return watchAccountBadge;
      }

      return null;
    }

    if (account && account.watchAccount) {
      return watchAccountBadge;
    }

    return null;
  };

  return (
    <>
      {account && (
        <>
          <EditAccountModal
            isOpen={isEditAccountModalOpen}
            onClose={onEditAccountModalClose}
          />

          <ShareAddressModal
            address={convertPublicKeyToAVMAddress(
              PrivateKeyRepository.decode(account.publicKey)
            )}
            isOpen={isShareAddressModalOpen}
            onClose={onShareAddressModalClose}
          />
        </>
      )}

      <VStack
        alignItems="center"
        justifyContent="flex-start"
        flexGrow={1}
        w="full"
      >
        {renderContent()}
      </VStack>
    </>
  );
};

export default AccountPage;
