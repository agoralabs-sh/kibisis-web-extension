import {
  Alert,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Skeleton,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { createRef, FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

// Components
import Button from '@extension/components/Button';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useDocument from './useDocument';

// Theme
import { theme } from '@extension/theme';

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
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const { document, fetching } = useDocument(documentName, i18n.language);
  // misc
  const initialRef: RefObject<HTMLButtonElement> | undefined = createRef();
  // handlers
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
                children={document}
                components={{
                  blockquote: ({ children }) => (
                    <Alert status="info" variant="left-accent">
                      {children}
                    </Alert>
                  ),
                  h1: ({ children }) => (
                    <Heading
                      color={defaultTextColor}
                      size="lg"
                      textAlign="left"
                    >
                      {String(children)}
                    </Heading>
                  ),
                  h2: ({ children }) => (
                    <Heading
                      color={defaultTextColor}
                      size="md"
                      textAlign="left"
                    >
                      {String(children)}
                    </Heading>
                  ),
                  h3: ({ children }) => (
                    <Heading
                      color={defaultTextColor}
                      size="sm"
                      textAlign="left"
                    >
                      {String(children)}
                    </Heading>
                  ),
                  li: ({ children, index, ordered }) => (
                    <ListItem>
                      <Text
                        color={defaultTextColor}
                        fontSize="sm"
                        textAlign="left"
                      >
                        {String(children)}
                      </Text>
                    </ListItem>
                  ),
                  ol: ({ children }) => <OrderedList>{children}</OrderedList>,
                  p: ({ children }) => (
                    <Text
                      color={defaultTextColor}
                      fontSize="sm"
                      textAlign="left"
                    >
                      {String(children)}
                    </Text>
                  ),
                  strong: ({ children }) => <strong>{String(children)}</strong>,
                  ul: ({ children }) => (
                    <UnorderedList>{children}</UnorderedList>
                  ),
                }}
              />
            )}
          </VStack>
        </ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
          <Button
            onClick={handleDismissClick}
            ref={initialRef}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.dismiss')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DocumentModal;
