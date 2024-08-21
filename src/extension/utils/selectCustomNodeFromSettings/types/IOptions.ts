// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { ISettings } from '@extension/types';

interface IOptions {
  customNodes: ICustomNodeItem[];
  settings: ISettings;
}

export default IOptions;
