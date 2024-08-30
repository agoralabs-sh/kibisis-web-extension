import { HStack, Spacer, VStack } from '@chakra-ui/react';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoUnlinkOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import PageHeader from '@extension/components/PageHeader';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import SettingsSessionItem, {
  SettingsSessionItemSkeleton,
} from '@extension/components/SettingsSessionItem';

// components
import { DEFAULT_GAP } from '@extension/constants';

// features
import { setConfirmModal } from '@extension/features/layout';
import {
  clearSessionsThunk,
  removeSessionByIdThunk,
} from '@extension/features/sessions';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';

// modals
import ManageSessionModal from '@extension/modals/ManageSessionModal';

// selectors
import {
  useSelectNetworks,
  useSelectSessionsFetching,
  useSelectSessions,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  ISession,
} from '@extension/types';

const SessionsSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const fetching = useSelectSessionsFetching();
  const networks = useSelectNetworks();
  const sessions = useSelectSessions();
  // hooks
  const borderColor = useBorderColor();
  // states
  const [session, setSession] = useState<ISession | null>(null);
  // misc
  const _context = 'sessions-settings-page';
  // handlers
  const handleManageSessionModalClose = () => setSession(null);
  const handleOnSelectSession = (id: string) =>
    setSession(sessions.find((value) => value.id === id) || null);
  const handleDisconnectAllSessionsClick = () =>
    dispatch(
      setConfirmModal({
        description: t<string>('captions.disconnectAllSessions'),
        onConfirm: () => dispatch(clearSessionsThunk()),
        title: t<string>('headings.disconnectAllSessions'),
      })
    );
  const handleOnDisconnectSession = (id: string) => {
    if (sessions.find((value) => value.id === id)) {
      dispatch(removeSessionByIdThunk(id));
    }
  };
  // misc
  const renderContent = () => {
    if (fetching) {
      return (
        <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
          {Array.from({ length: 3 }, (_, index) => (
            <SettingsSessionItemSkeleton
              key={`${_context}-sessions-item-skeleton-${index}`}
            />
          ))}
        </VStack>
      );
    }

    return sessions.length > 0 ? (
      <ScrollableContainer
        direction="column"
        flexGrow={1}
        m={0}
        p={0}
        spacing={0}
        w="full"
      >
        {sessions.reduce((acc, currentValue, index) => {
          const network =
            networks.find(
              (value) => value.genesisHash === currentValue.genesisHash
            ) || null;

          return network
            ? [
                ...acc,
                <SettingsSessionItem
                  item={currentValue}
                  key={`${_context}-sessions-item-${index}`}
                  network={network}
                  onDisconnect={handleOnDisconnectSession}
                  onSelect={handleOnSelectSession}
                />,
              ]
            : acc;
        }, [])}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          description={t<string>('captions.noSessionsFound')}
          text={t<string>('headings.noSessionsFound')}
        />

        <Spacer />
      </VStack>
    );
  };

  return (
    <>
      <ManageSessionModal
        onClose={handleManageSessionModalClose}
        session={session}
      />

      <PageHeader title={t<string>('titles.page', { context: 'sessions' })} />

      <VStack
        borderBottomColor={borderColor}
        borderBottomStyle="solid"
        borderBottomWidth="1px"
        pb={DEFAULT_GAP / 3}
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          px={DEFAULT_GAP / 2}
          py={DEFAULT_GAP / 3}
          spacing={1}
          w="full"
        >
          {/*disconnect all button*/}
          <Button
            aria-label={t<string>('buttons.disconnectAllSessions')}
            isDisabled={sessions.length <= 0}
            onClick={handleDisconnectAllSessionsClick}
            rightIcon={<IoUnlinkOutline />}
            size="sm"
            variant="solid"
          >
            {t<string>('buttons.disconnectAllSessions')}
          </Button>
        </HStack>
      </VStack>

      {/*sessions list*/}
      {renderContent()}
    </>
  );
};

export default SessionsSettingsPage;
