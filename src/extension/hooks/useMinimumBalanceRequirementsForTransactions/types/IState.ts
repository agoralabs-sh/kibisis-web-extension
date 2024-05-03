import BigNumber from 'bignumber.js';

interface IState {
  accountBalanceInAtomicUnits: BigNumber;
  minimumBalanceRequirementInAtomicUnits: BigNumber;
  totalCostInAtomicUnits: BigNumber;
}

export default IState;
