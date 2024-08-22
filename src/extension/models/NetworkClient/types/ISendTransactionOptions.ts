interface ISendTransactionOptions {
  nodeID: string | null;
  signedTransactions: Uint8Array[];
}

export default ISendTransactionOptions;
