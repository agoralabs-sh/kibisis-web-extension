// types
import IBaseApplicationOptions from './IBaseApplicationOptions';

interface IDetermineBoxReferencesOptions extends IBaseApplicationOptions {
  authAddress?: string;
  fromAddress: string;
}

export default IDetermineBoxReferencesOptions;
