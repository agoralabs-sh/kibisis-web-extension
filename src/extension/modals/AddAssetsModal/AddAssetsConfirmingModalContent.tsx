import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCubeOutline } from 'react-icons/io5';

// components
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IAddAssetsConfirmingModalContentProps } from './types';

const AddAssetsConfirmingModalContent: FC<
  IAddAssetsConfirmingModalContentProps
> = ({ asset }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // misc
  let message: string | null = null;

  switch (asset.type) {
    case AssetTypeEnum.ARC0200:
      message = t<string>('captions.addAssetConfirming', {
        context: asset.type,
        symbol: asset.symbol,
      });
      break;
    case AssetTypeEnum.Standard:
      message = t<string>('captions.addAssetConfirming', {
        context: asset.type,
        symbol: asset.unitName || asset.name || asset.id,
      });
      break;
    default:
      break;
  }

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP / 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgressWithIcon icon={IoCubeOutline} />

      {/*message*/}
      {message && (
        <Text
          color={defaultTextColor}
          fontSize="sm"
          textAlign="center"
          w="full"
        >
          {message}
        </Text>
      )}
    </VStack>
  );
};

export default AddAssetsConfirmingModalContent;
