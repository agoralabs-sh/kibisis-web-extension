import { ColorMode, Tag, TagLabel } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

const COSEAlgorithmBadge: FC<IProps> = ({ algorithm, size = 'sm' }: IProps) => {
  const { t } = useTranslation();
  // hooks
  const colorMode: ColorMode = useSelectSettingsColorMode();
  // misc
  let colorScheme = 'orange';
  let label = t<string>('labels.unknown');

  switch (algorithm) {
    case -7:
      colorScheme = 'blue';
      label = 'ES256';
      break;
    case -8:
      colorScheme = 'blue';
      label = 'Ed25519';
      break;
    case -257:
      colorScheme = 'blue';
      label = 'RS256';
      break;
    default:
      break;
  }

  return (
    <Tag
      colorScheme={colorScheme}
      size={size}
      variant={colorMode === 'dark' ? 'solid' : 'subtle'}
    >
      <TagLabel>{label}</TagLabel>
    </Tag>
  );
};

export default COSEAlgorithmBadge;
