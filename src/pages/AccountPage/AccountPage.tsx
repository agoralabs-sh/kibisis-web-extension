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
  IoInformationCircleOutline,
  IoQrCodeOutline,
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
import AlgorandIcon from '../../components/AlgorandIcon';
import Button from '../../components/Button';
import ChainBadge from '../../components/ChainBadge';
import CopyButton from '../../components/CopyButton';
import IconButton from '../../components/IconButton';
import MainLayout from '../../components/MainLayout';
import MainPageShell from '../../components/MainPageShell';
import ShareAddressModal from '../../components/ShareAddressModal';

// Constants
import { ACCOUNTS_ROUTE } from '../../constants';

// Features
import { setSettings } from '../../features/settings';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';
import useTextBackgroundColor from '../../hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccount,
  useSelectFetchingAccounts,
  useSelectFetchingSettings,
  useSelectNetworks,
  useSelectSettings,
} from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAccount, IAppThunkDispatch, INetwork, ISettings } from '../../types';

// Utils
import {
  createIconFromDataUri,
  convertToStandardUnit,
  ellipseAddress,
  formatCurrencyUnit,
} from '../../utils';

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
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const account: IAccount | null = useSelectAccount(address);
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const fetchingSettings: boolean = useSelectFetchingSettings();
  const networks: INetwork[] = useSelectNetworks();
  const settings: ISettings = useSelectSettings();
  const handleAddAccountClick = () => {
    console.log('add account');
  };
  const handleNetworkClick = (network: INetwork) => () => {
    dispatch(
      setSettings({
        ...settings,
        network,
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
          <HStack justifyContent="flex-end" w="full">
            <Menu>
              <MenuButton
                as={ChakraButton}
                rightIcon={<IoChevronDown />}
                variant="ghost"
              >
                <ChainBadge network={settings.network} />
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
            <Heading color={defaultTextColor} size="md">
              {account.name || ellipseAddress(account.address)}
            </Heading>
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
            <CopyButton
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
          </HStack>
        </VStack>
      );
    }

    return (
      <>
        <Spacer />
        <VStack spacing={5} w="full">
          <Heading color="gray.500" size="md">
            {t<string>('headings.noAccountsFound')}
          </Heading>
          <Button
            colorScheme="primary"
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
    if (account && !location.pathname.includes(account.address)) {
      navigate(`${ACCOUNTS_ROUTE}/${account.address}`, {
        replace: true,
      });
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
      <MainPageShell>
        <MainLayout>{renderContent()}</MainLayout>
      </MainPageShell>
    </>
  );
};

export default AccountPage;
