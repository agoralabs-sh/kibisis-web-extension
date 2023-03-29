import {
  Button as ChakraButton,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd, IoChevronDown } from 'react-icons/io5';
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
import CopyButton from '../../components/CopyButton';
import MainLayout from '../../components/MainLayout';
import PageShell from '../../components/PageShell';

// Constants
import { ACCOUNTS_ROUTE } from '../../constants';

// Selectors
import {
  useSelectAccount,
  useSelectFetchingAccounts,
  useSelectFetchingSettings,
  useSelectNetworks,
  useSelectSelectedNetwork,
} from '../../selectors';

// Types
import { IAccount, INetwork } from '../../types';

// Utils
import {
  createIconFromDataUri,
  convertToStandardUnit,
  ellipseAddress,
  formatCurrencyUnit,
} from '../../utils';
import ChainBadge from '../../components/ChainBadge';
import { nanoid } from 'nanoid';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { address } = useParams();
  const account: IAccount | null = useSelectAccount(address);
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const fetchingSettings: boolean = useSelectFetchingSettings();
  const networks: INetwork[] = useSelectNetworks();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const handleAddAccountClick = () => {
    console.log('add account');
  };
  const renderContent = () => {
    let standardUnit: BigNumber;

    if (fetchingAccounts || fetchingSettings) {
      return (
        <VStack alignItems="flex-start" pt={4} px={4} w="full">
          <HStack alignItems="center" w="full">
            <Skeleton flexGrow="1">
              <Heading color="gray.500" size="md">
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
        </VStack>
      );
    }

    if (account && selectedNetwork) {
      standardUnit = convertToStandardUnit(
        new BigNumber(account.atomicBalance),
        selectedNetwork.nativeCurrency.decimals
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
                <ChainBadge network={selectedNetwork} />
              </MenuButton>
              <MenuList>
                {networks.map((value) => (
                  <MenuItem key={nanoid()} minH="48px">
                    <ChainBadge network={value} />
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
          <HStack alignItems="center" w="full">
            <Heading color="gray.500" size="md">
              {account.name || ellipseAddress(account.address)}
            </Heading>
            <Spacer />
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
                {formatCurrencyUnit(standardUnit)}
              </Text>
              {createIconFromDataUri(selectedNetwork.nativeCurrency.iconUri, {
                color: 'black.500',
                h: 3,
                w: 3,
              })}
            </HStack>
          </HStack>
          <HStack alignItems="center" w="full">
            <Tooltip label={account.address}>
              <Text color="gray.500" fontSize="xs">
                {ellipseAddress(account.address, { end: 10, start: 10 })}
              </Text>
            </Tooltip>
            <Spacer />
            <CopyButton
              ariaLabel="Copy address"
              copiedTooltipLabel={t<string>('captions.addressCopied')}
              value={account.address}
            />
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
    <PageShell noPadding={true}>
      <MainLayout
        showHeader={false}
        title={
          account?.address || t<string>('titles.page', { context: 'accounts' })
        }
      >
        {renderContent()}
      </MainLayout>
    </PageShell>
  );
};

export default AccountPage;
