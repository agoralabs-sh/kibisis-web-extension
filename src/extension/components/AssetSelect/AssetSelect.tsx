import {
  HStack,
  Stack,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline, IoChevronDownOutline } from 'react-icons/io5';

// components
import AssetItem from '@extension/components/AssetItem';
import IconButton from '@extension/components/IconButton';
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// modals
import AssetSelectModal from './AssetSelectModal';

// types
import type { IAssetTypes, INativeCurrency } from '@extension/types';
import type { IProps } from './types';

const AssetSelect: FC<IProps> = ({
  _context,
  assets,
  disabled = false,
  label,
  network,
  onSelect,
  required = false,
  value,
}) => {
  const { t } = useTranslation();
  const {
    isOpen: isAssetSelectModalOpen,
    onClose: onAssetSelectClose,
    onOpen: onAssetSelectModalOpen,
  } = useDisclosure();
  // handlers
  const handleAssetClick = () => onAssetSelectModalOpen();
  const handleOnAssetSelect = (_value: (IAssetTypes | INativeCurrency)[]) =>
    onSelect(_value[0]);

  return (
    <>
      {/*asset select modal*/}
      <AssetSelectModal
        _context={_context}
        assets={assets}
        isOpen={isAssetSelectModalOpen}
        multiple={false}
        onClose={onAssetSelectClose}
        onSelect={handleOnAssetSelect}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        {label && <Label label={label} required={required} />}

        <HStack justifyContent="center" spacing={DEFAULT_GAP / 3} w="full">
          {/*asset view*/}
          <Stack
            borderRadius="md"
            borderWidth="1px"
            flexGrow={1}
            height={INPUT_HEIGHT}
            justifyContent="center"
            px={DEFAULT_GAP - 2}
            w="full"
          >
            <AssetItem asset={value} network={network} />
          </Stack>

          {/*open select modal button*/}
          <Tooltip label={t<string>('labels.selectAsset')}>
            <IconButton
              aria-label={t<string>('labels.selectAsset')}
              disabled={disabled}
              icon={IoChevronDownOutline}
              onClick={handleAssetClick}
              size="lg"
              variant="ghost"
            />
          </Tooltip>
        </HStack>
      </VStack>
    </>
  );
};

export default AssetSelect;
