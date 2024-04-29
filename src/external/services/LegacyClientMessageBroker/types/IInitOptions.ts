// types
import type { IBaseOptions } from '@common/types';

interface IInitOptions extends IBaseOptions {
  channel: BroadcastChannel;
}

export default IInitOptions;
