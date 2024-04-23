import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';
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
  useToast,
  UseToastOptions,
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
import BigNumber from 'bignumber.js';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// theme
import { theme } from '@extension/theme';

// types
import type { IAssetInformation, IBaseTransactionProps } from '../../types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import {
  createAssetConfigTransaction,
  createAssetCreateTransaction,
  createAssetDestroyTransaction,
  createAssetFreezeTransaction,
  createAssetTransferTransaction,
} from '../../utils';

const AssetActionsTab: FC<IBaseTransactionProps> = ({
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
  // states
  const [amount, setAmount] = useState<BigNumber>(new BigNumber('0'));
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<IAssetInformation | null>(
    null
  );
  // handlers
  const handleAmountChange = (valueAsString: string) =>
    setAmount(new BigNumber(valueAsString));
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
    (type: TransactionTypeEnum) => async () => {
      let result: (string | null)[] | null = null;
      let toastErrorOptions: UseToastOptions;
      let unsignedTransaction: Transaction | null = null;

      if (!account || !connectionType || !network) {
        toast({
          description: 'You must first enable the dApp with the wallet.',
          status: 'error',
          title: 'No Account Not Found!',
        });

        return;
      }

      toastErrorOptions = {
        description: 'Select an asset from the list.',
        status: 'error',
        title: 'No Asset Selected!',
      };

      try {
        switch (type) {
          case TransactionTypeEnum.AssetConfig:
            if (!selectedAsset) {
              toast(toastErrorOptions);

              return;
            }

            unsignedTransaction = await createAssetConfigTransaction({
              assetId: selectedAsset.id,
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
            });

            break;
          case TransactionTypeEnum.AssetCreate:
            unsignedTransaction = await createAssetCreateTransaction({
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
            });

            break;
          case TransactionTypeEnum.AssetDestroy:
            if (!selectedAsset) {
              toast(toastErrorOptions);

              return;
            }

            unsignedTransaction = await createAssetDestroyTransaction({
              assetId: selectedAsset.id,
              from: account.address,
              network,
              note: note.length > 0 ? note : null,
            });

            break;
          case TransactionTypeEnum.AssetFreeze:
            if (!selectedAsset) {
              toast(toastErrorOptions);

              return;
            }

            unsignedTransaction = await createAssetFreezeTransaction({
              assetId: selectedAsset.id,
              from: account.address,
              freezeTarget: account.address,
              isFreezing: true,
              network,
              note: note.length > 0 ? note : null,
            });

            break;
          case TransactionTypeEnum.AssetTransfer:
            if (!selectedAsset) {
              toast(toastErrorOptions);

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
          case TransactionTypeEnum.AssetUnfreeze:
            if (!selectedAsset) {
              toast(toastErrorOptions);

              return;
            }

            unsignedTransaction = await createAssetFreezeTransaction({
              assetId: selectedAsset.id,
              from: account.address,
              freezeTarget: account.address,
              isFreezing: false,
              network,
              note: note.length > 0 ? note : null,
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

        result = await signTransactionsAction([
          {
            txn: encodeBase64(encodeUnsignedTransaction(unsignedTransaction)),
          },
        ]);

        if (result && result[0]) {
          toast({
            description: `Successfully signed payment transaction for provider "${connectionType}".`,
            status: 'success',
            title: 'Payment Transaction Signed!',
          });

          setSignedTransaction(
            decodeSignedTransaction(decodeBase64(result[0]))
          );
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
        {/*amount*/}
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

        {/*note*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*assets*/}
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
              {account.assets.map((asset, index) => (
                <HStack key={`asset-action-item-${index}`} spacing={2} w="full">
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
              disabled: !selectedAsset,
              type: TransactionTypeEnum.AssetTransfer,
              label: 'Send Asset Transfer Transaction',
            },
            {
              disabled: !selectedAsset,
              type: TransactionTypeEnum.AssetConfig,
              label: 'Send Asset Config Transaction',
            },
            {
              disabled: false,
              type: TransactionTypeEnum.AssetCreate,
              label: 'Send Asset Create Transaction',
            },
            {
              disabled: !selectedAsset,
              type: TransactionTypeEnum.AssetDestroy,
              label: 'Send Asset Destroy Transaction',
            },
            {
              disabled: !selectedAsset,
              type: TransactionTypeEnum.AssetFreeze,
              label: 'Send Asset Freeze Transaction',
            },
            {
              disabled: !selectedAsset,
              type: TransactionTypeEnum.AssetUnfreeze,
              label: 'Send Asset Unfreeze Transaction',
            },
          ].map(({ disabled, label, type }, index) => (
            <GridItem
              key={`asset-action-sign-transaction-button-item-${index}`}
            >
              <Button
                borderRadius={theme.radii['3xl']}
                colorScheme="primaryLight"
                isDisabled={disabled}
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

export default AssetActionsTab;
