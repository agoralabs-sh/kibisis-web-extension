import { BaseError } from '@agoralabs-sh/algorand-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  TabPanel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useWallet } from '@txnlab/use-wallet';
import { decode as decodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import {
  decodeSignedTransaction,
  encodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { ChangeEvent, FC, useState } from 'react';

// enums
import { ConnectionTypeEnum } from '../../enums';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IAccountInformation } from '../../types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import {
  algorandProviderSignTxns,
  createPaymentTransaction,
  useWalletSignTxns,
} from '../../utils';

interface IProps {
  account: IAccountInformation | null;
  connectionType: ConnectionTypeEnum | null;
  network: INetwork | null;
}

const SignTxnTab: FC<IProps> = ({
  account,
  connectionType,
  network,
}: IProps) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  const { signTransactions } = useWallet();
  // states
  const [amount, setAmount] = useState<BigNumber>(new BigNumber('0'));
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  // handlers
  const handleAmountChange = (valueAsString: string) =>
    setAmount(new BigNumber(valueAsString));
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleSignTransactionClick = async () => {
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
      unsignedTransaction = await createPaymentTransaction({
        amount: convertToAtomicUnit(amount, network.nativeCurrency.decimals),
        from: account.address,
        network,
        note: note.length > 0 ? note : null,
        to: null,
      });

      switch (connectionType) {
        case ConnectionTypeEnum.AlgorandProvider:
          result = await algorandProviderSignTxns([unsignedTransaction]);

          if (!result) {
            toast({
              description:
                'Algorand Provider has been intialized; there is no supported wallet.',
              status: 'error',
              title: 'window.algorand Not Found!',
            });

            return;
          }

          break;
        case ConnectionTypeEnum.UseWallet:
          result = await useWalletSignTxns(
            signTransactions,
            [0],
            [encodeUnsignedTransaction(unsignedTransaction)]
          );

          break;
        default:
          break;
      }

      if (result && result[0]) {
        toast({
          description: `Successfully signed payment transaction for provider "${connectionType}".`,
          status: 'success',
          title: 'Payment Transaction Signed!',
        });

        setSignedTransaction(decodeSignedTransaction(decodeBase64(result[0])));
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
                )} ${network.nativeCurrency.symbol}`
              : 'N/A'}
          </Text>
        </HStack>

        {/*amount*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Amount:
          </Text>
          <NumberInput
            flexGrow={1}
            min={0}
            max={
              account && network
                ? parseFloat(
                    convertToStandardUnit(
                      account.balance,
                      network.nativeCurrency.decimals
                    ).toString()
                  )
                : 0
            }
            precision={network ? network.nativeCurrency.decimals : 0}
            onChange={handleAmountChange}
            value={amount.toString()}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
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

        {/*sign payment transaction button*/}
        <Button
          borderRadius={theme.radii['3xl']}
          colorScheme="primaryLight"
          onClick={handleSignTransactionClick}
          size="lg"
          w={365}
        >
          Send Payment Transaction
        </Button>
      </VStack>
    </TabPanel>
  );
};

export default SignTxnTab;
