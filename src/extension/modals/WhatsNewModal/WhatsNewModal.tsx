import {
  Checkbox,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import React, { type ChangeEvent, createRef, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';
import { saveWhatsNewVersionThunk } from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectSettings,
  useSelectWhatsNewModal,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  IModalProps,
} from '@extension/types';

const WhatsNewModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const initialRef = createRef<HTMLButtonElement>();
  // selectors
  const settings = useSelectSettings();
  const whatsNewModalOpen = useSelectWhatsNewModal();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // handlers
  const handleClose = () => {
    // mark as read
    dispatch(saveWhatsNewVersionThunk(__VERSION__));

    onClose && onClose();
  };
  const handleOnDisableOnUpdateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) =>
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        general: {
          ...settings.general,
          disableWhatsNewModalOnUpdate: event.target.checked,
        },
      })
    );

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={whatsNewModalOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} fontSize="lg" textAlign="center">
            {`What's New In Kibisis v2.0.0`}
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*introduction*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Introduction
            </Heading>

            <Heading
              color={primaryColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {`Voi's MainNet Has Launched!`}
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Voi's Genesis Day took place on 2024-09-12 which means Voi has
              officially launched on mainnet!
            </Text>

            {/*features*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Features
            </Heading>

            <UnorderedList>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  🌐 Voi mainnet has been added to the list of networks.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  🌐 MainNet is set as the default network type.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  ⚙️ TestNet can be switched on from the settings.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  💅 New font applied: Nunito.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  ⚙️ Font selection can be changed in the settings (if you
                  prefer the old font).
                </Text>
              </ListItem>
            </UnorderedList>

            {/*fixes*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Fixes
            </Heading>

            <UnorderedList>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Voi Phase 2 quest tracking has been disabled.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Previous account name value no longer appears when changing
                  multiple account names.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Disconnected sessions are updated in the extension when on the
                  settings' sessions page.
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Only responds to Kibisis-specific message requests from AVM
                  Web Provider/UseWallet requests.
                </Text>
              </ListItem>
            </UnorderedList>

            {/*extroduction*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Closing Words
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {`Thank you for your continued interest in Kibisis! We hope you are enjoying using it.`}
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {`It has been an epic ride so far, and we could not have got this far without you and your continued support.`}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            <Checkbox
              colorScheme={primaryColorScheme}
              isChecked={settings.general.disableWhatsNewModalOnUpdate}
              onChange={handleOnDisableOnUpdateChange}
            >
              <Text
                color={subTextColor}
                fontSize="xs"
                textAlign="left"
                w="full"
              >
                {t<string>('captions.disableWhatsNewMessageOnUpdate')}
              </Text>
            </Checkbox>

            {/*ok*/}
            <Button
              onClick={handleClose}
              ref={initialRef}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.ok')}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WhatsNewModal;
