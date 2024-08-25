import {
  Button as ChakraButton,
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
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';

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
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { INetwork } from '@extension/types';
import type { INetworkSelectModalProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import { NetworkTypeEnum } from '@extension/enums';

const NetworkSelectModal: FC<INetworkSelectModalProps> = ({
  _context,
  isOpen,
  networks,
  onClose,
  onSelect,
  selectedGenesisHash,
}) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor: string = useColorModeValue(
    theme.colors.primaryLight['600'],
    theme.colors.primaryDark['600']
  );
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('md');
  // handlers
  const handleOnChange = (value: INetwork) => () => {
    onSelect(value);
    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose && onClose();
  // renders
  const renderContent = () => {
    if (networks.length <= 0) {
      return (
        <>
          <Spacer />

          {/*empty state*/}
          <EmptyState text={t<string>('headings.noNetworksFound')} />

          <Spacer />
        </>
      );
    }

    return networks.map((value, index) => {
      const isSelected = selectedGenesisHash === value.genesisHash;
      const textColor = isSelected ? primaryButtonTextColor : subTextColor;
      let node: ReactNode = null;

      switch (value.type) {
        case NetworkTypeEnum.Beta:
          node = (
            <Tag
              borderRadius="full"
              colorScheme="blue"
              size="sm"
              variant="solid"
            >
              <TagLabel>{`BetaNet`}</TagLabel>
            </Tag>
          );
          break;
        case NetworkTypeEnum.Test:
          node = (
            <Tag
              borderRadius="full"
              colorScheme="yellow"
              size="sm"
              variant="solid"
            >
              <TagLabel>{`TestNet`}</TagLabel>
            </Tag>
          );
          break;
        default:
          break;
      }

      return (
        <ChakraButton
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          alignItems="center"
          backgroundColor={
            isSelected ? buttonHoverBackgroundColor : 'transparent'
          }
          borderRadius="full"
          fontSize="md"
          h={TAB_ITEM_HEIGHT}
          justifyContent="space-between"
          key={`${_context}-network-select-modal-item-${index}`}
          onClick={handleOnChange(value)}
          p={DEFAULT_GAP / 3}
          rightIcon={
            <Icon as={IoChevronForward} boxSize={iconSize} color={textColor} />
          }
          variant="ghost"
          w="full"
        >
          <HStack
            alignItems="center"
            justifyContent="flex-start"
            m={0}
            p={DEFAULT_GAP / 2}
            spacing={DEFAULT_GAP - 2}
            w="full"
          >
            {/*icon*/}
            {createIconFromDataUri(value.nativeCurrency.iconUrl, {
              color: textColor,
              boxSize: calculateIconSize(),
            })}

            {/*name*/}
            <Text color={textColor} maxW={250} noOfLines={1}>
              {value.canonicalName}
            </Text>

            <Spacer />

            {/*type*/}
            {node}
          </HStack>
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
              {t<string>('headings.selectANetwork')}
            </Heading>
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

export default NetworkSelectModal;
