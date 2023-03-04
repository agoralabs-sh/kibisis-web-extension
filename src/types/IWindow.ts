// Entities
import { Algorand } from '../algorand-provider';

interface IWindow extends Window {
  algorand?: Algorand;
}

export default IWindow;
