import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  StackProps,
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
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoAdd,
  IoCloudOfflineOutline,
  IoCreateOutline,
  IoEllipsisVerticalOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoQrCodeOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import ActivityTab from '@extension/components/ActivityTab';
import AssetsTab from '@extension/components/AssetsTab';
import CopyIconButton from '@extension/components/CopyIconButton';
import EditableAccountNameField from '@extension/components/EditableAccountNameField';
import EmptyState from '@extension/components/EmptyState';
import IconButton from '@extension/components/IconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import NativeBalance from '@extension/components/NativeBalance';
import NetworkSelect from '@extension/components/NetworkSelect';
import NFTsTab from '@extension/components/NFTsTab';
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
  saveAccountNameThunk,
  saveActiveAccountDetails,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { setConfirmModal } from '@extension/features/layout';
import {
  setAccountAndType as setReKeyAccount,
  TReKeyType,
} from '@extension/features/re-key-account';
import { saveSettingsToStorageThunk } from '@extension/features/settings';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import ShareAddressModal from '@extension/modals//ShareAddressModal';

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
  useSelectAccountsSaving,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IAppThunkDispatch, INetwork } from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
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
  const networks = useSelectNetworks();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  const savingAccounts = useSelectAccountsSaving();
  const selectedNetwork = useSelectSelectedNetwork();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // misc
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
          accountIds: [account.id],
        })
      );
    }
  };
  const handleAddAccountClick = () => navigate(ADD_ACCOUNT_ROUTE);
  const handleNetworkSelect = (network: INetwork) => {
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        general: {
          ...settings.general,
          selectedNetworkGenesisHash: network.genesisHash,
        },
      })
    );
  };
  const handleEditAccountNameCancel = () => setIsEditing(false);
  const handleEditAccountNameClick = () => setIsEditing(!isEditing);
  const handleEditAccountNameSubmit = (value: string | null) => {
    if (account) {
      dispatch(
        saveAccountNameThunk({
          accountId: account.id,
          name: value,
        })
      );
    }

    setIsEditing(false);
  };
  const handleRemoveAccountClick = () => {
    if (account) {
      dispatch(
        setConfirmModal({
          description: t<string>('captions.removeAccount', {
            address: ellipseAddress(
              convertPublicKeyToAVMAddress(
                PrivateKeyService.decode(account.publicKey)
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
  const handleReKeyAccountClick = (type: TReKeyType) => () =>
    account &&
    dispatch(
      setReKeyAccount({
        account,
        type,
      })
    );
  // renders
  const renderContent = () => {
    const headerContainerProps: StackProps = {
      alignItems: 'flex-start',
      px: DEFAULT_GAP - 2,
      w: 'full',
    };
    let address: string;

    if (fetchingAccounts || fetchingSettings) {
      return (
        <AccountPageSkeletonContent
          network={networks[0]}
          {...headerContainerProps}
        />
      );
    }

    if (account && accountInformation && selectedNetwork) {
      address = convertPublicKeyToAVMAddress(
        PrivateKeyService.decode(account.publicKey)
      );

      return (
        <>
          {/*header*/}
          <VStack {...headerContainerProps}>
            {/*network connectivity & network selection*/}
            <HStack h={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT} w="full">
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

              <Spacer flexGrow={1} />

              {/*network selection*/}
              <NetworkSelect
                network={selectedNetwork}
                networks={networks}
                onSelect={handleNetworkSelect}
              />
            </HStack>

            {/*name/address and native currency balance*/}
            <HStack
              alignItems="center"
              h={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT}
              w="full"
            >
              {/*name/address*/}
              <EditableAccountNameField
                address={address}
                isEditing={isEditing}
                isLoading={savingAccounts}
                name={account.name}
                onCancel={handleEditAccountNameCancel}
                onSubmitChange={handleEditAccountNameSubmit}
              />

              <Spacer />

              {/*balance*/}
              <NativeBalance
                atomicBalance={new BigNumber(accountInformation.atomicBalance)}
                minAtomicBalance={
                  new BigNumber(accountInformation.minAtomicBalance)
                }
                nativeCurrency={selectedNetwork.nativeCurrency}
              />
            </HStack>

            {/*address and controls*/}
            <HStack
              alignItems="center"
              h={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT}
              spacing={1}
              w="full"
            >
              <Tooltip label={address}>
                <Text color={subTextColor} fontSize="xs">
                  {ellipseAddress(address, { end: 5, start: 5 })}
                </Text>
              </Tooltip>

              <Spacer />

              {/*edit account name*/}
              <Tooltip label={t<string>('labels.editAccountName')}>
                <IconButton
                  aria-label="Edit account name"
                  icon={IoCreateOutline}
                  onClick={handleEditAccountNameClick}
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
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Overflow menu"
                  icon={IoEllipsisVerticalOutline}
                  variant="ghost"
                />
                <MenuList>
                  {/*re-key*/}
                  {canReKeyAccount() && (
                    <MenuItem
                      color={defaultTextColor}
                      icon={
                        <Icon
                          as={IoLockClosedOutline}
                          color={defaultTextColor}
                        />
                      }
                      onClick={handleReKeyAccountClick('rekey')}
                    >
                      {t<string>('labels.reKey')}
                    </MenuItem>
                  )}

                  {/*undo re-key*/}
                  {accountInformation.authAddress &&
                    isReKeyedAuthAccountAvailable({
                      accounts,
                      authAddress: accountInformation.authAddress,
                    }) && (
                      <MenuItem
                        color={defaultTextColor}
                        icon={
                          <Icon
                            as={IoLockOpenOutline}
                            color={defaultTextColor}
                          />
                        }
                        onClick={handleReKeyAccountClick('undo')}
                      >
                        {t<string>('labels.undoReKey')}
                      </MenuItem>
                    )}

                  {/*remove account*/}
                  <MenuItem
                    color={defaultTextColor}
                    icon={<Icon as={IoTrashOutline} color={defaultTextColor} />}
                    onClick={handleRemoveAccountClick}
                  >
                    {t<string>('labels.removeAccount')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {/*badges*/}
            <HStack
              alignItems="center"
              spacing={DEFAULT_GAP / 3}
              justifyContent="flex-end"
              w="full"
            >
              {/*watch account*/}
              {renderWatchAccountBadge()}

              {/*re-keyed badge*/}
              {renderReKeyedAccountBadge()}
            </HStack>
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

            <TabPanels
              flexGrow={1}
              h="70dvh"
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              <AssetsTab account={account} />

              <NFTsTab account={account} />

              <ActivityTab
                account={account}
                accounts={accounts}
                fetching={fetchingAccounts}
                network={selectedNetwork}
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

  useEffect(() => {
    if (account) {
      // if we have no transaction data, or the transaction data is empty, attempt a fetch
      if (
        !accountTransactions ||
        accountTransactions.transactions.length <= 0
      ) {
        dispatch(
          updateAccountsThunk({
            accountIds: [account.id],
          })
        );
      }
    }
  }, [selectedNetwork]);

  return (
    <>
      {account && (
        <>
          <ShareAddressModal
            address={convertPublicKeyToAVMAddress(
              PrivateKeyService.decode(account.publicKey)
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
