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
import { decode as decodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { decodeSignedTransaction, SignedTransaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// enums
import { TransactionTypeEnum } from '@extension/enums';
// TODO add method enums for arc200

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IWindow } from '@external/types';
import { IAccountInformation } from './types';

// utils
import { convertToStandardUnit } from '@common/utils';
import { getNotPureStakeAlgodClient } from './utils';
import getArc200AssetClient from './utils/getArc200Client';

interface IProps {
  account: IAccountInformation | null;
  network: INetwork | null;
  toast: CreateToastFnReturn;
}

const ARC200ActionsTab: FC<IProps> = ({ account, network, toast }: IProps) => {
  const [amount, setAmount] = useState<BigNumber>(new BigNumber('0'));
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  //const [note, setNote] = useState<string>('');
  const [assets, setAssets] = useState<string[]>([
    '6779767', // VIA
    '6778021', // VRC200
  ]);
  const [assetInfo, setAssetInformation] = useState<any>(null);
  /*
    id: '6779767',
    decimals: 6,
    balance: 0,
    name: 'Voi Incentive Accets',
    symbol: 'VIA',
  });
  */
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [address, setAddress] = useState<string>('');

  const handleAmountChange = (valueAsString: string) =>
    setAmount(new BigNumber(valueAsString));

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAddress(event.target.value);

  const handleSelectAssetChange = (assetId: string) => {
    if (!account) {
      return;
    }
    handleUpdateAsset(assets.find((value) => value === assetId) || null);
  };
  const handleSignTransactionClick =
    (type: TransactionTypeEnum) => async () => {
      const algorand: AlgorandProvider | undefined = (window as IWindow)
        .algorand;
      let result: IBaseResult & ISignTxnsResult;
      let unsignedTransactions: string[] | null = null;

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
          case TransactionTypeEnum.AssetCreate:
            // TODO: handle arc200 asset create
            break;
          case TransactionTypeEnum.AssetDestroy:
          // TODO: handle arc200 asset destroy
          case TransactionTypeEnum.AssetTransfer: {
            if (!selectedAsset) {
              toast({
                description: 'Select an asset from the list.',
                status: 'error',
                title: 'No Asset Selected!',
              });

              return;
            }
            const { arc200_transfer, arc200_decimals } =
              await getArc200AssetClient(
                account,
                network as INetwork,
                Number(selectedAsset)
              );
            const decimals = await arc200_decimals();
            // TODO: fix this
            const aus = BigNumber(amount)
              .multipliedBy(BigNumber(10).pow(decimals.returnValue))
              .toNumber();
            const res = await arc200_transfer(address, aus);
            if (!res.success) {
              toast({
                status: 'error',
                title: 'Transaction Failed!',
                description: `Failed to transfer asset "${selectedAsset}"`,
              });
              return;
            }
            unsignedTransactions = res.txns;
            break;
          }
          default:
            break;
        }

        if (!unsignedTransactions) {
          toast({
            status: 'error',
            title: 'Unknown Transaction Type',
          });
          return;
        }

        result = await algorand.signTxns({
          txns: unsignedTransactions.map((txn) => ({ txn })),
        });

        const r = await getNotPureStakeAlgodClient(network as INetwork)
          .sendRawTransaction(
            result.stxns.map(
              (stxn: string) => new Uint8Array(Buffer.from(stxn, 'base64'))
            )
          )
          .do();
        // TODO: confirm transaction

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
  const handleUpdateAsset = async (newSelectedAsset: string | null) => {
    const { getMetadata, arc200_balanceOf } = await getArc200AssetClient(
      account,
      network as INetwork,
      Number(newSelectedAsset)
    );
    const tm = await getMetadata();
    const bal = await arc200_balanceOf(account.address);
    if (!tm.success || !bal.success) {
      // TODO: handle error
      // TODO: show error message
      return;
    }
    setAssetInformation({
      id: newSelectedAsset,
      balance: bal.returnValue,
      ...tm.returnValue,
    });
    setSelectedAsset(newSelectedAsset);
  };

  useEffect(() => {
    if (account && !selectedAsset) {
      setSelectedAsset(account.assets[0] || null);
    }
  }, [account]);

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
                      assetInfo?.balance || 0,
                      assetInfo?.decimals || 0
                    ).toString()
                  )
                : 0
            }
            precision={assetInfo ? assetInfo.decimals : 0}
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

        {/*Address*/}

        <HStack w="full">
          <Text size="md" textAlign="left">
            Address:
          </Text>
          <Input onChange={handleAddressChange} value={address} />
        </HStack>

        {/*Assets*/}
        <Text size="md" textAlign="left" w="full">
          Assets:
        </Text>
        {assets.length > 0 ? (
          <>
            <RadioGroup
              onChange={handleSelectAssetChange}
              value={selectedAsset}
              w="full"
            >
              <Stack spacing={4} w="auto">
                {assets.map((asset, index) => (
                  <HStack
                    key={`asset-action-item-${index}`}
                    spacing={2}
                    w="auto"
                  >
                    <Radio size="lg" value={asset} />
                    <Text size="md">{asset}</Text>
                  </HStack>
                ))}
              </Stack>
            </RadioGroup>
            {selectedAsset && assetInfo && (
              <HStack
                key={`asset-action-item-${assetInfo.id}`}
                spacing={2}
                w="full"
              >
                <Text size="md">{assetInfo.id}</Text>
                <Spacer />
                {assetInfo && (
                  <Text size="md">
                    {convertToStandardUnit(
                      assetInfo.balance,
                      assetInfo.decimals
                    ).toString()}
                  </Text>
                )}
                {assetInfo.symbol && <Text size="md">{assetInfo.symbol}</Text>}
              </HStack>
            )}
          </>
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

        {/*sign transaction button*/}
        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          {[
            {
              disabled: !selectedAsset,
              type: TransactionTypeEnum.AssetTransfer,
              label: 'Transfer',
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

export default ARC200ActionsTab;
