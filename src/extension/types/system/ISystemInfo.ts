// types
import type IWhatsNewInfo from './IWhatsNewInfo';

interface ISystemInfo {
  deviceID: string | null;
  polisAccountID: string | null;
  whatsNewInfo: IWhatsNewInfo;
}

export default ISystemInfo;
