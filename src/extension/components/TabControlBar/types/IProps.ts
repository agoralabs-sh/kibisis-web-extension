// types
import type { IPropsWithContext } from '@extension/types';
import type ITabControlBarButtonProps from './ITabControlBarButtonProps';

interface IProps extends IPropsWithContext {
  buttons: ITabControlBarButtonProps[];
  isLoading?: boolean;
  loadingTooltipLabel?: string;
}

export default IProps;
