import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Tooltip,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAlertCircleOutline, IoLockClosedOutline } from 'react-icons/io5';

// types
import type { IProps } from './types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const ReKeyedAccountBadge: FC<IProps> = ({
  authAddress,
  isAuthAccountAvailable = false,
  size = 'sm',
  tooltipLabel,
}) => {
  const { t } = useTranslation();
  // misc
  const tag = (
    <Tag borderRadius="full" colorScheme="green" size={size} variant="solid">
      <TagLeftIcon as={IoLockClosedOutline} />

      <TagLabel>{`${t('labels.reKeyed')}: ${ellipseAddress(
        authAddress
      )}`}</TagLabel>

      {!isAuthAccountAvailable && (
        <TagRightIcon as={IoAlertCircleOutline} color="red.600" />
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
