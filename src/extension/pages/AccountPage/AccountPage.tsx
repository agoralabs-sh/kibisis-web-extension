import {
  Heading,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  TabList,
  Tab,
  TabPanels,
  Tabs,
  StackProps,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoAdd,
  IoCloudOfflineOutline,
  IoQrCodeOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

// components
import ActivityTab from '@extension/components/ActivityTab';
import AccountAssetsTab from '@extension/components/AccountAssetsTab';
import AccountNftsTab from '@extension/components/AccountNftsTab';
import CopyIconButton from '@extension/components/CopyIconButton';
import EmptyState from '@extension/components/EmptyState';
import IconButton from '@extension/components/IconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import NetworkSelect, {
  NetworkSelectSkeleton,
} from '@extension/components/NetworkSelect';
import NativeBalance, {
  NativeBalanceSkeleton,
} from '@extension/components/NativeBalance';
import ShareAddressModal from '@extension/components/ShareAddressModal';

// constants
import { ADD_ACCOUNT_ROUTE, ACCOUNTS_ROUTE } from '@extension/constants';

// features
import {
  removeAccountByIdThunk,
  updateAccountTransactionsThunk,
} from '@extension/features/accounts';
import { setSettings } from '@extension/features/settings';
import { setConfirm } from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccountByAddress,
  useSelectAccountInformationByAddress,
  useSelectAccounts,
  useSelectAccountTransactionsByAddress,
  useSelectFetchingAccounts,
  useSelectFetchingSettings,
  useSelectIsOnline,
  useSelectNetworks,
  useSelectPreferredBlockExplorer,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  IAccountInformation,
  IAccountTransactions,
  IAppThunkDispatch,
  IExplorer,
  INetwork,
  ISettings,
} from '@extension/types';

// utils
import { ellipseAddress } from '@extension/utils';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isShareAddressModalOpen,
    onClose: onShareAddressModalClose,
    onOpen: onShareAddressModalOpen,
  } = useDisclosure();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { address } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    accountTabId: '0',
  });
  // selectors
  const account: IAccount | null = useSelectAccountByAddress(address);
  const accountInformation: IAccountInformation | null =
    useSelectAccountInformationByAddress(address);
  const accounts: IAccount[] = useSelectAccounts();
  const accountTransactions: IAccountTransactions | null =
    useSelectAccountTransactionsByAddress(address);
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const fetchingSettings: boolean = useSelectFetchingSettings();
  const online: boolean = useSelectIsOnline();
  const networks: INetwork[] = useSelectNetworks();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const settings: ISettings = useSelectSettings();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  // misc
  const accountTabId: number = parseInt(
    searchParams.get('accountTabId') || '0'
  );
  // handlers
  const handleAddAccountClick = () => navigate(ADD_ACCOUNT_ROUTE);
  const handleNetworkSelect = (network: INetwork) => {
    dispatch(
      setSettings({
        ...settings,
        general: {
          ...settings.general,
          selectedNetworkGenesisHash: network.genesisHash,
        },
      })
    );
  };
  const handleRemoveAccountClick = () => {
    if (account) {
      dispatch(
        setConfirm({
          description: t<string>('captions.removeAccount', {
            address: ellipseAddress(
              AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              ),
              {
                end: 10,
                start: 10,
              }
            ),
          }),
          onConfirm: () => dispatch(removeAccountByIdThunk(account.id)),
          title: t<string>('headings.removeAccount'),
          warningText: t<string>('captions.removeAccountWarning'),
        })
      );
    }
  };
  const handleTabChange = (index: number) =>
    setSearchParams({
      accountTabId: index.toString(),
    });
  const handleActivityScrollEnd = () => {
    if (account && accountTransactions && accountTransactions.next) {
      dispatch(
        updateAccountTransactionsThunk({
          accountIds: [account.id],
        })
      );
    }
  };
  // renders
  const renderContent = () => {
    const headerContainerProps: StackProps = {
      alignItems: 'flex-start',
      p: 4,
      w: 'full',
    };
    let address: string;

    if (fetchingAccounts || fetchingSettings) {
      return (
        <VStack {...headerContainerProps}>
          <NetworkSelectSkeleton network={networks[0]} />
          <HStack alignItems="center" w="full">
            {/*address*/}
            <Skeleton>
              <Text color="gray.500" fontSize="xs">
                {ellipseAddress(faker.random.alphaNumeric(58).toUpperCase())}
              </Text>
            </Skeleton>

            <Spacer />

            {/*balance*/}
            <NativeBalanceSkeleton />
          </HStack>
        </VStack>
      );
    }

    if (account && accountInformation && selectedNetwork) {
      address = AccountService.convertPublicKeyToAlgorandAddress(
        account.publicKey
      );

      return (
        <>
          {/*header*/}
          <VStack {...headerContainerProps}>
            {/*network connectivity*/}
            <HStack w="full">
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

            <HStack alignItems="center" w="full">
              {/*name/address*/}
              {account.name ? (
                <Tooltip aria-label="Name of account" label={account.name}>
                  <Heading
                    color={defaultTextColor}
                    maxW={400}
                    noOfLines={1}
                    size="md"
                    textAlign="left"
                  >
                    {account.name}
                  </Heading>
                </Tooltip>
              ) : (
                <Heading color={defaultTextColor} size="md" textAlign="left">
                  {ellipseAddress(address)}
                </Heading>
              )}

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

            {/*address and interactions*/}
            <HStack alignItems="center" spacing={1} w="full">
              <Tooltip label={address}>
                <Text color={subTextColor} fontSize="xs">
                  {ellipseAddress(address, { end: 10, start: 10 })}
                </Text>
              </Tooltip>

              <Spacer />

              {/*copy address*/}
              <CopyIconButton
                ariaLabel="Copy address"
                copiedTooltipLabel={t<string>('captions.addressCopied')}
                value={address}
              />

              {/*open address on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.accountPath}/${address}`}
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

              {/*remove account*/}
              <Tooltip label={t<string>('labels.removeAccount')}>
                <IconButton
                  aria-label="Remove account"
                  icon={IoTrashOutline}
                  onClick={handleRemoveAccountClick}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
          </VStack>

          <Spacer />

          {/*assets/nfts/activity tabs*/}
          <Tabs
            colorScheme={primaryColorScheme}
            defaultIndex={accountTabId}
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
              <AccountAssetsTab account={account} />

              <AccountNftsTab />

              <ActivityTab
                account={account}
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

  useEffect(() => {
    let address: string;

    // if there is no account, go to the first account, or the accounts index if no accounts exist
    if (!account) {
      navigate(
        `${ACCOUNTS_ROUTE}${
          accounts[0]
            ? `/${AccountService.convertPublicKeyToAlgorandAddress(
                accounts[0].publicKey
              )}`
            : ''
        }`,
        {
          replace: true,
        }
      );

      return;
    }

    address = AccountService.convertPublicKeyToAlgorandAddress(
      account.publicKey
    );

    // if there is an account, but the location doesn't match, change the location
    if (!location.pathname.includes(address)) {
      navigate(`${ACCOUNTS_ROUTE}/${address}`, {
        preventScrollReset: true,
        replace: true,
      });

      return;
    }
  }, [account]);
  useEffect(() => {
    if (account) {
      // if we have no transaction data, or the transaction data is empty, attempt a fetch
      if (
        !accountTransactions ||
        accountTransactions.transactions.length <= 0
      ) {
        dispatch(
          updateAccountTransactionsThunk({
            accountIds: [account.id],
          })
        );
      }
    }
  }, [selectedNetwork]);

  return (
    <>
      {account && (
        <ShareAddressModal
          address={AccountService.convertPublicKeyToAlgorandAddress(
            account.publicKey
          )}
          isOpen={isShareAddressModalOpen}
          onClose={onShareAddressModalClose}
        />
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
