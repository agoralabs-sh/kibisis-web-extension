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
import ModalTextItem from '@extension/components/ModalTextItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  onCancelClick: () => void;
  uri: string | null;
}

const ScanQRCodeModalUnknownURIContent: FC<IProps> = ({
  onCancelClick,
  uri,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // handlers
  const handleCancelClick = () => onCancelClick();

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
              label={t<string>('labels.value')}
              value={uri}
            />
          )}
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

export default ScanQRCodeModalUnknownURIContent;
