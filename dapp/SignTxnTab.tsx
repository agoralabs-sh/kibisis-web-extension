import {
  BaseError,
  IBaseResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';
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
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encode as encodeHex } from '@stablelib/hex';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// Theme
import { theme } from '@extension/theme';

// Types
import { IWindow } from '@external/types';
import { IAssetInformation } from './types';

// Utils
import { convertToAtomicUnit, convertToStandardUnit } from '@common/utils';
import { createAssetTransaction, getAssetInformation } from './utils';
import {
  decodeSignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import { decode as decodeBase64 } from '@stablelib/base64';

interface IProps {
  signer: string | null;
  toast: CreateToastFnReturn;
}

const SignTxnTab: FC<IProps> = ({ signer, toast }: IProps) => {
  const [assets, setAssets] = useState<IAssetInformation[]>([]);
  const [amount, setAmount] = useState<BigNumber>(new BigNumber('0'));
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<IAssetInformation | null>(
    null
  );
  const handleAmountChange = (valueAsString: string) =>
    setAmount(new BigNumber(valueAsString));
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleSelectAssetChange = (assetId: string) =>
    handleUpdateAsset(assets.find((value) => value.id === assetId) || null);
  const handleSignPaymentTransactionClick = async () => {
    let result: IBaseResult & ISignTxnsResult;

    if (!selectedAsset || !signer) {
      console.error('no account information found');

      return;
    }

    if (!(window as IWindow).algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet.',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'window.algorand Not Found!',
      });

      return;
    }

    try {
      result = await (window as IWindow).algorand.signTxns({
        txns: [
          {
            txn: await createAssetTransaction({
              amount: convertToAtomicUnit(amount, selectedAsset.decimals),
              assetId: selectedAsset.id,
              from: signer,
              note: note.length > 0 ? note : null,
              to: null,
            }),
          },
        ],
      });

      toast({
        description: `Successfully signed transaction for wallet "${result.id}".`,
        duration: 3000,
        isClosable: true,
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
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });
    }
  };
  const handleUpdateAsset = (newSelectedAsset: IAssetInformation | null) => {
    const maximumAmount: BigNumber = newSelectedAsset
      ? convertToStandardUnit(
          newSelectedAsset.amount,
          newSelectedAsset.decimals
        )
      : new BigNumber('0');

    setSelectedAsset(newSelectedAsset);
    setAmount(amount.gt(maximumAmount) ? maximumAmount : amount);
  };

  useEffect(() => {
    let newAssets: IAssetInformation[];

    if (signer) {
      (async () => {
        try {
          newAssets = await getAssetInformation(signer);

          setAssets(newAssets);
          handleUpdateAsset(newAssets[0] || null);
        } catch (error) {
          toast({
            description: error.message,
            duration: 3000,
            isClosable: true,
            status: 'error',
            title: 'Failed to get asset information',
          });
        }
      })();
    }
  }, [signer]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
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
                      selectedAsset.amount,
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
        {assets.length > 0 ? (
          <RadioGroup
            defaultValue="0"
            onChange={handleSelectAssetChange}
            w="full"
          >
            <Stack spacing={4} w="full">
              {assets.map((asset) => (
                <HStack key={nanoid()} spacing={2} w="full">
                  <Radio size="lg" value={asset.id} />
                  <Text size="md">{asset.name || asset.id}</Text>
                  <Spacer />
                  <Text size="md">
                    {convertToStandardUnit(
                      asset.amount,
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
            <Text>Encoded signed transaction signature (hex):</Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.sig
                ? encodeHex(signedTransaction.sig).toUpperCase()
                : '-'}
            </Code>
          </HStack>
        </VStack>

        {/*Sign transaction button*/}
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignPaymentTransactionClick}
            size="lg"
          >
            Send Transaction
          </Button>
        </VStack>
      </VStack>
    </TabPanel>
  );
};

export default SignTxnTab;
