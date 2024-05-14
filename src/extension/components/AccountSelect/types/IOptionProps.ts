import type { ReactEventHandler } from 'react';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IOptionProps {
  account: IAccountWithExtendedProps;
  isSelected: boolean;
  onClick?: ReactEventHandler<HTMLDivElement>;
}

export default IOptionProps;
