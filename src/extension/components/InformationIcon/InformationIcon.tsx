import { Icon, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IIconWithTooltipProps } from '@extension/types';

const InformationIcon: FC<IIconWithTooltipProps> = ({
  ariaLabel,
  tooltipLabel,
}) => {
  // hooks
  const subTextColor = useSubTextColor();

  return (
    <Tooltip label={tooltipLabel}>
      <span
        style={{
          height: '1em',
          lineHeight: '1em',
        }}
      >
        <Icon
          aria-label={ariaLabel}
          as={IoInformationCircleOutline}
          color={subTextColor}
        />
      </span>
    </Tooltip>
  );
};

export default InformationIcon;
