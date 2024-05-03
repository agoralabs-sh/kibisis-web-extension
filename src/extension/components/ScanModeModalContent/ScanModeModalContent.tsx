import {
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoBrowsersOutline, IoVideocamOutline } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

// utils
import isCameraAvailable from '@extension/utils/isCameraAvailable';
import isScreenCaptureAvailable from '@extension/utils/isScreenCaptureAvailable';

const ScanModeModalContent: FC<IProps> = ({
  onCancelClick,
  onScanViaCameraClick,
  onScanViaScreenCaptureClick,
  onScanViaTabClick,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // handlers
  const handleCancelClick = () => onCancelClick();
  const handleScanViaCameraClick = () => onScanViaCameraClick();
  const handleScanViaScreenCaptureClick = () => onScanViaScreenCaptureClick();
  const handleScanViaTabClick = () => onScanViaTabClick();

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
        <VStack alignItems="center" flexGrow={1} w="full">
          {/*caption*/}
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.selectScanLocation')}
          </Text>

          <VStack
            alignItems="center"
            flexGrow={1}
            justifyContent="center"
            spacing={DEFAULT_GAP}
            w="full"
          >
            {/*scan via a window button*/}
            {isScreenCaptureAvailable() && (
              <Button
                onClick={handleScanViaScreenCaptureClick}
                rightIcon={<IoBrowsersOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.scanAWindow')}
              </Button>
            )}

            {/*scan via current tab button*/}
            <Button
              onClick={handleScanViaTabClick}
              rightIcon={<IoBrowsersOutline />}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.scanCurrentTab')}
            </Button>

            {/*scan via camera button*/}
            {isCameraAvailable() && (
              <Button
                onClick={handleScanViaCameraClick}
                rightIcon={<IoVideocamOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.scanUsingCamera')}
              </Button>
            )}
          </VStack>
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        {/*cancel button*/}
        <Button
          onClick={handleCancelClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.cancel')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ScanModeModalContent;
