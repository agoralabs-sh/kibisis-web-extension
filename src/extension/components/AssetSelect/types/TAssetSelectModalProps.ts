// types
import type {
  IAssetTypes,
  IModalProps,
  INativeCurrency,
  IPropsWithContext,
} from '@extension/types';

interface IAssetSelectModalProps extends IModalProps {
  assets: (IAssetTypes | INativeCurrency)[];
  isOpen: boolean;
  multiple?: boolean;
  onSelect: (assets: (IAssetTypes | INativeCurrency)[]) => void;
}

type TAssetSelectModalProps = IAssetSelectModalProps &
  IModalProps &
  IPropsWithContext;

export default TAssetSelectModalProps;
