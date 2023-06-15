import {
  Heading,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import ManageSessionModal from '@extension/components/ManageSessionModal';
import PageHeader from '@extension/components/PageHeader';
import SettingsSessionItem from '@extension/components/SettingsSessionItem';

// Features
import { setConfirm } from '@extension/features/system';
import {
  clearSessionsThunk,
  removeSessionByIdThunk,
  removeSessionByTopicThunk,
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
  // selectors
  const fetching: boolean = useSelectFetchingSessions();
  const sessions: ISession[] = useSelectSessions();
  // hooks
  const defaultSubTextColor: string = useSubTextColor();
  const defaultTextColor: string = useDefaultTextColor();
  // states
  const [managedSession, setManagedSession] = useState<ISession | null>(null);
  // handlers
  const handleManageSessionClose = () => setManagedSession(null);
  const handleManageSession = (id: string) =>
    setManagedSession(sessions.find((value) => value.id === id) || null);
  const handleRemoveAllSessionsClick = () =>
    dispatch(
      setConfirm({
        description: t<string>('captions.removeAllSessions'),
        onConfirm: () => dispatch(clearSessionsThunk()),
        title: t<string>('headings.removeAllSessions'),
      })
    );
  const handleRemoveSession = (id: string) => {
    const session: ISession | null =
      sessions.find((value) => value.id === id) || null;

    if (session) {
      // if this is a walletconnect session, remove by topic
      if (session.walletConnectMetadata) {
        dispatch(
          removeSessionByTopicThunk(session.walletConnectMetadata.topic)
        );

        return;
      }

      dispatch(removeSessionByIdThunk(id));
    }
  };
  // misc
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

    if (sessions.length > 0) {
      return (
        <VStack spacing={2} w="full">
          {sessions.map((session) => (
            <SettingsSessionItem
              key={nanoid()}
              onManageSession={handleManageSession}
              onRemoveSession={handleRemoveSession}
              session={session}
            />
          ))}
        </VStack>
      );
    }

    return (
      <>
        {/* Empty state */}
        <Spacer />
        <EmptyState
          description={t<string>('captions.noSessionsFound')}
          text={t<string>('headings.noSessionsFound')}
        />
        <Spacer />
      </>
    );
  };

  return (
    <>
      <ManageSessionModal
        onClose={handleManageSessionClose}
        session={managedSession}
      />
      <PageHeader title={t<string>('titles.page', { context: 'sessions' })} />
      <Stack alignItems="center" justifyContent="center" px={4} py={4} w="full">
        <Button
          color="white"
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
