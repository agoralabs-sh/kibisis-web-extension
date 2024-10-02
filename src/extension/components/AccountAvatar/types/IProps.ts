import type { PropsWithChildren } from 'react';

// types
import type { TAccountIcons } from '@extension/types';

interface IProps extends PropsWithChildren {
  icon: TAccountIcons | null;
}

export default IProps;
