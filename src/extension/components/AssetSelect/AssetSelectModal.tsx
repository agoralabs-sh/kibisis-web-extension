import {
  Button as ChakraButton,
  Checkbox,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoCheckmarkDoneCircleOutline,
  IoChevronForward,
} from 'react-icons/io5';

// components
import AssetItem from '@extension/components/AssetItem';
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// selectors
import { useSelectSettingsSelectedNetwork } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAssetTypes, INativeCurrency } from '@extension/types';
import type { TAssetSelectModalProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const AssetSelectModal: FC<TAssetSelectModalProps> = ({
  _context,
  assets,
  isOpen,
  multiple,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation();
  // selectors
  const network = useSelectSettingsSelectedNetwork();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // states
  const [selectedAssets, setSelectedAssets] = useState<
    (IAssetTypes | INativeCurrency)[]
  >([]);
  // misc
  const iconSize = calculateIconSize('md');
  const reset = () => {
    setSelectedAssets([]);
  };
  // handlers
  const handleOnChange = (asset: IAssetTypes | INativeCurrency) => () => {
    // for a single selection, just return the asset
    if (!multiple) {
      return handleConfirm([asset]);
    }

    if (asset.type === AssetTypeEnum.Native) {
      // if the native asset exists, remove it
      if (selectedAssets.find((value) => value.type === AssetTypeEnum.Native)) {
        return setSelectedAssets(
          selectedAssets.filter((value) => value.type !== AssetTypeEnum.Native)
        );
      }

      return setSelectedAssets([asset, ...selectedAssets]);
    }

    // if the asset exists in the selected assets, remove it
    if (
      selectedAssets.find(
        (value) => value.type !== AssetTypeEnum.Native && value.id === asset.id
      )
    ) {
      return setSelectedAssets(
        selectedAssets.filter(
          (value) =>
            value.type !== AssetTypeEnum.Native && value.id !== asset.id
        )
      );
    }

    setSelectedAssets([asset, ...selectedAssets]);
  };
  const handleCancelClick = () => handleClose();
  const handleConfirm = (_assets: (IAssetTypes | INativeCurrency)[]) => {
    onSelect(_assets);
    handleClose();
  };
  const handleConfirmClick = () => handleConfirm(selectedAssets);
  const handleClose = () => {
    onClose && onClose();

    reset(); // clean up
  };
  const handleOnSelectAllCheckChange = () => {
    if (selectedAssets.length <= 0) {
      return setSelectedAssets(assets);
    }

    setSelectedAssets([]);
  };
  // renders
  const renderContent = () => {
    if (assets.length <= 0 || !network) {
      return (
        <>
          <Spacer />

          {/*empty state*/}
          <EmptyState text={t<string>('headings.noAccountsFound')} />

          <Spacer />
        </>
      );
    }

    return assets.map((asset, index) => {
      return (
        <ChakraButton
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          borderRadius="full"
          fontSize="md"
          h={TAB_ITEM_HEIGHT}
          justifyContent="start"
          key={`${_context}-asset-select-modal-item-${index}`}
          onClick={handleOnChange(asset)}
          px={DEFAULT_GAP / 2}
          py={0}
          rightIcon={
            multiple ? (
              <Checkbox
                colorScheme={primaryColorScheme}
                isChecked={
                  !!selectedAssets.find((value) => {
                    if (
                      value.type === AssetTypeEnum.Native &&
                      asset.type === AssetTypeEnum.Native
                    ) {
                      return true;
                    }

                    if (
                      value.type !== AssetTypeEnum.Native &&
                      asset.type !== AssetTypeEnum.Native
                    ) {
                      return value.id === asset.id;
                    }

                    return false;
                  })
                }
                pointerEvents="none"
              />
            ) : (
              <Icon
                as={IoChevronForward}
                color={defaultTextColor}
                h={iconSize}
                w={iconSize}
              />
            )
          }
          variant="ghost"
          w="full"
        >
          <AssetItem asset={asset} network={network} />
        </ChakraButton>
      );
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        maxH="75%"
        minH={0}
      >
        {/*heading*/}
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*heading*/}
            <Heading
              color={defaultTextColor}
              size="md"
              textAlign="center"
              w="full"
            >
              {t<string>(
                multiple ? 'headings.selectAssets' : 'headings.selectAsset'
              )}
            </Heading>

            {/*select all assets*/}
            {multiple && (
              <Stack
                alignItems="flex-end"
                justifyContent="center"
                px={DEFAULT_GAP / 2}
                w="full"
              >
                <Tooltip
                  aria-label={t<string>('labels.selectAllAssets')}
                  label={t<string>('labels.selectAllAssets')}
                >
                  <Checkbox
                    colorScheme={primaryColorScheme}
                    isChecked={selectedAssets.length === assets.length}
                    isIndeterminate={
                      selectedAssets.length > 0 &&
                      selectedAssets.length < assets.length
                    }
                    onChange={handleOnSelectAllCheckChange}
                  />
                </Tooltip>
              </Stack>
            )}
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody px={DEFAULT_GAP}>
          <VStack spacing={1} w="full">
            {renderContent()}
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            {multiple && (
              <Button
                onClick={handleConfirmClick}
                rightIcon={<IoCheckmarkDoneCircleOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.confirm')}
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssetSelectModal;
