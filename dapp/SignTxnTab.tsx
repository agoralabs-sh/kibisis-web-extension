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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
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
  OnApplicationComplete,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// Theme
import { theme } from '@extension/theme';

// Types
import { INetwork } from '@extension/types';
import { IWindow } from '@external/types';
import { IAccountInformation, IAssetInformation } from './types';

// Utils
import { convertToAtomicUnit, convertToStandardUnit } from '@common/utils';
import {
  createAppCallTransaction,
  createAssetTransferTransaction,
  createPaymentTransaction,
} from './utils';
import { atob } from 'buffer';

interface IProps {
  account: IAccountInformation | null;
  network: INetwork | null;
  toast: CreateToastFnReturn;
}

const SignTxnTab: FC<IProps> = ({ account, network, toast }: IProps) => {
  const [amount, setAmount] = useState<BigNumber>(new BigNumber('0'));
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<IAssetInformation | null>(
    null
  );
  const handleAmountChange = (valueAsString: string) => {
    console.log('handleAmountChange: ', valueAsString);

    setAmount(new BigNumber(valueAsString));
  };
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleSelectAssetChange = (assetId: string) => {
    if (!account) {
      return;
    }

    handleUpdateAsset(
      account.assets.find((value) => value.id === assetId) || null
    );
  };
  const handleSignTransactionClick =
    (type: string | OnApplicationComplete) => async () => {
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
        switch (type) {
          case OnApplicationComplete.ClearStateOC:
          case OnApplicationComplete.CloseOutOC:
          case OnApplicationComplete.DeleteApplicationOC:
          case OnApplicationComplete.OptInOC:
          case OnApplicationComplete.NoOpOC:
          case OnApplicationComplete.UpdateApplicationOC:
            unsignedTransaction = await createAppCallTransaction({
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
              type,
            });

            console.log('unsignedTransaction: ', unsignedTransaction);

            break;
          case 'app-create':
            unsignedTransaction = await createAppCallTransaction({
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
              type: null,
            });

            break;
          case 'asset-transfer':
            if (!selectedAsset) {
              toast({
                description: 'Select an asset from the list.',
                status: 'error',
                title: 'No Asset Selected!',
              });

              return;
            }

            unsignedTransaction = await createAssetTransferTransaction({
              amount: convertToAtomicUnit(amount, selectedAsset.decimals),
              assetId: selectedAsset.id,
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
              to: null,
            });

            break;

          case 'payment':
            unsignedTransaction = await createPaymentTransaction({
              amount: convertToAtomicUnit(
                amount,
                network.nativeCurrency.decimals
              ),
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
              to: null,
            });

            break;
          default:
            break;
        }

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
  const handleUpdateAsset = (newSelectedAsset: IAssetInformation | null) => {
    const maximumAmount: BigNumber = newSelectedAsset
      ? convertToStandardUnit(
          newSelectedAsset.balance,
          newSelectedAsset.decimals
        )
      : new BigNumber('0');

    setSelectedAsset(newSelectedAsset);
    setAmount(amount.gt(maximumAmount) ? maximumAmount : amount);
  };

  useEffect(() => {
    if (account && !selectedAsset) {
      setSelectedAsset(account.assets[0] || null);
    }
  }, [account]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*Balance*/}
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

        {/*Amount*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Amount:
          </Text>
          <NumberInput
            flexGrow={1}
            min={0}
            max={
              selectedAsset
                ? parseFloat(
                    convertToStandardUnit(
                      selectedAsset.balance,
                      selectedAsset.decimals
                    ).toString()
                  )
                : 0
            }
            precision={selectedAsset ? selectedAsset.decimals : 0}
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

        {/*Note*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*Assets*/}
        <Text size="md" textAlign="left" w="full">
          Assets:
        </Text>
        {account && account.assets.length > 0 ? (
          <RadioGroup
            onChange={handleSelectAssetChange}
            value={selectedAsset?.id}
            w="full"
          >
            <Stack spacing={4} w="full">
              {account.assets.map((asset) => (
                <HStack key={nanoid()} spacing={2} w="full">
                  <Radio size="lg" value={asset.id} />
                  <Text size="md">{asset.name || asset.id}</Text>
                  <Spacer />
                  <Text size="md">
                    {convertToStandardUnit(
                      asset.balance,
                      asset.decimals
                    ).toString()}
                  </Text>
                  {asset.symbol && <Text size="md">{asset.symbol}</Text>}
                </HStack>
              ))}
            </Stack>
          </RadioGroup>
        ) : (
          <VStack
            alignItems="center"
            justifyContent="center"
            minH={150}
            w="full"
          >
            <Text size="sm" textAlign="center">
              No assets found!
            </Text>
          </VStack>
        )}

        {/*Signed transaction data*/}
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

        {/*Sign transaction button*/}
        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          {[
            { type: 'payment', label: 'Send Payment Transaction' },
            {
              type: 'asset-transfer',
              label: 'Send Asset Transfer Transaction',
            },
            { type: 'app-create', label: 'Send Create App Transaction' },
            {
              type: OnApplicationComplete.OptInOC,
              label: 'Send App Opt-In Transaction',
            },
            {
              type: OnApplicationComplete.NoOpOC,
              label: 'Send App NoOp Transaction',
            },
            {
              type: OnApplicationComplete.ClearStateOC,
              label: 'Send App Clear State Transaction',
            },
            {
              type: OnApplicationComplete.CloseOutOC,
              label: 'Send App Close Out Transaction',
            },
            {
              type: OnApplicationComplete.DeleteApplicationOC,
              label: 'Send Delete App Transaction',
            },
            {
              type: OnApplicationComplete.UpdateApplicationOC,
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

export default SignTxnTab;
