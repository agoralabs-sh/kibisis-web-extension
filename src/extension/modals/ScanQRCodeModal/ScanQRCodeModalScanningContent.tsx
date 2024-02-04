import {
  Heading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import Button from '@extension/components/Button';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';

// theme
import { theme } from '@extension/theme';

interface IProps {
  onCancelClick: () => void;
}

const ScanQRCodeModalScanningContent: FC<IProps> = ({
  onCancelClick,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  // handlers
  const handleCancelClick = () => onCancelClick();

  return (
    <>
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.scanningForQRCode')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={4}
          w="full"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={defaultTextColor}
            color={primaryColor}
            size="xl"
          />

          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.scanningForQrCode')}
          </Text>
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <Button onClick={handleCancelClick} size="lg" variant="solid" w="full">
          {t<string>('buttons.cancel')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default ScanQRCodeModalScanningContent;
