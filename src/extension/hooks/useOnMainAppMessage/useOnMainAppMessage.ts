import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// features
import { setActive as setCredentialLockActive } from '@extension/features/credential-lock';
import { handleNewEventByIdThunk } from '@extension/features/events';
import { create as createNotification } from '@extension/features/notifications';
import { fetchSessionsThunk } from '@extension/features/sessions';

// messages
import {
  ProviderEventAddedMessage,
  ProviderSessionsUpdatedMessage,
} from '@common/messages';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { TProviderMessages } from '@common/types';
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

export default function useOnMainAppMessage(): void {
  const _functionName = 'useOnMainAppMessage';
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const logger = useSelectLogger();
  const handleMessage = async (message: TProviderMessages) => {
    message.reference &&
      logger.debug(`${_functionName}: message "${message.reference}" received`);

    switch (message.reference) {
      case ProviderMessageReferenceEnum.EventAdded:
        dispatch(
          handleNewEventByIdThunk(
            (message as ProviderEventAddedMessage).payload.eventId
          )
        );
        break;
      case ProviderMessageReferenceEnum.CredentialLockActivated:
        dispatch(setCredentialLockActive(true));
        break;
      case ProviderMessageReferenceEnum.SessionsUpdated:
        dispatch(fetchSessionsThunk());
        dispatch(
          createNotification({
            ephemeral: true,
            type: 'info',
            ...((message as ProviderSessionsUpdatedMessage).payload.sessions
              .length > 1
              ? {
                  title: t<string>('headings.sessionsDisconnected', {
                    amount: (message as ProviderSessionsUpdatedMessage).payload
                      .sessions.length,
                  }),
                }
              : {
                  description: t<string>('captions.sessionDisconnected', {
                    name: (message as ProviderSessionsUpdatedMessage).payload
                      .sessions[0].appName,
                  }),
                  title: t<string>('headings.sessionDisconnected'),
                }),
          })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // handle messages
    browser.runtime.onMessage.addListener(handleMessage);

    return function cleanup() {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);
}
