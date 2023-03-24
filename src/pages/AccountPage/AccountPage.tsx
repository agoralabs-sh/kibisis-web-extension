import {
  Heading,
  HStack,
  Skeleton,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';
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

// Selectors
import {
  useSelectAccount,
  useSelectFetchingAccounts,
  useSelectFetchingSettings,
} from '../../selectors';

// Types
import { IAccount } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';
import { ACCOUNTS_ROUTE } from '../../constants';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { address } = useParams();
  const account: IAccount | null = useSelectAccount(address);
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const fetchingSettings: boolean = useSelectFetchingSettings();
  const handleAddAccountClick = () => {};
  const renderContent = () => {
    if (fetchingAccounts || fetchingSettings) {
      return (
        <VStack alignItems="flex-start" w="full">
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

    if (account) {
      return (
        <VStack alignItems="flex-start" spacing={1} w="full">
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
                {account.atomicBalance}
              </Text>
              <AlgorandIcon color="black" h={3} w={3} />
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
      <MainLayout>{renderContent()}</MainLayout>
    </PageShell>
  );
};

export default AccountPage;
