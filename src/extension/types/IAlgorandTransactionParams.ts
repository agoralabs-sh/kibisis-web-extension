interface IAlgorandTransactionParams {
  ['consensus-version']: string;
  fee: number;
  ['genesis-hash']: string;
  ['genesis-id']: string;
  ['last-round']: number;
  ['min-fee']: number;
}

export default IAlgorandTransactionParams;
