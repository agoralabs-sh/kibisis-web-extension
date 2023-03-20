import { AlgorandProvider } from '@agoralabs-sh/algorand-provider';

interface IWindow extends Window {
  algorand?: AlgorandProvider;
}

export default IWindow;
