import {
  Button as ChakraButton,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import SelectOption from './SelectOption';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { ISelectModalProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SelectModal: FC<ISelectModalProps> = ({
  _context,
  emptySpaceMessage,
  isOpen,
  onClose,
  onSelect,
  options,
  selectedIndex,
  title,
}) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const primaryHoverBackgroundColor: string = useColorModeValue(
    theme.colors.primaryDark['200'],
    theme.colors.primaryDark['200']
  );
  const primaryBackgroundColor: string = useColorModeValue(
    theme.colors.primaryDark['300'],
    theme.colors.primaryDark['300']
  );
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('md');
  // handlers
  const handleOnChange = (index: number) => () => {
    onSelect(index);
    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose && onClose();
  // renders
  const renderContent = () => {
    if (options.length <= 0) {
      return (
        <>
          <Spacer />

          {/*empty state*/}
          <EmptyState
            text={emptySpaceMessage || t<string>('headings.noItemsFound')}
          />

          <Spacer />
        </>
      );
    }

    return options.map((value, index) => {
      const isSelected = selectedIndex === index;
      const textColor = isSelected ? primaryButtonTextColor : subTextColor;

      return (
        <ChakraButton
          _hover={{
            bg: isSelected
              ? primaryHoverBackgroundColor
              : buttonHoverBackgroundColor,
          }}
          backgroundColor={isSelected ? primaryBackgroundColor : 'transparent'}
          borderRadius="md"
          fontSize="md"
          h={TAB_ITEM_HEIGHT}
          justifyContent="space-between"
          key={`${_context}-select-modal-item-${index}`}
          onClick={handleOnChange(index)}
          p={DEFAULT_GAP / 3}
          rightIcon={
            <Icon as={IoChevronForward} boxSize={iconSize} color={textColor} />
          }
          variant="ghost"
          w="full"
        >
          <SelectOption color={textColor} fontSize="md" value={value} />
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
              {t<string>(title || 'headings.selectAnOption')}
            </Heading>
          </VStack>
        </ModalHeader>

        {/*content*/}
        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <Button
            onClick={handleCancelClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectModal;
