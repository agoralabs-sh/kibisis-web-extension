import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoRepeatOutline } from 'react-icons/io5';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

const ReKeyedAccountBadge: FC<IProps> = ({ size = 'sm' }) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();

  return (
    <Tag
      borderRadius="full"
      colorScheme="orange"
      size={size}
      variant={colorMode === 'dark' ? 'solid' : 'outline'}
    >
      <TagLeftIcon as={IoRepeatOutline} />
      <TagLabel>{t('labels.reKeyed')}</TagLabel>
    </Tag>
  );
};

export default ReKeyedAccountBadge;
