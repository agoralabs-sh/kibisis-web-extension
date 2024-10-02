import type { PropsWithChildren } from 'react';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps extends PropsWithChildren {
  account: IAccountWithExtendedProps;
}

export default IProps;
