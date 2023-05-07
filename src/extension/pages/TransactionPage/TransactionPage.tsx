import { Box, Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowDownOutline, IoArrowUpOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import LoadingPage from '@extension/components/LoadingPage';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';

// Constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';
import useTransactionPage from './hooks/useAssetPage';

// Selectors
import {
  useSelectPreferredBlockExplorer,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAccount, IExplorer, INetwork } from '@extension/types';

// Utils
import { formatCurrencyUnit } from '@common/utils';
import { ellipseAddress } from '@extension/utils';

const TransactionPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { address, transactionId } = useParams();
  // selectors
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const { account, accountInformation, transaction } = useTransactionPage({
    address: address || null,
    transactionId: transactionId || null,
    onError: () =>
      navigate(ACCOUNTS_ROUTE, {
        replace: true,
      }),
  });
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  let accountAddress: string;

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!address || !transactionId) {
      return reset();
    }
  }, []);

  if (!account || !accountInformation || !transaction) {
    return <LoadingPage />;
  }

  accountAddress = AccountService.convertPublicKeyToAlgorandAddress(
    account.publicKey
  );

  return (
    <>
      <PageHeader
        title={t<string>('headings.transaction', { context: transaction.type })}
      />
      <VStack
        alignItems="center"
        justifyContent="flex-start"
        px={4}
        spacing={4}
        w="full"
      ></VStack>
    </>
  );
};

export default TransactionPage;
