// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IAccountAndSeedPhraseValue {
  account: IAccountWithExtendedProps;
  masked: boolean;
  seedPhrase: string;
}

export default IAccountAndSeedPhraseValue;
