import {
  Account,
  ALGORAND_MIN_TX_FEE,
  algosToMicroalgos,
  assignGroupID,
  decodeUnsignedTransaction,
  encodeUnsignedTransaction,
  generateAccount,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// Utils
import verifyTransactionGroupId from './verifyTransactionGroupId';

describe(`${verifyTransactionGroupId.name}()`, () => {
  const fromAccount: Account = generateAccount();
  const suggestedParams: SuggestedParams = {
    fee: ALGORAND_MIN_TX_FEE,
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    genesisID: 'testnet-v1.0',
    firstRound: 10,
    lastRound: 10,
  };
  const toAccount: Account = generateAccount();

  it('should return false if the transaction array is empty', () => {
    // Arrange
    // Act
    const result: boolean = verifyTransactionGroupId([]);

    // Assert
    expect(result).toBe(false);
  });

  it('should return true if the transaction has one entry and no group id', () => {
    // Arrange
    // Act
    const result: boolean = verifyTransactionGroupId([
      makePaymentTxnWithSuggestedParams(
        fromAccount.addr,
        toAccount.addr,
        algosToMicroalgos(1),
        undefined,
        undefined,
        suggestedParams
      ),
    ]);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false if the first transaction group ID is not defined', () => {
    // Arrange
    let transactions: Transaction[] = Array.from({ length: 3 }, () =>
      makePaymentTxnWithSuggestedParams(
        fromAccount.addr,
        toAccount.addr,
        algosToMicroalgos(1),
        undefined,
        undefined,
        suggestedParams
      )
    );
    let result: boolean;

    transactions = assignGroupID(transactions);
    transactions[0].group = undefined;

    // Act
    result = verifyTransactionGroupId(transactions);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if the any of the transactions has an empty group ID', () => {
    // Arrange
    let transactions: Transaction[] = Array.from({ length: 5 }, () =>
      makePaymentTxnWithSuggestedParams(
        fromAccount.addr,
        toAccount.addr,
        algosToMicroalgos(1),
        undefined,
        undefined,
        suggestedParams
      )
    );
    let result: boolean;

    // assign group ids, but remove the last one
    transactions = assignGroupID(transactions);
    transactions[transactions.length - 1].group = undefined;

    // Act
    result = verifyTransactionGroupId(transactions);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if the transactions have different group IDs', () => {
    // Arrange
    const secondToAccount: Account = generateAccount();
    const firstGroupOfTransactions: Transaction[] = assignGroupID(
      Array.from({ length: 3 }, () =>
        makePaymentTxnWithSuggestedParams(
          fromAccount.addr,
          toAccount.addr,
          algosToMicroalgos(1),
          undefined,
          undefined,
          suggestedParams
        )
      )
    );
    const secondGroupOfTransactions: Transaction[] = assignGroupID(
      Array.from({ length: 3 }, () =>
        makePaymentTxnWithSuggestedParams(
          fromAccount.addr,
          secondToAccount.addr,
          algosToMicroalgos(1),
          undefined,
          undefined,
          suggestedParams
        )
      )
    );
    let result: boolean;

    // Act
    result = verifyTransactionGroupId([
      ...firstGroupOfTransactions,
      ...secondGroupOfTransactions,
    ]);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if the transactions have different assign group IDs from the computed one', () => {
    // Arrange
    const secondToAccount: Account = generateAccount();
    const numOfTransactions: number = 3;
    const firstGroupOfTransactions: Transaction[] = assignGroupID(
      Array.from({ length: numOfTransactions }, () =>
        makePaymentTxnWithSuggestedParams(
          fromAccount.addr,
          toAccount.addr,
          algosToMicroalgos(1),
          undefined,
          undefined,
          suggestedParams
        )
      )
    );
    const secondGroupOfTransactions: Transaction[] = assignGroupID(
      Array.from({ length: numOfTransactions }, () =>
        makePaymentTxnWithSuggestedParams(
          fromAccount.addr,
          secondToAccount.addr,
          algosToMicroalgos(1),
          undefined,
          undefined,
          suggestedParams
        )
      )
    );
    let result: boolean;

    // Act
    result = verifyTransactionGroupId(
      firstGroupOfTransactions.map((value, index) => {
        const updatedTransaction: Transaction = decodeUnsignedTransaction(
          encodeUnsignedTransaction(value)
        );

        updatedTransaction.group = secondGroupOfTransactions[index].group; // replace the first transaction group ID with a different one

        return updatedTransaction;
      })
    );

    // Assert
    expect(result).toBe(false);
  });

  it('should verify the group ID', () => {
    // Arrange
    let transactions: Transaction[] = Array.from({ length: 5 }, () =>
      makePaymentTxnWithSuggestedParams(
        fromAccount.addr,
        toAccount.addr,
        algosToMicroalgos(1),
        undefined,
        undefined,
        suggestedParams
      )
    );
    let result: boolean;

    // assign group ids, but remove the last one
    transactions = assignGroupID(transactions);

    // Act
    result = verifyTransactionGroupId(transactions);

    // Assert
    expect(result).toBe(true);
  });
});
