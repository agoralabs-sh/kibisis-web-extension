import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
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
import { createKeyRegistrationTransaction } from '../../utils';

const SignKeyRegistrationTransactionTab: FC<IBaseTransactionProps> = ({
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
  const handleSignTransactionClick = (online: boolean) => async () => {
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
      unsignedTransaction = await createKeyRegistrationTransaction({
        from: account.address,
        network,
        note: note.length > 0 ? note : null,
        online,
      });
      result = await signTransactionsAction([
        {
          txn: encodeBase64(encodeUnsignedTransaction(unsignedTransaction)),
        },
      ]);

      if (result && result[0]) {
        toast({
          description: `Successfully signed key registration transaction for provider "${connectionType}".`,
          status: 'success',
          title: 'Key Reg Transaction Signed!',
        });

        setSignedTransaction(decodeSignedTransaction(decodeBase64(result[0])));
      }
    } catch (error) {
      toast({
        description: error.message,
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
          <Text color={defaultTextColor} size="sm" textAlign="left">
            Balance:
          </Text>
          <Spacer />
          <Text color={subTextColor} size="sm" textAlign="left">
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
          <Text color={defaultTextColor} size="sm" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*signed transaction data*/}
        <VStack spacing={3} w="full">
          <HStack spacing={2} w="full">
            <Text color={defaultTextColor} size="sm">
              Signed transaction:
            </Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.txn.toString() || '-'}
            </Code>
          </HStack>
          <HStack spacing={2} w="full">
            <Text color={defaultTextColor} size="sm">
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
        <VStack spacing={2} w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            onClick={handleSignTransactionClick(true)}
            size="lg"
          >
            Send Online Key Registration Transaction
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            onClick={handleSignTransactionClick(false)}
            size="lg"
          >
            Send Offline Key Registration Transaction
          </Button>
        </VStack>
      </VStack>
    </TabPanel>
  );
};

export default SignKeyRegistrationTransactionTab;
