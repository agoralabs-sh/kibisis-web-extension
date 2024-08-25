import {
  Box,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkDoneCircleOutline, IoQrCodeOutline } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import PillSwitch from '@extension/components/PillSwitch';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// selectors
import { useSelectLogger, useSelectSettings } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ISettings } from '@extension/types';
import type { IProps } from './types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const ShareAddressModal: FC<IProps> = ({ address, isOpen, onClose }) => {
  const { t } = useTranslation();
  // selectors
  const logger = useSelectLogger();
  const settings: ISettings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // states
  const [pillIndex, setPillIndex] = useState<number>(0);
  const [svgString, setSvgString] = useState<string | null>(null);
  // misc
  const getFormatFromIndex = (index: number, value: string): string => {
    switch (index) {
      case 1:
        return `did:algo:${value}`;
      case 0:
      default:
        return value;
    }
  };
  const qrCodeSize = 350;
  // handlers
  const handleClose = () => onClose && onClose();
  const handlePillChange = (index: number) => setPillIndex(index);

  useEffect(() => {
    (async () => {
      try {
        const svg: string = await toString(
          getFormatFromIndex(pillIndex, address),
          {
            type: 'svg',
            width: qrCodeSize,
          }
        );
        setSvgString(svg);
      } catch (error) {
        logger.error(`${ShareAddressModal.name}#useEffect:`, error);
      }
    })();
  }, [pillIndex]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        {/*header*/}
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.shareAddress')}
          </Heading>
        </ModalHeader>

        {/*body*/}
        <ModalBody px={DEFAULT_GAP}>
          <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
            {settings.advanced.allowDidTokenFormat && (
              <PillSwitch
                index={pillIndex}
                labels={[t<string>('labels.default'), t<string>('labels.did')]}
                onChange={handlePillChange}
              />
            )}
            {svgString ? (
              <Box
                dangerouslySetInnerHTML={{
                  __html: sanitize(svgString, {
                    USE_PROFILES: { svg: true, svgFilters: true },
                  }),
                }}
              />
            ) : (
              <Flex
                alignItems="center"
                h={qrCodeSize}
                justifyContent="center"
                w={qrCodeSize}
              >
                <CircularProgressWithIcon icon={IoQrCodeOutline} />
              </Flex>
            )}
            <HStack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              w="full"
            >
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={DEFAULT_GAP / 3}
                py={1}
              >
                <Tooltip label={getFormatFromIndex(pillIndex, address)}>
                  <Text color={defaultTextColor} fontSize="xs">
                    {getFormatFromIndex(
                      pillIndex,
                      ellipseAddress(address, {
                        end: 10,
                        start: 10,
                      })
                    )}
                  </Text>
                </Tooltip>
              </Box>

              <CopyIconButton
                ariaLabel={t<string>('labels.copyAddress')}
                tooltipLabel={t<string>('labels.copyAddress')}
                value={getFormatFromIndex(pillIndex, address)}
              />
            </HStack>
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <Button
            onClick={handleClose}
            rightIcon={<IoCheckmarkDoneCircleOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.ok')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareAddressModal;
