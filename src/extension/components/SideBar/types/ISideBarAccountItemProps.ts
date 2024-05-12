// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface ISideBarAccountItemProps {
  account: IAccountWithExtendedProps;
  active: boolean;
  onClick: (id: string) => void;
}

export default ISideBarAccountItemProps;
