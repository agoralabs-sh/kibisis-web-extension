import {
  Center,
  Flex,
  Heading,
  Icon,
  Link,
  Modal,
  ModalContent,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { IoWarning } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';

// constants
import { SUPPORT_MAIL_TO_LINK } from '@extension/constants';

// errors
import { BaseExtensionError } from '@extension/errors';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectError } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

interface IProps {
  onClose: () => void;
}

const ErrorModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const error: BaseExtensionError | null = useSelectError();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const requiresRefresh: () => boolean = (): boolean => {
    switch (error?.code) {
      default:
        return true;
    }
  };
  const handleTryAgainClick = () => {
    if (!requiresRefresh()) {
      return onClose();
    }

    window.location.reload();
  };

  return (
    <Modal
      isOpen={!!error}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <Center flex={1}>
          <Flex
            alignItems="center"
            direction="column"
            justifyContent="center"
            maxW={500}
            minH="100vh"
            pt={8}
            px={8}
            w="full"
          >
            <VStack flexGrow={1} justifyContent="center" spacing={5}>
              <Icon as={IoWarning} color="red.500" h={16} w={16} />
              <Heading color={defaultTextColor} textAlign="center">
                {t<string>('errors.titles.code', { context: error?.code })}
              </Heading>
              <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                {t<string>('errors.descriptions.code')}
              </Text>
              <Text color={subTextColor} fontSize="sm" textAlign="center">
                <Trans i18nKey="captions.support">
                  Please{' '}
                  <Link
                    color="red.500"
                    href={SUPPORT_MAIL_TO_LINK}
                    isExternal={true}
                  >
                    contact us
                  </Link>{' '}
                  for further assistance so we can resolve this issue for you.
                </Trans>
              </Text>
            </VStack>
            <Button
              color="white"
              colorScheme="red"
              mb={8}
              onClick={handleTryAgainClick}
              size="lg"
              w="full"
            >
              {t<string>('buttons.ok')}
            </Button>
          </Flex>
        </Center>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
