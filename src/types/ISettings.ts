// Types
import INetwork from './INetwork';

/**
 * @property {INetwork | null} network - the current selected network.
 */
interface ISettings {
  network: INetwork | null;
}

export default ISettings;
