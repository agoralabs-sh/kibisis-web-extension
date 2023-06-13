interface IUseTransactionPageOptions {
  address: string | null;
  onError: () => void;
  transactionId: string | null;
}

export default IUseTransactionPageOptions;
