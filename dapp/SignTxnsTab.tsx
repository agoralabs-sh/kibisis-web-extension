import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Code,
  CreateToastFnReturn,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  TabPanel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from '@chakra-ui/react';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import {
  assignGroupID,
  computeGroupID,
  decodeSignedTransaction,
  encodeUnsignedTransaction,
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
import {
  convertToAtomicUnit,
  convertToStandardUnit,
  formatCurrencyUnit,
} from '@common/utils';
import { createAssetTransaction } from './utils';

interface IAssetValue {
  amount: BigNumber;
  id: string;
  isChecked: boolean;
}
interface IProps {
  account: IAccountInformation | null;
  network: INetwork | null;
  toast: CreateToastFnReturn;
}

const SignTxnsTab: FC<IProps> = ({ account, network, toast }: IProps) => {
  const [assetValues, setAssetValues] = useState<IAssetValue[]>([]);
  const [groupId, setGroupId] = useState<string>('N/A');
  const [signedTransactions, setSignedTransactions] = useState<
    (SignedTransaction | null)[]
  >([]);
  const handleAmountChange = (assetId: string) => (valueAsString: string) => {
    setAssetValues(
      assetValues.map((value) => {
        const asset: IAssetInformation | null =
          account?.assets.find((value) => value.id === assetId) || null;
        let amount: BigNumber;
        let maximumAmount: BigNumber;

        if (!asset || value.id !== assetId) {
          return value;
        }

        amount = new BigNumber(valueAsString);
        maximumAmount = convertToStandardUnit(asset.balance, asset.decimals);

        return {
          ...value,
          amount: amount.gt(maximumAmount) ? maximumAmount : amount,
        };
      })
    );
  };
  const handleAssetCheckChange =
    (assetId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setAssetValues(
        assetValues.map((value) =>
          value.id === assetId
            ? {
                ...value,
                isChecked: event.target.checked,
              }
            : value
        )
      );
    };
  const handleSignAtomicTransactionsClick = async () => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let asset: IAssetInformation | null;
    let assetValue: IAssetValue;
    let computedGroupId: string;
    let result: IBaseResult & ISignTxnsResult;
    let unsignedTransactions: Transaction[];

    if (!account || !network) {
      console.error('no account information found');

      return;
    }

    if (!algorand) {
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
      unsignedTransactions = [];

      for (let i: number = 0; i < assetValues.length; i++) {
        assetValue = assetValues[i];
        asset =
          account.assets.find((value) => value.id === assetValue.id) || null;

        if (!asset || !assetValue.isChecked) {
          continue;
        }

        unsignedTransactions.push(
          await createAssetTransaction({
            amount: convertToAtomicUnit(assetValue.amount, asset.decimals),
            assetId: asset.id,
            from: account.address,
            network,
            note: null,
            to: null,
          })
        );
      }

      computedGroupId = encodeBase64(computeGroupID(unsignedTransactions));
      unsignedTransactions = assignGroupID(unsignedTransactions);
      result = await algorand.signTxns({
        txns: unsignedTransactions.map((value) => ({
          txn: encodeBase64(encodeUnsignedTransaction(value)),
        })),
      });

      toast({
        description: `Successfully signed atomic transactions for wallet "${result.id}".`,
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: 'Atomic Transactions Signed!',
      });

      setGroupId(computedGroupId);
      setSignedTransactions(
        result.stxns.map((value) =>
          value ? decodeSignedTransaction(decodeBase64(value)) : null
        )
      );
    } catch (error) {
      toast({
        description: (error as BaseError).message,
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });

      setGroupId('N/A');
      setSignedTransactions([]);
    }
  };

  useEffect(() => {
    if (account) {
      setAssetValues(
        account.assets.map((value) => ({
          amount: new BigNumber('0'),
          id: value.id,
          isChecked: false,
        }))
      );
    }
  }, [account]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/* Signed transactions table */}
        <TableContainer
          borderColor="gray.200"
          borderRadius={15}
          borderStyle="solid"
          borderWidth={1}
          w="full"
        >
          <Table variant="simple">
            <TableCaption>Group ID: {groupId}</TableCaption>
            <Thead>
              <Tr>
                <Th>Txn ID</Th>
                <Th>Signature (hex)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signedTransactions.map((value) => (
                <Tr key={nanoid()}>
                  <Td>
                    <Code fontSize="sm" wordBreak="break-word">
                      {value ? value.txn.txID() : 'unsigned'}
                    </Code>
                  </Td>
                  <Td>
                    <Code fontSize="sm" wordBreak="break-word">
                      {value?.sig ? encodeHex(value.sig) : '-'}
                    </Code>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/*Assets*/}
        {account && account.assets.length > 0 ? (
          <CheckboxGroup>
            <Stack spacing={4} w="full">
              {account.assets.map((asset) => (
                <HStack key={nanoid()} spacing={2} w="full">
                  {/*Asset ID/name*/}
                  <HStack>
                    <Checkbox
                      onChange={handleAssetCheckChange(asset.id)}
                      size="lg"
                      value={asset.id}
                    />
                    <Tooltip label={asset.name || asset.id}>
                      <Text noOfLines={1} size="md" w={200}>
                        {asset.name || asset.id}
                      </Text>
                    </Tooltip>
                  </HStack>

                  {/*Balance*/}
                  <Tooltip
                    label={`${convertToStandardUnit(
                      asset.balance,
                      asset.decimals
                    ).toString()}${asset.symbol ? ` ${asset.symbol}` : ''}`}
                  >
                    <HStack flexGrow={1}>
                      <Text size="sm">
                        {formatCurrencyUnit(
                          convertToStandardUnit(asset.balance, asset.decimals)
                        )}
                      </Text>
                      {asset.symbol && <Text size="sm">{asset.symbol}</Text>}
                    </HStack>
                  </Tooltip>

                  {/*Amount*/}
                  <NumberInput
                    flexGrow={1}
                    isDisabled={
                      !assetValues.find((value) => value.id === asset.id)
                        ?.isChecked
                    }
                    min={0}
                    max={
                      asset
                        ? parseFloat(
                            convertToStandardUnit(
                              asset.balance,
                              asset.decimals
                            ).toString()
                          )
                        : 0
                    }
                    maxW={200}
                    precision={asset ? asset.decimals : 0}
                    onChange={handleAmountChange(asset.id)}
                    value={
                      assetValues
                        .find((value) => value.id === asset.id)
                        ?.amount.toString() || 0
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              ))}
            </Stack>
          </CheckboxGroup>
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

        {/*Send atomic transactions button*/}
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignAtomicTransactionsClick}
            size="lg"
          >
            Send Atomic Transactions
          </Button>
        </VStack>
      </VStack>
    </TabPanel>
  );
};

export default SignTxnsTab;
