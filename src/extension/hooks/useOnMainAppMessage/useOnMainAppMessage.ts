import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// features
import { handleNewEventByIdThunk } from '@extension/features/events';

// messages
import { InternalEventAddedMessage } from '@common/messages';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import { ILogger } from '@common/types';
import { IAppThunkDispatch } from '@extension/types';

type IMessages = InternalEventAddedMessage;

export default function useOnMainAppMessage(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const handleMessage = async (message: IMessages) => {
    logger.debug(
      `${useOnMainAppMessage.name}#${handleMessage.name}(): message "${message.reference}" received`
    );

    switch (message.reference) {
      case InternalMessageReferenceEnum.EventAdded:
        dispatch(handleNewEventByIdThunk(message.payload.eventId));

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
