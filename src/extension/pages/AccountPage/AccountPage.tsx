import {
  Button as ChakraButton,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoAdd,
  IoChevronDown,
  IoCloudOfflineOutline,
  IoInformationCircleOutline,
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
import AlgorandIcon from '@extension/components/AlgorandIcon';
import Button from '@extension/components/Button';
import ChainBadge from '@extension/components/ChainBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import IconButton from '@extension/components/IconButton';
import ShareAddressModal from '@extension/components/ShareAddressModal';

// Constants
import { ADD_ACCOUNT_ROUTE, ACCOUNTS_ROUTE } from '@extension/constants';

// Features
import { removeAccountThunk } from '@extension/features/accounts';
import { setConfirm } from '@extension/features/application';
import { setSettings } from '@extension/features/settings';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccount,
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectFetchingSettings,
  useSelectIsOnline,
  useSelectNetworks,
  useSelectSettings,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  INetwork,
  ISettings,
} from '@extension/types';

// Utils
import {
  createIconFromDataUri,
  convertToStandardUnit,
  ellipseAddress,
  formatCurrencyUnit,
} from '@extension/utils';

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
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const account: IAccount | null = useSelectAccount(address);
  const accounts: IAccount[] = useSelectAccounts();
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const fetchingSettings: boolean = useSelectFetchingSettings();
  const online: boolean = useSelectIsOnline();
  const networks: INetwork[] = useSelectNetworks();
  const settings: ISettings = useSelectSettings();
  const handleAddAccountClick = () => navigate(ADD_ACCOUNT_ROUTE);
  const handleNetworkClick = (network: INetwork) => () => {
    dispatch(
      setSettings({
        ...settings,
        network,
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
    let balanceStandardUnit: BigNumber;
    let minumumStandardUnit: BigNumber;

    if (fetchingAccounts || fetchingSettings) {
      return (
        <VStack alignItems="flex-start" pt={4} px={4} w="full">
          {/* Header */}
          <HStack justifyContent="flex-end" w="full">
            <Skeleton>
              <ChakraButton rightIcon={<IoChevronDown />} variant="ghost">
                <ChainBadge network={networks[0]} />
              </ChakraButton>
            </Skeleton>
          </HStack>
          {/* Balance */}
          <HStack alignItems="center" w="full">
            <Skeleton flexGrow="1">
              <Heading color={defaultTextColor} size="md">
                {ellipseAddress(faker.random.alphaNumeric(52).toUpperCase())}
              </Heading>
            </Skeleton>
            <Skeleton>
              <HStack
                backgroundColor="gray.200"
                borderRadius={25}
                px={2}
                py={1}
                spacing={1}
              >
                <Text color="gray.500" fontSize="sm">{`${t<string>(
                  'labels.balance'
                )}:`}</Text>
                <Text color="gray.500" fontSize="sm">
                  0
                </Text>
                <AlgorandIcon color="black" h={3} w={3} />
              </HStack>
            </Skeleton>
          </HStack>
          {/* Address */}
          <Skeleton flexGrow="1">
            <Text color="gray.500" fontSize="xs">
              {ellipseAddress(faker.random.alphaNumeric(52).toUpperCase())}
            </Text>
          </Skeleton>
        </VStack>
      );
    }

    if (account && settings.network) {
      balanceStandardUnit = convertToStandardUnit(
        new BigNumber(account.atomicBalance),
        settings.network.nativeCurrency.decimals
      );
      minumumStandardUnit = convertToStandardUnit(
        new BigNumber(account.minAtomicBalance),
        settings.network.nativeCurrency.decimals
      );

      return (
        <VStack alignItems="flex-start" pt={4} px={4} w="full">
          {/* Header */}
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
            <Menu>
              <MenuButton
                _hover={{ bg: buttonHoverBackgroundColor }}
                borderRadius="md"
                px={4}
                py={2}
                transition="all 0.2s"
              >
                <HStack justifyContent="space-between" w="full">
                  <ChainBadge network={settings.network} />
                  <Icon as={IoChevronDown} />
                </HStack>
              </MenuButton>
              <MenuList>
                {networks.map((value) => (
                  <MenuItem
                    key={nanoid()}
                    minH="48px"
                    onClick={handleNetworkClick(value)}
                  >
                    <ChainBadge network={value} />
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
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
            <HStack alignItems="center" justifyContent="center" spacing={1}>
              <Tooltip
                aria-label="Minimum balance information"
                label={t<string>('captions.minimumBalance', {
                  amount: formatCurrencyUnit(minumumStandardUnit),
                })}
              >
                <span
                  style={{
                    height: '1em',
                    lineHeight: '1em',
                  }}
                >
                  <Icon
                    as={IoInformationCircleOutline}
                    color={defaultTextColor}
                  />
                </span>
              </Tooltip>
              <HStack
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={2}
                py={1}
                spacing={1}
              >
                <Text color={defaultTextColor} fontSize="sm">{`${t<string>(
                  'labels.balance'
                )}:`}</Text>
                <Text color={defaultTextColor} fontSize="sm">
                  {formatCurrencyUnit(balanceStandardUnit)}
                </Text>
                {createIconFromDataUri(
                  settings.network.nativeCurrency.iconUri,
                  {
                    color: 'black.500',
                    h: 3,
                    w: 3,
                  }
                )}
              </HStack>
            </HStack>
          </HStack>
          {/* Address and interactions */}
          <HStack alignItems="center" spacing={1} w="full">
            <Tooltip label={account.address}>
              <Text color={subTextColor} fontSize="xs">
                {ellipseAddress(account.address, { end: 10, start: 10 })}
              </Text>
            </Tooltip>
            <Spacer />
            <CopyIconButton
              ariaLabel="Copy address"
              copiedTooltipLabel={t<string>('captions.addressCopied')}
              value={account.address}
            />
            <Tooltip label={t<string>('labels.shareAddress')}>
              <IconButton
                aria-label="Show QR code"
                icon={IoQrCodeOutline}
                onClick={onShareAddressModalOpen}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
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
      );
    }

    return (
      <>
        <Spacer />
        <VStack spacing={5} w="full">
          <Heading color={defaultTextColor} size="md">
            {t<string>('headings.noAccountsFound')}
          </Heading>
          <Button
            colorScheme={primaryColorScheme}
            onClick={handleAddAccountClick}
            rightIcon={<IoAdd />}
          >
            {t<string>('buttons.addAccount')}
          </Button>
        </VStack>
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
      {renderContent()}
    </>
  );
};

export default AccountPage;
