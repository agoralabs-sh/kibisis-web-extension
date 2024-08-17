import { Icon, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

// types
import type { IIconWithTooltipProps } from '@extension/types';

const WarningIcon: FC<IIconWithTooltipProps> = ({
  ariaLabel,
  tooltipLabel,
}) => {
  return (
    <Tooltip label={tooltipLabel}>
      <span
        style={{
          height: '1em',
          lineHeight: '1em',
        }}
      >
        <Icon aria-label={ariaLabel} as={IoWarningOutline} color="yellow.500" />
      </span>
    </Tooltip>
  );
};

export default WarningIcon;
