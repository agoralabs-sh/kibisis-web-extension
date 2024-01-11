import { BaseError } from '@agoralabs-sh/algorand-provider';
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
import { decode as decodeBase64 } from '@stablelib/base64';
import { useWallet } from '@txnlab/use-wallet';
import { encode as encodeHex } from '@stablelib/hex';
import {
  decodeSignedTransaction,
  encodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';

// components
import ConnectionNotInitializedContent from '../ConnectionNotInitializedContent';

// enums
import { ConnectionTypeEnum } from '../../enums';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IAccountInformation } from '../../types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import {
  algorandProviderSignTxns,
  createKeyRegistrationTransaction,
  useWalletSignTxns,
} from '../../utils';

interface IProps {
  account: IAccountInformation | null;
  connectionType: ConnectionTypeEnum | null;
  network: INetwork | null;
}

const KeyRegistrationActionsTab: FC<IProps> = ({
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
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
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
  // renders
  const renderContent = () => {
    if (!connectionType) {
      return <ConnectionNotInitializedContent />;
    }

    return (
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
        <VStack spacing={2} w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            onClick={handleSignTransactionClick(true)}
            size="lg"
          >
            Send Online Key Registration Transaction
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            onClick={handleSignTransactionClick(false)}
            size="lg"
          >
            Send Offline Key Registration Transaction
          </Button>
        </VStack>
      </VStack>
    );
  };

  return <TabPanel w="full">{renderContent()}</TabPanel>;
};

export default KeyRegistrationActionsTab;
