// types
import type { IBaseOptions } from '@common/types';
import type { IPasskeyCredential } from '@extension/types';

interface IFetchPasskeyKeyMaterialOptions extends IBaseOptions {
  credential: IPasskeyCredential;
}

export default IFetchPasskeyKeyMaterialOptions;
