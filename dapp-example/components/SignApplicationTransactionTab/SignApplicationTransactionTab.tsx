import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
  Grid,
  GridItem,
  HStack,
  Input,
  Spacer,
  TabPanel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import {
  decodeSignedTransaction,
  encodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import usePrimaryColorScheme from '../../hooks/usePrimaryColorScheme';
import useSubTextColor from '../../hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IBaseTransactionProps } from '../../types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import { createAppCallTransaction } from '../../utils';

const SignApplicationTransactionTab: FC<IBaseTransactionProps> = ({
  account,
  connectionType,
  network,
  signTransactionsAction,
}) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // states
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  // handlers
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleSignTransactionClick =
    (type: TransactionTypeEnum) => async () => {
      let result: (string | null)[] | null = null;
      let unsignedTransaction: Transaction | null = null;

      if (!account || !connectionType || !network) {
        toast({
          description: 'You must first enable the dApp with the wallet.',
          status: 'error',
          title: 'No Account Not Found!',
        });

        return;
      }

      try {
        unsignedTransaction = await createAppCallTransaction({
          from: account.address,
          network,
          note: note.length > 0 ? note : null,
          type,
        });

        if (!unsignedTransaction) {
          toast({
            status: 'error',
            title: 'Unknown Transaction Type',
          });

          return;
        }

        result = await signTransactionsAction([
          {
            txn: encodeBase64(encodeUnsignedTransaction(unsignedTransaction)),
          },
        ]);

        if (result && result[0]) {
          toast({
            description: `Successfully signed application transaction for provider "${connectionType}".`,
            status: 'success',
            title: 'Application Transaction Signed!',
          });

          setSignedTransaction(
            decodeSignedTransaction(decodeBase64(result[0]))
          );
        }
      } catch (error) {
        toast({
          description: (error as BaseARC0027Error).message,
          status: 'error',
          title: `${(error as BaseARC0027Error).code}: ${
            (error as BaseARC0027Error).name
          }`,
        });
      }
    };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*balance*/}
        <HStack spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="sm" textAlign="left">
            Balance:
          </Text>
          <Spacer />
          <Text color={subTextColor} fontSize="sm" textAlign="left">
            {account && network
              ? `${convertToStandardUnit(
                  account.balance,
                  network.nativeCurrency.decimals
                )} ${network.nativeCurrency.symbol}`
              : 'N/A'}
          </Text>
        </HStack>

        {/*note*/}
        <HStack w="full">
          <Text color={defaultTextColor} fontSize="sm" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*signed transaction data*/}
        <VStack spacing={3} w="full">
          <HStack spacing={2} w="full">
            <Text color={defaultTextColor} fontSize="sm">
              Signed transaction:
            </Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.txn.toString() || '-'}
            </Code>
          </HStack>
          <HStack spacing={2} w="full">
            <Text color={defaultTextColor} fontSize="sm">
              Signed transaction signature (hex):
            </Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.sig
                ? encodeHex(signedTransaction.sig).toUpperCase()
                : '-'}
            </Code>
          </HStack>
        </VStack>

        {/*sign transaction button*/}
        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          {[
            {
              type: TransactionTypeEnum.ApplicationCreate,
              label: 'Send Create App Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationOptIn,
              label: 'Send App Opt-In Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationNoOp,
              label: 'Send App NoOp Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationClearState,
              label: 'Send App Clear State Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationCloseOut,
              label: 'Send App Close Out Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationDelete,
              label: 'Send Delete App Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationUpdate,
              label: 'Send Update App Transaction',
            },
          ].map(({ label, type }, index) => (
            <GridItem
              key={`application-action-sign-transaction-button-item-${index}`}
            >
              <Button
                borderRadius={theme.radii['3xl']}
                colorScheme={primaryColorScheme}
                onClick={handleSignTransactionClick(type)}
                size="lg"
                w={365}
              >
                {label}
              </Button>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </TabPanel>
  );
};

export default SignApplicationTransactionTab;
