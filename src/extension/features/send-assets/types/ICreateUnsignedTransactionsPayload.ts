interface ICreateUnsignedTransactionsPayload {
  amountInStandardUnits: string;
  note?: string;
  receiverAddress: string;
}

export default ICreateUnsignedTransactionsPayload;
