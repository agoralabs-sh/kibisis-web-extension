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
import type { IRemoveAssetsConfirmingModalContentProps } from './types';

const RemoveAssetsConfirmingModalContent: FC<
  IRemoveAssetsConfirmingModalContentProps
> = ({ asset }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  // misc
  let message: string | null = null;

  switch (asset.type) {
    case AssetTypeEnum.ARC0200:
      message = t<string>('captions.removeAssetConfirming', {
        context: asset.type,
        symbol: asset.symbol,
      });
      break;
    case AssetTypeEnum.Standard:
      message = t<string>('captions.removeAssetConfirming', {
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

      {message && (
        <Text
          color={defaultTextColor}
          fontSize="md"
          textAlign="center"
          w="full"
        >
          {message}
        </Text>
      )}
    </VStack>
  );
};

export default RemoveAssetsConfirmingModalContent;
