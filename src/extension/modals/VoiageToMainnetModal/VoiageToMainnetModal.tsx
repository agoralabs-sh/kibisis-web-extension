import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { createRef, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import { saveSettingsToStorageThunk } from '@extension/features/settings';
import { saveToStorageThunk } from '@extension/features/news';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import {
  useSelectNewsFetching,
  useSelectNewsItemByName,
  useSelectNewsSaving,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch } from '@extension/types';

const VoiageToMainnetModal: FC = () => {
  const { t } = useTranslation();
  const name = 'voiage-to-mainnet';
  const dispatch = useDispatch<IAppThunkDispatch>();
  const initialRef = createRef<HTMLButtonElement>();
  // selectors
  const fetching = useSelectNewsFetching();
  const newsItem = useSelectNewsItemByName(name);
  const saving = useSelectNewsSaving();
  const selectedNetwork = useSelectSelectedNetwork();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // misc
  const isOpen =
    !fetching &&
    (!newsItem || !newsItem.read) &&
    !!selectedNetwork &&
    selectedNetwork.genesisHash ===
      'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=' &&
    !settings.privacy.allowActionTracking;
  // handlers
  const handleClose = () => {
    // mark the new as read
    dispatch(
      saveToStorageThunk({
        name,
        read: true,
      })
    );
  };
  const handleConfirmClick = async () => {
    // if the user opted-in, save the settings
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        privacy: {
          ...settings,
          allowActionTracking: true,
        },
      })
    );

    handleClose();
  };

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
          <Heading color={defaultTextColor} size="md" textAlign="center">
            Voiage To Mainnet
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*description*/}
            <Text color={defaultTextColor} fontSize="sm" textAlign="left">
              Yeah!!
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel*/}
            <Button
              disabled={saving}
              onClick={handleClose}
              ref={initialRef}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            {/*confirm*/}
            <Button
              isLoading={saving}
              onClick={handleConfirmClick}
              size="lg"
              variant="solid"
              w="full"
            >
              Yes, I'm in!
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VoiageToMainnetModal;
