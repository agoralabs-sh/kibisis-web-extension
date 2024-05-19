import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Tooltip,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAlertCircleOutline, IoRepeatOutline } from 'react-icons/io5';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

const ReKeyedAccountBadge: FC<IProps> = ({
  authAddress,
  isAuthAccountAvailable = false,
  size = 'sm',
  tooltipLabel,
}) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // misc
  const tag = (
    <Tag
      borderRadius="full"
      colorScheme="orange"
      size={size}
      variant={colorMode === 'dark' ? 'solid' : 'outline'}
    >
      <TagLeftIcon as={IoRepeatOutline} />

      <TagLabel>{t('labels.reKeyed')}</TagLabel>

      {!isAuthAccountAvailable && (
        <TagRightIcon as={IoAlertCircleOutline} color="red.300" />
      )}
    </Tag>
  );

  if (tooltipLabel) {
    return <Tooltip label={tooltipLabel}>{tag}</Tooltip>;
  }

  if (!isAuthAccountAvailable) {
    return (
      <Tooltip
        label={t<string>('labels.noAuthAddressAvailable', {
          address: authAddress,
        })}
      >
        {tag}
      </Tooltip>
    );
  }

  return tag;
};

export default ReKeyedAccountBadge;
