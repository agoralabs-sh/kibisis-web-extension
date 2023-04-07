import { IBaseEnableRequestPayload } from './index';

interface IExtensionEnableRequestPayload extends IBaseEnableRequestPayload {
  appName: string;
  description: string | null;
  host: string;
  iconUrl: string | null;
}

export default IExtensionEnableRequestPayload;
