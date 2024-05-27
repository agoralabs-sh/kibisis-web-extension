interface IAlgorandPaymentTransaction {
  amount: bigint;
  ['close-amount']?: bigint;
  ['close-remainder-to']?: string;
  receiver: string;
}

export default IAlgorandPaymentTransaction;
