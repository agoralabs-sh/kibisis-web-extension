import type { ChangeEvent, ReactElement } from 'react';

interface IProps {
  checked: boolean;
  description?: string | ReactElement;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default IProps;
