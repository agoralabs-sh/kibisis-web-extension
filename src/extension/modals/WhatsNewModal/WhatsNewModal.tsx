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
import Link from '@extension/components/Link';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import {
  saveDisableWhatsNewOnUpdateThunk,
  saveWhatsNewVersionThunk,
} from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectWhatsNewModal,
  useSelectSystemWhatsNewInfo,
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
  const whatsNewModalOpen = useSelectWhatsNewModal();
  const whatsNewInfo = useSelectSystemWhatsNewInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // misc
  const features = [
    '🔃 Add button to force a refresh of account transactions.',
  ];
  const fixes = [
    'Account information and transactions should update in a timely manner.',
    'Switching network correctly updates block explorers.',
    'Watch accounts no longer intermittently lose their badge.',
  ];
  // handlers
  const handleClose = () => {
    // mark as read
    dispatch(saveWhatsNewVersionThunk(__VERSION__));

    onClose && onClose();
  };
  const handleOnDisableOnUpdateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!whatsNewInfo) {
      return;
    }

    dispatch(saveDisableWhatsNewOnUpdateThunk(!whatsNewInfo.disableOnUpdate));
  };

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
            {`What's New In Kibisis v${__VERSION__}`}
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*community highlights*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Community Highlights
            </Heading>

            <Heading
              color={primaryColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Voi Launches MainNet!
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Voi's Genesis Day took place on{' '}
              <Link
                fontSize="sm"
                href="https://explorer.voi.network/explorer/block/1/transactions"
                isExternal={true}
              >
                12th September 2024
              </Link>{' '}
              which means Voi has officially launched its MainNet!
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              This truly has been a community effort; from the builders, the
              node runners to the questers. Voi's TestNet has been a monumental
              success and Voi has a solid foundation that makes it an ecosystem
              that is run by you: the Voiagers.
            </Text>

            <Heading
              color={primaryColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Voi MainNet Rollout: Staking Program
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              With Voi's MainNet rollout, there is a new incentive for early
              participation: the <strong>Staking Program</strong>.
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              The Staking Program is designed to incentivize long-term
              commitment by offering two ways to earn rewards:{' '}
              <strong>token lock-up</strong> and{' '}
              <strong>staking those locked up tokens</strong>.
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              See{' '}
              <Link
                fontSize="sm"
                href="https://medium.com/@voifoundation/vois-staking-program-140mm-voi-4cbfd3a27f63"
                isExternal={true}
              >
                here
              </Link>{' '}
              for more details.
            </Text>

            {/*new release*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              {`Version ${__VERSION__} Release`}
            </Heading>

            {/*features*/}
            {features.length > 0 && (
              <>
                <Heading
                  color={primaryColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Features
                </Heading>

                <UnorderedList>
                  {features.map((value, index) => (
                    <ListItem
                      key={`${WhatsNewModal.name}-features-list-${index}`}
                    >
                      <Text
                        color={defaultTextColor}
                        fontSize="sm"
                        textAlign="left"
                        w="full"
                      >
                        {value}
                      </Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}

            {/*fixes*/}
            {fixes.length > 0 && (
              <>
                <Heading
                  color={primaryColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Fixes
                </Heading>

                <UnorderedList>
                  {fixes.map((value, index) => (
                    <ListItem key={`${WhatsNewModal.name}-fixes-list-${index}`}>
                      <Text
                        color={defaultTextColor}
                        fontSize="sm"
                        textAlign="left"
                        w="full"
                      >
                        {value}
                      </Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}

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
            {whatsNewInfo && (
              <Checkbox
                colorScheme={primaryColorScheme}
                isChecked={whatsNewInfo.disableOnUpdate}
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
            )}

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
