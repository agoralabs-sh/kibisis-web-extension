import BigNumber from 'bignumber.js';

interface IState {
  accountBalanceInAtomicUnits: BigNumber;
  minimumBalanceRequirementInAtomicUnits: BigNumber;
  minimumTransactionFeesInAtomicUnits: BigNumber;
}

export default IState;
