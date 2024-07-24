// types
import type {
  IAssetTypes,
  IModalProps,
  INativeCurrency,
} from '@extension/types';

interface IProps extends IModalProps {
  assets: (IAssetTypes | INativeCurrency)[];
  isOpen: boolean;
  multiple?: boolean;
  onSelect: (assets: (IAssetTypes | INativeCurrency)[]) => void;
}

export default IProps;
