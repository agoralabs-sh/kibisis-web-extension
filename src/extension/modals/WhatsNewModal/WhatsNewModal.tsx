import {
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
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { createRef, type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import { saveWhatsNewVersionThunk } from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import { useSelectSystemInfo } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

const WhatsNewModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const initialRef = createRef<HTMLButtonElement>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // selectors
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // handlers
  const handleClose = () => {
    onClose();

    // mark as read
    dispatch(saveWhatsNewVersionThunk(__VERSION__));
  };

  // if the saved what's new version is null or less than the current version, the modal can be displayed
  useEffect(() => {
    if (
      systemInfo &&
      (!systemInfo.whatsNewVersion ||
        systemInfo.whatsNewVersion !== __VERSION__)
    ) {
      onOpen();
    }
  }, [systemInfo]);

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
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
              {`Voi's MainNet Has Launched!`}
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Hello fellow Voiagers!
            </Text>

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
              fontSize="sm"
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
          {/*ok*/}
          <Button onClick={handleClose} size="lg" variant="solid" w="full">
            {t<string>('buttons.ok')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WhatsNewModal;
