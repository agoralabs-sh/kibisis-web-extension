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
import { InfinitySpin } from 'react-loader-spinner';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Button from '../Button';
import CopyButton from '../CopyButton';
import PillSwitch from '../PillSwitch';

// Constants
import { DEFAULT_GAP } from '../../constants';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useTextBackgroundColor from '../../hooks/useTextBackgroundColor';

// Selectors
import { useSelectSettings } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { ISettings } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';

interface IProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShareAddressModal: FC<IProps> = ({
  address,
  isOpen,
  onClose,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const settings: ISettings = useSelectSettings();
  const [pillIndex, setPillIndex] = useState<number>(0);
  const [svgString, setSvgString] = useState<string | null>(null);
  const qrCodeSize: number = 350;
  const handlePillChange = (index: number) => setPillIndex(index);
  const getFormatFromIndex = (index: number, value: string): string => {
    switch (index) {
      case 1:
        return `did:algo:${value}`;
      case 0:
      default:
        return value;
    }
  };

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
        console.error(error);
      }
    })();
  }, [pillIndex]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.shareAddress')}
          </Heading>
        </ModalHeader>
        <ModalBody px={DEFAULT_GAP}>
          <VStack alignItems="center" spacing={2} w="full">
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
                <InfinitySpin color={theme.colors.primary['500']} width="200" />
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
                px={2}
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
              <CopyButton
                ariaLabel="Copy address"
                copiedTooltipLabel={t<string>('captions.addressCopied')}
                value={getFormatFromIndex(pillIndex, address)}
              />
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
          <Button
            colorScheme="primary"
            onClick={onClose}
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
