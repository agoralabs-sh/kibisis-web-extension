import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Code,
  CreateToastFnReturn,
  Divider,
  Grid,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Table,
  TableContainer,
  TabPanel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import {
  assignGroupID,
  decodeSignedTransaction,
  encodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// theme
import { theme } from '@extension/theme';

// types
import type { IAssetInformation, IBaseTransactionProps } from '../../types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import {
  createAppCallTransaction,
  createAssetTransferTransaction,
  createPaymentTransaction,
} from '../../utils';

interface IAssetValue extends IAssetInformation {
  amount: BigNumber;
  isChecked: boolean;
}

const SignAtomicTransactionsTab: FC<IBaseTransactionProps> = ({
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
  const [assetValues, setAssetValues] = useState<IAssetValue[]>([]);
  const [includeApplicationCall, setIncludeApplicationCall] =
    useState<boolean>(false);
  const [signedTransactions, setSignedTransactions] = useState<
    (SignedTransaction | null)[]
  >([]);
  // misc
  const createUnsignedAtomicTransactions = async (
    extraTransactions?: Transaction[]
  ): Promise<Transaction[] | null> => {
    const unsignedTransactions: Transaction[] = [];
    let assetValue: IAssetValue;

    if (!account || !network) {
      toast({
        description: 'You must first enable the dApp with the wallet.',
        status: 'error',
        title: 'No Account Not Found!',
      });

      return null;
    }

    for (let i: number = 0; i < assetValues.length; i++) {
      assetValue = assetValues[i];

      if (!assetValue.isChecked) {
        continue;
      }

      // if we have algorand, use a payment transaction
      if (assetValue.id === '0') {
        unsignedTransactions.push(
          await createPaymentTransaction({
            amount: convertToAtomicUnit(assetValue.amount, assetValue.decimals),
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

    return assignGroupID([
      ...unsignedTransactions,
      // include the app call if checked
      ...(includeApplicationCall
        ? [
            await createAppCallTransaction({
              from: account.address,
              network,
              note: 'Extra application call',
              type: TransactionTypeEnum.ApplicationNoOp,
            }),
          ]
        : []),
      ...(extraTransactions ? extraTransactions : []),
    ]);
  };
  const handleSigningTransactions = async (
    unsignedTransactions: Transaction[]
  ) => {
    let result: (string | null)[] | null = null;

    try {
      result = await signTransactionsAction(
        unsignedTransactions.map((value) => ({
          txn: encodeBase64(encodeUnsignedTransaction(value)),
        }))
      );

      if (result) {
        toast({
          description: `Successfully signed atomic transactions for provider "${connectionType}".`,
          status: 'success',
          title: 'Atomic Transactions Signed!',
        });

        setSignedTransactions(
          result.map((value) =>
            value ? decodeSignedTransaction(decodeBase64(value)) : null
          )
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

      setSignedTransactions([]);
    }
  };
  // handlers
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
  const handleAssetCheckChange = (assetId: string) => () => {
    setAssetValues(
      assetValues.map((value) =>
        value.id === assetId
          ? {
              ...value,
              isChecked: !value.isChecked,
            }
          : value
      )
    );
  };
  const handleIncludeApplicationCallCheckChange = () =>
    setIncludeApplicationCall(!includeApplicationCall);
  const handleSignAGroupOfAtomicTransactionsClick = async () => {
    let unsignedTransactionsOne: Transaction[] | null;
    let unsignedTransactionsTwo: Transaction[] | null;

    if (!account || !network) {
      toast({
        description: 'You must first enable the dApp with the wallet.',
        status: 'error',
        title: 'No Account Not Found!',
      });

      return;
    }

    unsignedTransactionsOne = await createUnsignedAtomicTransactions();
    unsignedTransactionsTwo = await createUnsignedAtomicTransactions([
      // add an extra payment transaction to make this unique
      await createPaymentTransaction({
        amount: new BigNumber('0'),
        from: account.address,
        network,
        note: 'Extra single payment transaction',
        to: null,
      }),
    ]);

    if (!unsignedTransactionsOne || !unsignedTransactionsTwo) {
      return;
    }

    // add a group of atomic transactions; a group of groups
    await handleSigningTransactions([
      ...unsignedTransactionsOne,
      ...unsignedTransactionsTwo,
    ]);
  };
  const handleSignAtomicTransactionsAndASingleTransactionClick = async () => {
    let unsignedTransactions: Transaction[] | null;

    if (!account || !network) {
      toast({
        description: 'You must first enable the dApp with the wallet.',
        status: 'error',
        title: 'No Account Not Found!',
      });

      return;
    }

    unsignedTransactions = await createUnsignedAtomicTransactions();

    if (!unsignedTransactions) {
      return;
    }

    // add atomic transactions and a single (non-group) transaction
    return await handleSigningTransactions([
      ...unsignedTransactions,
      await createPaymentTransaction({
        amount: new BigNumber('0'),
        from: account.address,
        network,
        note: 'Extra single payment transaction',
        to: null,
      }),
    ]);
  };
  const handleSignAtomicTransactionsClick = async () => {
    const unsignedTransactions: Transaction[] | null =
      await createUnsignedAtomicTransactions();

    if (!unsignedTransactions) {
      return;
    }

    // add atomic transactions
    await handleSigningTransactions(unsignedTransactions);
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
          symbol: network.nativeCurrency.symbol,
        },
        ...account.assets.map((value) => ({
          ...value,
          amount: new BigNumber('0'),
          isChecked: false,
        })),
      ]);
      setIncludeApplicationCall(true);
    }
  }, [account, network]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*signed transactions table*/}
        <TableContainer
          borderColor="gray.200"
          borderRadius={15}
          borderStyle="solid"
          borderWidth={1}
          w="full"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Txn ID</Th>
                <Th>Group ID</Th>
                <Th>Signature (hex)</Th>
              </Tr>
            </Thead>

            <Tbody>
              {signedTransactions.map((value, index) => (
                <Tr key={`atomic-transaction-action-item-${index}`}>
                  {/*txn id*/}
                  <Td>
                    <Code fontSize="sm" wordBreak="break-word">
                      {value ? value.txn.txID() : 'unsigned'}
                    </Code>
                  </Td>

                  {/*group id*/}
                  <Td>
                    <Code fontSize="sm" wordBreak="break-word">
                      {value?.txn.group
                        ? value.txn.group.toString('base64')
                        : 'N/A'}
                    </Code>
                  </Td>

                  {/*signature*/}
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

        <CheckboxGroup>
          <Stack spacing={4} w="full">
            {/*assets*/}
            {assetValues.length > 0 ? (
              assetValues.map((value, index) => (
                <HStack
                  key={`atomic-transaction-action-asset-item-${index}`}
                  spacing={2}
                  w="full"
                >
                  {/*asset id/name*/}
                  <HStack>
                    <Checkbox
                      isChecked={value.isChecked}
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

                  {/*balance*/}
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

                  {/*amount*/}
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
              ))
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

            <Divider />

            {/*application calls*/}
            <HStack>
              <Checkbox
                isChecked={includeApplicationCall}
                isDisabled={!account}
                onChange={handleIncludeApplicationCallCheckChange}
                size="lg"
              />
              <Text size="md">Include application call?</Text>
            </HStack>
          </Stack>
        </CheckboxGroup>

        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          {/*send atomic transactions button*/}
          <GridItem>
            <Button
              borderRadius={theme.radii['3xl']}
              colorScheme="primaryLight"
              minW={250}
              onClick={handleSignAtomicTransactionsClick}
              size="lg"
            >
              Send Atomic Txns
            </Button>
          </GridItem>

          {/*send a group of atomic transactions button*/}
          <GridItem>
            <Button
              borderRadius={theme.radii['3xl']}
              colorScheme="primaryLight"
              minW={250}
              onClick={handleSignAGroupOfAtomicTransactionsClick}
              size="lg"
            >
              Send A Group Of Atomic Txns
            </Button>
          </GridItem>

          {/*send atomic transactions and a single payment transaction button*/}
          <GridItem>
            <Button
              borderRadius={theme.radii['3xl']}
              colorScheme="primaryLight"
              minW={250}
              onClick={handleSignAtomicTransactionsAndASingleTransactionClick}
              size="lg"
            >
              Send Atomic Txns And A Single Txn
            </Button>
          </GridItem>
        </Grid>
      </VStack>
    </TabPanel>
  );
};

export default SignAtomicTransactionsTab;
