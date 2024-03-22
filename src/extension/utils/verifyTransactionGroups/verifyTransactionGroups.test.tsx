import {
  Account,
  ALGORAND_MIN_TX_FEE,
  algosToMicroalgos,
  assignGroupID,
  generateAccount,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// utils
import verifyTransactionGroups from './verifyTransactionGroups';

function createTransactions(
  numOfTransactions: number,
  fromAddress: string,
  toAddress: string
): Transaction[] {
  const firstRound: number = Math.floor(Math.random() * 10000);
  const lastRound: number = firstRound + 1000;
  const suggestedParams: SuggestedParams = {
    fee: ALGORAND_MIN_TX_FEE,
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    genesisID: 'testnet-v1.0',
    firstRound,
    lastRound,
  };

  return Array.from({ length: numOfTransactions }, () =>
    makePaymentTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      algosToMicroalgos(1),
      undefined,
      undefined,
      suggestedParams
    )
  );
}

describe(`${__dirname}/verifyTransactionGroups()`, () => {
  const fromAccount: Account = generateAccount();
  const toAccount: Account = generateAccount();

  it('should return false if the transaction array is empty', () => {
    // arrange
    // act
    const result: boolean = verifyTransactionGroups([]);

    // assert
    expect(result).toBe(false);
  });

  describe('when using a single transaction', () => {
    it('should return true if the transaction list has one entry and no group id (a single transaction)', () => {
      // arrange
      // act
      const result: boolean = verifyTransactionGroups(
        createTransactions(1, fromAccount.addr, toAccount.addr)
      );

      // assert
      expect(result).toBe(true);
    });

    it('should return true if the transaction list has one entry and a group id (a single transaction)', () => {
      // arrange
      let transactions: Transaction[] = createTransactions(
        1,
        fromAccount.addr,
        toAccount.addr
      );

      transactions = assignGroupID(transactions);

      // act
      const result: boolean = verifyTransactionGroups([transactions[0]]);

      // assert
      expect(result).toBe(true);
    });
  });

  describe('when using atomic transactions', () => {
    it('should return true if there is a single group atomic transactions', () => {
      // arrange
      let atomicTransactionss: Transaction[] = createTransactions(
        5,
        fromAccount.addr,
        toAccount.addr
      );
      let result: boolean;

      // assign a group id
      atomicTransactionss = assignGroupID(atomicTransactionss);

      // act
      result = verifyTransactionGroups(atomicTransactionss);

      // assert
      expect(result).toBe(true);
    });

    it('should return true if there is multiple atomic transactions', () => {
      // arrange
      let atomicTransactionsOne: Transaction[] = createTransactions(
        5,
        fromAccount.addr,
        toAccount.addr
      );
      let atomicTransactionsTwo: Transaction[] = createTransactions(
        5,
        fromAccount.addr,
        toAccount.addr
      );
      let result: boolean;

      // assign group ids, but remove the last one
      atomicTransactionsOne = assignGroupID(atomicTransactionsOne);
      atomicTransactionsTwo = assignGroupID(atomicTransactionsTwo);

      // act
      result = verifyTransactionGroups([
        ...atomicTransactionsOne,
        ...atomicTransactionsTwo,
      ]);

      // assert
      expect(result).toBe(true);
    });
  });

  describe('when there is a mix of atomic transactions and single transactions', () => {
    it('should return true if the there are atomic transactions and a single transaction', () => {
      // arrange
      const transactions: Transaction[] = createTransactions(
        4,
        fromAccount.addr,
        toAccount.addr
      );
      let result: boolean;
      let singleTransaction: Transaction | null = transactions.pop() || null;
      let atomicTransactions: Transaction[] = assignGroupID(transactions);

      if (!singleTransaction) {
        throw new Error('unable to create a single transaction');
      }

      // act
      result = verifyTransactionGroups([
        // add the atomic transactions
        ...atomicTransactions,
        // add a single transaction
        singleTransaction,
      ]);

      // assert
      expect(result).toBe(true);
    });

    it('should return true if there are multiple atomic transactions and single transactions', () => {
      // arrange
      const singleTransaction: Transaction | null =
        createTransactions(1, fromAccount.addr, toAccount.addr).pop() || null;
      let atomicTransactionsOne: Transaction[] = createTransactions(
        5,
        fromAccount.addr,
        toAccount.addr
      );
      let atomicTransactionsTwo: Transaction[] = createTransactions(
        5,
        fromAccount.addr,
        toAccount.addr
      );
      let result: boolean;

      if (!singleTransaction) {
        throw new Error('unable to create a single transaction');
      }

      // assign group ids, but remove the last one
      atomicTransactionsOne = assignGroupID(atomicTransactionsOne);
      atomicTransactionsTwo = assignGroupID(atomicTransactionsTwo);

      // act
      result = verifyTransactionGroups([
        ...atomicTransactionsOne,
        singleTransaction,
        ...atomicTransactionsTwo,
      ]);

      // assert
      expect(result).toBe(true);
    });

    it('should return true if there are more than 16 groups of multiple atomic transactions and single transactions', () => {
      // arrange
      const singleTransaction: Transaction | null =
        createTransactions(1, fromAccount.addr, toAccount.addr).pop() || null;
      let atomicTransactions: Transaction[][] = Array.from({ length: 16 }, () =>
        createTransactions(16, fromAccount.addr, toAccount.addr)
      );
      let result: boolean;

      if (!singleTransaction) {
        throw new Error('unable to create a single transaction');
      }

      // assign group ids for each atomic transactions
      atomicTransactions = atomicTransactions.map((value) =>
        assignGroupID(value)
      );

      // act
      result = verifyTransactionGroups([
        ...atomicTransactions.flat(),
        singleTransaction,
      ]);

      // assert
      expect(result).toBe(true);
    });
  });
});
