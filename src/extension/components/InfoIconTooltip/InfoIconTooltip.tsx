import { Icon, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  color?: string;
  label: string;
}

const InfoIconTooltip: FC<IProps> = ({ color, label }: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Tooltip aria-label={label} label={label}>
      <span
        style={{
          height: '1em',
          lineHeight: '1em',
        }}
      >
        <Icon
          as={IoInformationCircleOutline}
          color={color || defaultTextColor}
        />
      </span>
    </Tooltip>
  );
};

export default InfoIconTooltip;
