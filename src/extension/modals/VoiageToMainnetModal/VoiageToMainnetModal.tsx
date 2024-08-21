import {
  Heading,
  HStack,
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
import React, { createRef, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import Warning from '@extension/components/Warning';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';
import { saveToStorageThunk } from '@extension/features/news';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectNewsFetching,
  useSelectNewsItemByName,
  useSelectNewsSaving,
  useSelectSettingsSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

const VoiageToMainnetModal: FC = () => {
  const { t } = useTranslation();
  const name = 'voiage-to-mainnet';
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const initialRef = createRef<HTMLButtonElement>();
  // selectors
  const fetching = useSelectNewsFetching();
  const newsItem = useSelectNewsItemByName(name);
  const saving = useSelectNewsSaving();
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
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
            The Voiage To Mainnet
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            <Heading color={primaryColor} size="sm" textAlign="left" w="full">
              Voi mainnet is upon us!
            </Heading>

            {/*introduction*/}
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
              As you may be aware, Voi will soon be releasing mainnet and as a
              user of Kibisis you have been part of this extraordinary journey
              so far.
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Therefore, we at Kibisis would like to cordially invite you to
              undertake a few quests to earn rewards that will be redeemable
              once we enter mainnet.
            </Text>

            {/*repeatable quests*/}
            <Heading color={primaryColor} size="sm" textAlign="left" w="full">
              Repeatable quests
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Repeatable quests are simple, every day actions that have varying
              reward multipliers depending on the ease of the task. These quests
              can be repeated as many times as you like and include, but not
              limited to:
            </Text>

            <UnorderedList>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Sending some VOI to another account
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Sending some VIA (or any ARC-0200 asset) to another account
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Sending some standard assets to another account
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Acquiring an NFT
                </Text>
              </ListItem>
              <ListItem>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  ... and more!
                </Text>
              </ListItem>
            </UnorderedList>

            {/*feat of strength quests*/}
            <Heading color={primaryColor} size="sm" textAlign="left" w="full">
              "Feat Of Strength" quests
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              "Feat Of Strength" quests are hidden quests that include not very
              well known/used features. These quests have high multipliers and
              can only be performed once but may earn extra special rewards!
            </Text>

            {/*extroduction*/}
            <Heading color={primaryColor} size="sm" textAlign="left" w="full">
              The choice is yours
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {`You can opt in/out at anytime by going to Settings > Privacy and switching on/off "Allow certain actions to be tracked?"`}
            </Text>

            <Warning
              message={`Please note that we will be gathering and transmitting the quest data to a remote server. This data will only include the address and/or the asset ID used in the quest. Pressing "Cancel" or disabling the "Allow certain actions to be tracked?" switch, will stop sending this data.`}
              size="xs"
            />
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

            {/*yes i'm in*/}
            <Button
              isLoading={saving}
              onClick={handleConfirmClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.yesImIn')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VoiageToMainnetModal;
