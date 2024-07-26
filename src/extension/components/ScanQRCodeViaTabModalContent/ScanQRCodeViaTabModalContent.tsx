import {
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoQrCodeOutline } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { ScanModeEnum } from '@extension/enums';

// hooks
import useCaptureQRCode from '@extension/hooks/useCaptureQRCode';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IScanQRCodeModalContentProps } from '@extension/types';
const ScanQRCodeViaTabModalContent: FC<IScanQRCodeModalContentProps> = ({
  onPreviousClick,
  onURI,
  pagination,
}) => {
  const { t } = useTranslation();
  // hooks
  const {
    resetAction: resetScanAction,
    startScanningAction,
    uri,
  } = useCaptureQRCode();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  // handlers
  const handlePreviousClick = () => {
    onPreviousClick();
    resetScanAction();
  };

  useEffect(() => {
    startScanningAction({
      mode: ScanModeEnum.Tab,
    });
  }, []);
  useEffect(() => {
    if (uri) {
      onURI(uri);
    }
  }, [uri]);

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.scanQrCode')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*progress*/}
          <CircularProgressWithIcon
            icon={IoQrCodeOutline}
            {...(pagination && {
              progress: pagination,
              progressColor: 'green.600',
            })}
          />

          {/*captions*/}
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {pagination
              ? t<string>('captions.scannedQrCodes', {
                  count: pagination[0],
                  total: pagination[1],
                })
              : t<string>('captions.scanningForQrCode')}
          </Text>
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        {/*previous button*/}
        <Button
          leftIcon={<IoArrowBackOutline />}
          onClick={handlePreviousClick}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.previous')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ScanQRCodeViaTabModalContent;
