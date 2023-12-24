import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { createRef, FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import browser from 'webextension-polyfill';

// components
import Button from '@extension/components/Button';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useDocument from './hooks/useDocument';

// theme
import { theme } from '@extension/theme';

// utils
import { createComponents } from './utils';

interface IProps {
  documentName: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const DocumentModal: FC<IProps> = ({
  documentName,
  isOpen,
  onClose,
  title,
}: IProps) => {
  const { t, i18n } = useTranslation();
  const documentUrl: string = `documents/${documentName}/${i18n.language}.md`;
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const { document, fetching } = useDocument(documentUrl);
  // misc
  const initialRef: RefObject<HTMLButtonElement> | undefined = createRef();
  // handlers
  const handleDownloadClick = async () => {
    if (document) {
      await browser.downloads.download({
        filename: `${__APP_TITLE__.toLowerCase()}-${documentName}.md`,
        url: URL.createObjectURL(document.blob),
      });
    }
  };
  const handleDismissClick = () => onClose();

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        alignSelf="flex-end"
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH="0dvh"
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <VStack
            alignItems="flex-start"
            justifyContent="flex-start"
            spacing={4}
            w="full"
          >
            {fetching && (
              <>
                <Skeleton>
                  <Heading size="md" textAlign="left">
                    {faker.random.alpha({ count: 8 })}
                  </Heading>
                </Skeleton>
                <Skeleton w="full">
                  <Text fontSize="sm" textAlign="left">
                    {faker.random.alpha({ count: 8 })}
                  </Text>
                </Skeleton>
                <Skeleton w="full">
                  <Text fontSize="sm" textAlign="left">
                    {faker.random.alpha({ count: 8 })}
                  </Text>
                </Skeleton>
              </>
            )}
            {document && (
              <ReactMarkdown
                children={document.text}
                components={createComponents(defaultTextColor)}
              />
            )}
          </VStack>
        </ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={4} w="full">
            <Button
              onClick={handleDismissClick}
              ref={initialRef}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.dismiss')}
            </Button>
            <Button
              isLoading={fetching}
              onClick={handleDownloadClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.download')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DocumentModal;
