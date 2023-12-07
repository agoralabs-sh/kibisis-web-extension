import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// enums
import { MessageTypeEnum } from '@common/enums';

// features
import { handleNewEventByIdThunk } from '@extension/features/events';

// messages
import { EventAddedMessage } from '@common/messages';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import { ILogger } from '@common/types';
import { IAppThunkDispatch } from '@extension/types';

type IMessages = EventAddedMessage;

export default function useOnMainAppMessage(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const handleMessage = async (message: IMessages) => {
    logger.debug(
      `${useOnMainAppMessage.name}#${handleMessage.name}(): message "${message.type}" received`
    );

    switch (message.type) {
      case MessageTypeEnum.EventAdded:
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
