import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// features
import { handleNewEventByIdThunk } from '@extension/features/events';
import { setPassword } from '@extension/features/password-lock';

// messages
import {
  InternalEventAddedMessage,
  InternalPasswordLockTimeoutMessage,
} from '@common/messages';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type { IAppThunkDispatch } from '@extension/types';

type IMessages = InternalEventAddedMessage | InternalPasswordLockTimeoutMessage;

export default function useOnMainAppMessage(): void {
  const _functionName: string = 'useOnMainAppMessage';
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger: ILogger = useSelectLogger();
  const handleMessage = async (message: IMessages) => {
    logger.debug(`${_functionName}(): message "${message.reference}" received`);

    switch (message.reference) {
      case InternalMessageReferenceEnum.EventAdded:
        dispatch(
          handleNewEventByIdThunk(
            (message as InternalEventAddedMessage).payload.eventId
          )
        );

        break;
      case InternalMessageReferenceEnum.PasswordLockTimeout:
        // remove the password
        dispatch(setPassword(null));

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
