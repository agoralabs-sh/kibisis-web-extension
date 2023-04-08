import {
  Heading,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLinkOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// Components
import Button from '@extension/components/Button';
import ConfirmModal from '@extension/components/ConfirmModal';
import ManageSessionModal from '@extension/components/ManageSessionModal';
import PageHeader from '@extension/components/PageHeader';
import SettingsSessionItem from '@extension/components/SettingsSessionItem';

// Features
import {
  clearSessionsThunk,
  removeSessionThunk,
} from '@extension/features/sessions';

// Hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// Selectors
import {
  useSelectFetchingSessions,
  useSelectSessions,
} from '@extension/selectors';

// Types
import { IAppThunkDispatch, ISession } from '@extension/types';

const SessionsSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const fetching: boolean = useSelectFetchingSessions();
  const sessions: ISession[] = useSelectSessions();
  const defaultSubTextColor: string = useSubTextColor();
  const defaultTextColor: string = useDefaultTextColor();
  const [managedSession, setManagedSession] = useState<ISession | null>(null);
  const handleConfirmRemoveAllSessions = () => {
    dispatch(clearSessionsThunk());
    onClose();
  };
  const handleManageSessionClose = () => setManagedSession(null);
  const handleManageSession = (id: string) =>
    setManagedSession(sessions.find((value) => value.id === id) || null);
  const handleRemoveAllSessionsClick = () => onOpen();
  const handleRemoveSession = (id: string) => dispatch(removeSessionThunk(id));
  const renderContent = () => {
    if (fetching) {
      return (
        <VStack spacing={2} w="full">
          {Array.from({ length: 3 }, () => (
            <HStack key={nanoid()} m={0} pt={2} px={4} spacing={2} w="full">
              <SkeletonCircle size="10" />
              <VStack
                alignItems="flex-start"
                flexGrow={1}
                justifyContent="space-evenly"
                spacing={0}
              >
                <Skeleton flexGrow={1}>
                  <Text color={defaultTextColor} fontSize="sm" textAlign="left">
                    {faker.random.alpha({ count: 32 })}
                  </Text>
                </Skeleton>
                <Skeleton flexGrow={1}>
                  <Text
                    color={defaultSubTextColor}
                    fontSize="xs"
                    textAlign="left"
                  >
                    {faker.date.future().toLocaleString()}
                  </Text>
                </Skeleton>
              </VStack>
            </HStack>
          ))}
        </VStack>
      );
    }

    if (sessions.length <= 0) {
      return (
        <>
          <Spacer />
          <VStack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            w="full"
          >
            <Icon as={IoLinkOutline} color={defaultTextColor} h={12} w={12} />
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {t<string>('headings.noSessionsFound')}
            </Heading>
          </VStack>
          <Spacer />
        </>
      );
    }

    return (
      <VStack spacing={2} w="full">
        {sessions.map((session, index) => (
          <SettingsSessionItem
            key={nanoid()}
            onManageSession={handleManageSession}
            onRemoveSession={handleRemoveSession}
            session={session}
          />
        ))}
      </VStack>
    );
  };

  return (
    <>
      <ManageSessionModal
        onClose={handleManageSessionClose}
        session={managedSession}
      />
      <ConfirmModal
        description={t<string>('captions.removeAllSessions')}
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={handleConfirmRemoveAllSessions}
        title={t<string>('headings.removeAllSessions')}
      />
      <PageHeader title={t<string>('titles.page', { context: 'sessions' })} />
      <Stack alignItems="center" justifyContent="center" px={4} py={4} w="full">
        <Button
          colorScheme="red"
          isDisabled={sessions.length <= 0}
          maxW={400}
          onClick={handleRemoveAllSessionsClick}
        >
          {t<string>('buttons.removeAllSessions')}
        </Button>
      </Stack>
      {renderContent()}
    </>
  );
};

export default SessionsSettingsPage;
