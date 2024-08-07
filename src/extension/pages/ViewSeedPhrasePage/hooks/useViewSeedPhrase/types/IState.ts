// types
import type { IAccountAndSeedPhraseValue } from '../../../types';
import type IDecryptSeedPhraseActionOptions from './IDecryptSeedPhraseActionOptions';

interface IState {
  decrypting: boolean;
  decryptSeedPhraseAction: (
    options: IDecryptSeedPhraseActionOptions
  ) => Promise<IAccountAndSeedPhraseValue>;
}

export default IState;
