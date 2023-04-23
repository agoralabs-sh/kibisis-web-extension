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
} from 'react-router-dom';

// Components
import AccountActivityTab from '@extension/components/AccountActivityTab';
import AccountAssetsTab from '@extension/components/AccountAssetsTab';
import AccountNftsTab from '@extension/components/AccountNftsTab';
import CopyIconButton from '@extension/components/CopyIconButton';
import EmptyState from '@extension/components/EmptyState';
import IconButton from '@extension/components/IconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import ShareAddressModal from '@extension/components/ShareAddressModal';
import NetworkSelect, {
  NetworkSelectSkeleton,
} from '@extension/components/NetworkSelect';
import NativeBalance, {
  NativeBalanceSkeleton,
} from '@extension/components/NativeBalance';

// Constants
import { ADD_ACCOUNT_ROUTE, ACCOUNTS_ROUTE } from '@extension/constants';

// Features
import { removeAccountThunk } from '@extension/features/accounts';
import { setConfirm } from '@extension/features/application';
import { setSettings } from '@extension/features/settings';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAccount,
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectFetchingSettings,
  useSelectIsOnline,
  useSelectNetworks,
  useSelectPreferredBlockExplorer,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  IExplorer,
  INetwork,
  ISettings,
} from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { address } = useParams();
  const {
    isOpen: isShareAddressModalOpen,
    onClose: onShareAddressModalClose,
    onOpen: onShareAddressModalOpen,
  } = useDisclosure();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const account: IAccount | null = useSelectAccount(address);
  const accounts: IAccount[] = useSelectAccounts();
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const fetchingSettings: boolean = useSelectFetchingSettings();
  const online: boolean = useSelectIsOnline();
  const networks: INetwork[] = useSelectNetworks();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const settings: ISettings = useSelectSettings();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
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
  const handleRemoveAccountClick = (address: string) => () => {
    dispatch(
      setConfirm({
        description: t<string>('captions.removeAccount', {
          address: ellipseAddress(address || '', {
            end: 10,
            start: 10,
          }),
        }),
        onConfirm: () => dispatch(removeAccountThunk(address)),
        title: t<string>('headings.removeAccount'),
        warningText: t<string>('captions.removeAccountWarning'),
      })
    );
  };
  const renderContent = () => {
    const headerContainerProps: StackProps = {
      alignItems: 'flex-start',
      p: 4,
      w: 'full',
    };

    if (fetchingAccounts || fetchingSettings) {
      return (
        <VStack {...headerContainerProps}>
          <NetworkSelectSkeleton network={networks[0]} />
          <HStack alignItems="center" w="full">
            {/* Address */}
            <Skeleton>
              <Text color="gray.500" fontSize="xs">
                {ellipseAddress(faker.random.alphaNumeric(58).toUpperCase())}
              </Text>
            </Skeleton>

            <Spacer />

            {/* Balance */}
            <NativeBalanceSkeleton />
          </HStack>
        </VStack>
      );
    }

    if (account && selectedNetwork) {
      return (
        <>
          {/* Header */}
          <VStack {...headerContainerProps}>
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

              {/*Network selection*/}
              <NetworkSelect
                network={selectedNetwork}
                networks={networks}
                onSelect={handleNetworkSelect}
              />
            </HStack>
            <HStack alignItems="center" w="full">
              {/* Name/address */}
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
                  {ellipseAddress(account.address)}
                </Heading>
              )}

              <Spacer />

              {/* Balance */}
              <NativeBalance
                atomicBalance={new BigNumber(account.atomicBalance)}
                minAtomicBalance={new BigNumber(account.minAtomicBalance)}
                nativeCurrency={selectedNetwork.nativeCurrency}
              />
            </HStack>

            {/*Address and interactions*/}
            <HStack alignItems="center" spacing={1} w="full">
              <Tooltip label={account.address}>
                <Text color={subTextColor} fontSize="xs">
                  {ellipseAddress(account.address, { end: 10, start: 10 })}
                </Text>
              </Tooltip>
              <Spacer />
              {/*Copy address*/}
              <CopyIconButton
                ariaLabel="Copy address"
                copiedTooltipLabel={t<string>('captions.addressCopied')}
                value={account.address}
              />

              {/*Open address on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.accountPath}/${account.address}`}
                />
              )}

              {/*Share address*/}
              <Tooltip label={t<string>('labels.shareAddress')}>
                <IconButton
                  aria-label="Show QR code"
                  icon={IoQrCodeOutline}
                  onClick={onShareAddressModalOpen}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*Remove account*/}
              <Tooltip label={t<string>('labels.removeAccount')}>
                <IconButton
                  aria-label="Remove account"
                  icon={IoTrashOutline}
                  onClick={handleRemoveAccountClick(account.address)}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
          </VStack>

          {/* Assets/NFTs/Activity tabs */}
          <Tabs
            colorScheme={primaryColorScheme}
            flexGrow={1}
            m={0}
            overflowY="scroll"
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
              maxH="100dvh"
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              <AccountAssetsTab account={account} />
              <AccountNftsTab />
              <AccountActivityTab />
            </TabPanels>
          </Tabs>
        </>
      );
    }

    return (
      <>
        {/* Empty state */}
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
    // if there is no account, go to the first account, or the accounts index if no accounts exist
    if (!account) {
      navigate(
        `${ACCOUNTS_ROUTE}${accounts[0] ? `/${accounts[0].address}` : ''}`,
        {
          replace: true,
        }
      );

      return;
    }

    // if there is an account, but the location doesn't match, change the location
    if (!location.pathname.includes(account.address)) {
      navigate(`${ACCOUNTS_ROUTE}/${account.address}`, {
        preventScrollReset: true,
        replace: true,
      });

      return;
    }
  }, [account]);

  return (
    <>
      {account && (
        <ShareAddressModal
          address={account.address}
          isOpen={isShareAddressModalOpen}
          onClose={onShareAddressModalClose}
        />
      )}
      <VStack alignItems="flex-start" flexGrow={1} w="full">
        {renderContent()}
      </VStack>
    </>
  );
};

export default AccountPage;
