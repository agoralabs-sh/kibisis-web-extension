import { Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoStarOutline } from 'react-icons/io5';

// types
import type { IProps } from './types';

const PolisAccountBadge: FC<IProps> = ({ size = 'sm', tooltipLabel }) => {
  const { t } = useTranslation();
  // misc
  const tag = (
    <Tag borderRadius="full" colorScheme="orange" size={size} variant="solid">
      <TagLeftIcon as={IoStarOutline} />
      <TagLabel>{t('labels.primary')}</TagLabel>
    </Tag>
  );

  if (tooltipLabel) {
    return <Tooltip label={tooltipLabel}>{tag}</Tooltip>;
  }

  return tag;
};

export default PolisAccountBadge;
