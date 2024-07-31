import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// features
import { setActive as setCredentialLockActive } from '@extension/features/credential-lock';
import { handleNewEventByIdThunk } from '@extension/features/events';

// messages
import { ProviderEventAddedMessage } from '@common/messages';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { TProviderMessages } from '@common/types';
import type { IAppThunkDispatch } from '@extension/types';

export default function useOnMainAppMessage(): void {
  const _functionName = 'useOnMainAppMessage';
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
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
        dispatch(setCredentialLockActive(true));

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
