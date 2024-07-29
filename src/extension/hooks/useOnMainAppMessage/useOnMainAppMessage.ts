import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

// constants
import { CREDENTIAL_LOCK_ROUTE } from '@extension/constants';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';
import { CredentialLockActivationStateEnum } from '@extension/enums';

// features
import { setActivated as setCredentialLockActivatedAction } from '@extension/features/credential-lock';
import { handleNewEventByIdThunk } from '@extension/features/events';

// messages
import { ProviderEventAddedMessage } from '@common/messages';

// selectors
import {
  useSelectLogger,
  useSelectSettingsCredentialLockEnabled,
} from '@extension/selectors';

// types
import type { TProviderMessages } from '@common/types';
import type { IAppThunkDispatch } from '@extension/types';

export default function useOnMainAppMessage(): void {
  const _functionName = 'useOnMainAppMessage';
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  // selectors
  const credentialLockEnabled = useSelectSettingsCredentialLockEnabled();
  const logger = useSelectLogger();
  const handleMessage = async (message: TProviderMessages) => {
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
        // if the credential lock is enabled, redirect to the lock screen activate the credential lock in the store
        if (credentialLockEnabled) {
          dispatch(
            setCredentialLockActivatedAction(
              CredentialLockActivationStateEnum.Active
            )
          );

          return navigate(CREDENTIAL_LOCK_ROUTE);
        }

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
