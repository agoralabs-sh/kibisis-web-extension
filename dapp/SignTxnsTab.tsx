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
import {
  createAssetTransferTransaction,
  createPaymentTransaction,
} from './utils';

interface IAssetValue extends IAssetInformation {
  amount: BigNumber;
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
        let amount: BigNumber;
        let maximumAmount: BigNumber;

        if (value.id !== assetId) {
          return value;
        }

        amount = new BigNumber(valueAsString);
        maximumAmount = convertToStandardUnit(value.balance, value.decimals);

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
    let assetValue: IAssetValue;
    let computedGroupId: string;
    let result: IBaseResult & ISignTxnsResult;
    let unsignedTransactions: Transaction[];

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
      unsignedTransactions = [];

      for (let i: number = 0; i < assetValues.length; i++) {
        assetValue = assetValues[i];

        if (!assetValue.isChecked) {
          continue;
        }

        // if we have algorand, use a payment transaction
        if (assetValue.id === '0') {
          unsignedTransactions.push(
            await createPaymentTransaction({
              amount: convertToAtomicUnit(
                assetValue.amount,
                assetValue.decimals
              ),
              from: account.address,
              network,
              note: null,
              to: null,
            })
          );

          continue;
        }

        unsignedTransactions.push(
          await createAssetTransferTransaction({
            amount: convertToAtomicUnit(assetValue.amount, assetValue.decimals),
            assetId: assetValue.id,
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
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });

      setGroupId('N/A');
      setSignedTransactions([]);
    }
  };

  useEffect(() => {
    if (account && network) {
      setAssetValues([
        // just add algorand as an asset for simplicity
        {
          amount: new BigNumber('0'),
          balance: account.balance,
          decimals: network.nativeCurrency.decimals,
          id: '0',
          isChecked: false,
          name: network.canonicalName,
          symbol: network.nativeCurrency.code,
        },
        ...account.assets.map((value) => ({
          ...value,
          amount: new BigNumber('0'),
          isChecked: false,
        })),
      ]);
    }
  }, [account, network]);

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
        {assetValues.length > 0 ? (
          <CheckboxGroup>
            <Stack spacing={4} w="full">
              {assetValues.map((value) => (
                <HStack key={nanoid()} spacing={2} w="full">
                  {/*Asset ID/name*/}
                  <HStack>
                    <Checkbox
                      onChange={handleAssetCheckChange(value.id)}
                      size="lg"
                      value={value.id}
                    />
                    <Tooltip label={value.name || value.id}>
                      <Text noOfLines={1} size="md" w={200}>
                        {value.name || value.id}
                      </Text>
                    </Tooltip>
                  </HStack>

                  {/*Balance*/}
                  <Tooltip
                    label={`${convertToStandardUnit(
                      value.balance,
                      value.decimals
                    ).toString()}${value.symbol ? ` ${value.symbol}` : ''}`}
                  >
                    <HStack flexGrow={1}>
                      <Text size="sm">
                        {formatCurrencyUnit(
                          convertToStandardUnit(value.balance, value.decimals)
                        )}
                      </Text>
                      {value.symbol && <Text size="sm">{value.symbol}</Text>}
                    </HStack>
                  </Tooltip>

                  {/*Amount*/}
                  <NumberInput
                    flexGrow={1}
                    isDisabled={!value.isChecked}
                    min={0}
                    max={
                      value
                        ? parseFloat(
                            convertToStandardUnit(
                              value.balance,
                              value.decimals
                            ).toString()
                          )
                        : 0
                    }
                    maxW={200}
                    precision={value.decimals}
                    onChange={handleAmountChange(value.id)}
                    value={value.amount.toString()}
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
