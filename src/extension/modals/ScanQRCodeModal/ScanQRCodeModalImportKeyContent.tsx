import {
  Heading,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import { decodeURLSafe as decodeBase64URLSafe } from '@stablelib/base64';
import { decode as decodeHex } from '@stablelib/hex';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { Arc0300EncodingEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IArc0300ImportKeySchema } from '@extension/types';

// utils
import convertPrivateKeyToAddress from '@extension/utils/convertPrivateKeyToAddress';

interface IProps {
  onCancelClick: () => void;
  schema: IArc0300ImportKeySchema;
}

const ScanQRCodeModalImportKeyContent: FC<IProps> = ({
  onCancelClick,
  schema,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // states
  const [address, setAddress] = useState<string | null>(null);
  // handlers
  const handleCancelClick = () => onCancelClick();
  const handleImportClick = () => {};

  useEffect(() => {
    let privateKey: Uint8Array | null = null;

    switch (schema.encoding) {
      case Arc0300EncodingEnum.Base64URLSafe:
        privateKey = decodeBase64URLSafe(schema.encodedPrivateKey);

        break;
      case Arc0300EncodingEnum.Hexadecimal:
        privateKey = decodeHex(schema.encodedPrivateKey);

        break;
      default:
        break;
    }

    if (privateKey) {
      setAddress(convertPrivateKeyToAddress(privateKey));
    }
  }, [schema]);

  return (
    <>
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.importAccount')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.importAccount')}
          </Text>

          {/*address*/}
          {!address ? (
            <ModalSkeletonItem />
          ) : (
            <ModalTextItem
              isCode={true}
              label={t<string>('labels.address')}
              value={address}
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

          {/*import button*/}
          <Button
            onClick={handleImportClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.import')}
          </Button>
        </HStack>
      </ModalFooter>
    </>
  );
};

export default ScanQRCodeModalImportKeyContent;
