import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';
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
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useState } from 'react';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Theme
import { theme } from '@extension/theme';

// Types
import { INetwork } from '@extension/types';
import { IWindow } from '@external/types';
import { IAccountInformation } from './types';

// Utils
import { convertToStandardUnit } from '@common/utils';
import { createAppCallTransaction } from './utils';

interface IProps {
  account: IAccountInformation | null;
  network: INetwork | null;
  toast: CreateToastFnReturn;
}

const ApplicationActionsTab: FC<IProps> = ({
  account,
  network,
  toast,
}: IProps) => {
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleSignTransactionClick =
    (type: TransactionTypeEnum) => async () => {
      const algorand: AlgorandProvider | undefined = (window as IWindow)
        .algorand;
      let result: IBaseResult & ISignTxnsResult;
      let unsignedTransaction: Transaction | null = null;

      if (!account || !network) {
        toast({
          description: 'You must first enable the dApp with the wallet.',
          status: 'error',
          title: 'No Account Not Found!',
        });

        return;
      }

      if (!algorand) {
        toast({
          description:
            'Algorand Provider has been intialized; there is no supported wallet.',
          status: 'error',
          title: 'window.algorand Not Found!',
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

        result = await algorand.signTxns({
          txns: [
            {
              txn: encodeBase64(encodeUnsignedTransaction(unsignedTransaction)),
            },
          ],
        });

        toast({
          description: `Successfully signed transaction for wallet "${result.id}".`,
          status: 'success',
          title: 'Transaction Signed!',
        });

        if (result.stxns[0]) {
          setSignedTransaction(
            decodeSignedTransaction(decodeBase64(result.stxns[0]))
          );
        }
      } catch (error) {
        toast({
          description: (error as BaseError).message,
          status: 'error',
          title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
        });
      }
    };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*balance*/}
        <HStack spacing={2} w="full">
          <Text size="md" textAlign="left">
            Balance:
          </Text>
          <Spacer />
          <Text size="md" textAlign="left">
            {account && network
              ? `${convertToStandardUnit(
                  account.balance,
                  network.nativeCurrency.decimals
                )} ${network.nativeCurrency.code}`
              : 'N/A'}
          </Text>
        </HStack>

        {/*note*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*signed transaction data*/}
        <VStack spacing={3} w="full">
          <HStack spacing={2} w="full">
            <Text>Signed transaction:</Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.txn.toString() || '-'}
            </Code>
          </HStack>
          <HStack spacing={2} w="full">
            <Text>Signed transaction signature (hex):</Text>
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
          ].map(({ label, type }) => (
            <GridItem key={nanoid()}>
              <Button
                borderRadius={theme.radii['3xl']}
                colorScheme="primaryLight"
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

export default ApplicationActionsTab;
