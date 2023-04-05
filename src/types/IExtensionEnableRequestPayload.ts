import { IBaseEnableRequestPayload } from './index';

interface IExtensionEnableRequestPayload extends IBaseEnableRequestPayload {
  appName: string;
  host: string;
  iconUrl: string | null;
}

export default IExtensionEnableRequestPayload;
