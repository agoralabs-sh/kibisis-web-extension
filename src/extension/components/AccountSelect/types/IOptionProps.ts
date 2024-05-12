import type { ReactEventHandler } from 'react';

// types
import type { IAccount } from '@extension/types';

interface IOptionProps {
  account: IAccount;
  isSelected: boolean;
  onClick?: ReactEventHandler<HTMLDivElement>;
}

export default IOptionProps;
