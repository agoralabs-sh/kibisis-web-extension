import {
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsUsbSymbol } from 'react-icons/bs';
import { CiUsb } from 'react-icons/ci';
import {
  IoAddOutline,
  IoArrowBackOutline,
  IoLinkOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@extension/constants';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectLogger } from '@extension/selectors';

// services
import LedgerService from '@extension/services/LedgerService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IBackgroundRootState,
  ILedgerAccount,
  IMainRootState,
} from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const AddLedgerAccountModal: FC<IProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  const {
    isOpen: isMoreInformationOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // states
  const [items, setItems] = useState<ILedgerAccount[]>([]);
  const [connecting, setConnecting] = useState<boolean>(false);
  // misc
  const reset = () => {
    setConnecting(false);
    setItems([]);
  };
  // handlers
  const handleClose = () => {
    onClose && onClose();

    reset();
  };
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  const handleOnAddClick = () => {};
  const handleOnCancelClick = () => handleClose();
  const handleOnFetchPublicKeysClick = async () => {
    const _functionName = 'handleOnFetchPublicKeysClick';
    let _items: ILedgerAccount[];

    // reset the previous values
    reset();

    setConnecting(true);

    logger.debug(
      `${AddLedgerAccountModal.name}#${_functionName}: connecting to ledger`
    );

    try {
      _items = await LedgerService.fetchPublicKeys({
        logger,
      });
    } catch (error) {
      logger?.debug(`${AddLedgerAccountModal.name}#${_functionName}:`, error);

      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            code: error.code,
            context: error.code,
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', { context: error.code }),
          type: 'error',
        })
      );

      reset();

      return;
    }

    setConnecting(false);

    logger?.debug(
      `${AddLedgerAccountModal.name}#${_functionName}: fetched ${_items.length} public keys from the ledger`
    );

    setItems(_items);
    setConnecting(false);
  };
  const handleOnPreviousClick = () => reset();
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');

    if (connecting) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          {/*progress*/}
          <CircularProgressWithIcon
            icon={BsUsbSymbol}
            iconColor={defaultTextColor}
          />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
            {t<string>('captions.connectingToLedger')}
          </Text>
        </VStack>
      );
    }

    if (items.length > 0) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="flex-start"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*icon*/}
          <Icon as={CiUsb} color="blue.600" boxSize={iconSize} />

          {/*details*/}
          <VStack flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
            {/*address*/}
            <ModalTextItem
              copyButtonLabel={t<string>('labels.copyAddress')}
              isCode={true}
              label={`${t<string>('labels.address')}:`}
              tooltipLabel={items[0].publicKey}
              value={items[0].publicKey}
            />

            <MoreInformationAccordion
              color={defaultTextColor}
              fontSize="xs"
              isOpen={isMoreInformationOpen}
              minButtonHeight={MODAL_ITEM_HEIGHT}
              onChange={handleMoreInformationToggle}
            >
              <VStack spacing={0} w="full"></VStack>
            </MoreInformationAccordion>

            {/*instructions*/}
            <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
              <Text
                color={subTextColor}
                fontSize="sm"
                textAlign="justify"
                w="full"
              >
                {t<string>('captions.encryptWithPasskeyInstruction1')}
              </Text>

              <Text
                color={subTextColor}
                fontSize="sm"
                textAlign="justify"
                w="full"
              >
                {t<string>('captions.encryptWithPasskeyInstruction2')}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      );
    }

    return (
      <VStack
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-start"
        spacing={DEFAULT_GAP}
        w="full"
      >
        {/*icon*/}
        <Icon as={CiUsb} color="blue.600" boxSize={iconSize} />

        {/*instructions*/}
        <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
          {t<string>('captions.addLedgerAccountInstruction1')}
        </Text>

        <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
          {t<string>('captions.addLedgerAccountInstruction2')}
        </Text>
      </VStack>
    );
  };
  const renderFooter = () => {
    const previousButtonNode = (
      <Button
        leftIcon={<IoArrowBackOutline />}
        onClick={handleOnPreviousClick}
        size="lg"
        variant="outline"
        w="full"
      >
        {t<string>('buttons.previous')}
      </Button>
    );

    if (connecting) {
      return previousButtonNode;
    }

    if (items.length > 0) {
      return (
        <HStack spacing={DEFAULT_GAP - 2} w="full">
          {previousButtonNode}

          <Button
            onClick={handleOnAddClick}
            rightIcon={<IoAddOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.addAccount')}
          </Button>
        </HStack>
      );
    }

    return (
      <HStack spacing={DEFAULT_GAP - 2} w="full">
        <Button
          onClick={handleOnCancelClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.cancel')}
        </Button>

        <Button
          onClick={handleOnFetchPublicKeysClick}
          rightIcon={<IoLinkOutline />}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.connect')}
        </Button>
      </HStack>
    );
  };
  const renderHeader = () => {
    let title = t<string>('headings.importAccountViaLedger');

    if (connecting) {
      title = t<string>('headings.connectingLedger');
    }

    return (
      <Heading color={defaultTextColor} fontSize="sm" textAlign="center">
        {title}
      </Heading>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          {renderHeader()}
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddLedgerAccountModal;
