import { Icon, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

// theme
import { useTranslation } from 'react-i18next';

interface IProps {
  tooltipLabel: string;
}

const WarningIcon: FC<IProps> = ({ tooltipLabel }: IProps) => {
  const { t } = useTranslation();
  // misc
  const height: string = '1em';

  return (
    <Tooltip
      aria-label={`Tooltip with label "${tooltipLabel}"`}
      label={tooltipLabel}
    >
      <span
        style={{
          height,
          lineHeight: height,
        }}
      >
        <Icon as={IoWarningOutline} color="yellow.500" />
      </span>
    </Tooltip>
  );
};

export default WarningIcon;
