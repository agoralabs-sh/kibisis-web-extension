import {
  Heading,
  HStack,
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
import ModalTextItem from '@extension/components/ModalTextItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  onCancelClick: () => void;
  onTryAgainClick: () => void;
  uri: string | null;
}

const ScanQRCodeModalUnknownURIContent: FC<IProps> = ({
  onCancelClick,
  onTryAgainClick,
  uri,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // handlers
  const handleCancelClick = () => onCancelClick();
  const handleTryAgainClick = () => onTryAgainClick();

  return (
    <>
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.unknownQRCode')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.unknownQRCode')}
          </Text>

          {uri && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.value')}:`}
              value={uri}
            />
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <HStack spacing={4} w="full">
          {/*cancel button*/}
          <Button
            onClick={handleCancelClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.cancel')}
          </Button>

          {/*try again button*/}
          <Button
            onClick={handleTryAgainClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.tryAgain')}
          </Button>
        </HStack>
      </ModalFooter>
    </>
  );
};

export default ScanQRCodeModalUnknownURIContent;
