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
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLinkOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// Components
import Button from '../../components/Button';
import SettingsHeader from '../../components/SettingsHeader';
import SettingsSessionItem from '../../components/SettingsSessionItem';

// Features
import {
  clearSessionsThunk,
  removeSessionThunk,
} from '../../features/sessions';

// Hooks
import useSubTextColor from '../../hooks/useSubTextColor';
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

// Selectors
import { useSelectFetchingSessions, useSelectSessions } from '../../selectors';

// Types
import { IAppThunkDispatch, ISession } from '../../types';

const SessionsSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const fetching: boolean = useSelectFetchingSessions();
  const sessions: ISession[] = useSelectSessions();
  const defaultSubTextColor: string = useSubTextColor();
  const defaultTextColor: string = useDefaultTextColor();
  const handleRemoveAllSessionsClick = () => dispatch(clearSessionsThunk());
  const handleRemoveSession = (id: string) => dispatch(removeSessionThunk(id));
  const renderContent = () => {
    if (fetching) {
      return (
        <VStack spacing={0} w="full">
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
            <Icon as={IoLinkOutline} h={12} w={12} />
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {t<string>('headings.noSessionsFound')}
            </Heading>
          </VStack>
          <Spacer />
        </>
      );
    }

    return (
      <VStack spacing={0} w="full">
        {sessions.map((session, index) => (
          <SettingsSessionItem
            key={nanoid()}
            onRemoveSession={handleRemoveSession}
            session={session}
          />
        ))}
      </VStack>
    );
  };

  return (
    <>
      <SettingsHeader
        title={t<string>('titles.page', { context: 'sessions' })}
      />
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
