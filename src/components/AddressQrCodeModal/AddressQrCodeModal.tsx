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

// Constants
import { DEFAULT_GAP } from '../../constants';

// Theme
import { theme } from '../../theme';

// Utils
import { ellipseAddress } from '../../utils';

interface IProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddressQrCodeModal: FC<IProps> = ({
  address,
  isOpen,
  onClose,
}: IProps) => {
  const { t } = useTranslation();
  const qrCodeSize: number = 350;
  const [svgString, setSvgString] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const svg: string = await toString(`algorand://${address}`, {
          type: 'svg',
          width: qrCodeSize,
        });
        setSvgString(svg);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
    >
      <ModalContent borderTopRadius={25} borderBottomRadius={0}>
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color="gray.500" size="md" textAlign="center">
            {t<string>('headings.qrCode')}
          </Heading>
        </ModalHeader>
        <ModalBody px={DEFAULT_GAP}>
          <VStack alignItems="center" spacing={2} w="full">
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
              <HStack
                backgroundColor="gray.200"
                borderRadius={25}
                px={2}
                py={1}
                spacing={1}
              >
                <Tooltip label={address}>
                  <Text color="gray.500" fontSize="xs">
                    {ellipseAddress(address, {
                      end: 10,
                      start: 10,
                    })}
                  </Text>
                </Tooltip>
              </HStack>
              <CopyButton
                ariaLabel="Copy address"
                copiedTooltipLabel={t<string>('captions.addressCopied')}
                value={address}
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

export default AddressQrCodeModal;
