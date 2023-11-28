import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';
import { getSdkError } from '@walletconnect/utils';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// services
import { SessionService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IMainRootState, ISession } from '@extension/types';

const removeSessionByTopicThunk: AsyncThunk<
  string | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string | null, string, { state: IMainRootState }>(
  SessionsThunkEnum.RemoveSessionByTopic,
  async (topic, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const web3Wallet: IWeb3Wallet | null = getState().sessions.web3Wallet;
    const sessionService: SessionService = new SessionService({
      logger,
    });
    const session: ISession | null = await sessionService.getByTopic(topic);

    if (!session) {
      return null;
    }

    logger.debug(
      `${removeSessionByTopicThunk.name}: removing session "${session.id}" from storage`
    );

    await sessionService.removeById(session.id);

    // disconnect the session with walletconnect
    if (web3Wallet) {
      logger.debug(
        `${removeSessionByTopicThunk.name}: disconnecting walletconnect session for topic "${topic}"`
      );

      await web3Wallet.disconnectSession({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    }

    return session.id;
  }
);

export default removeSessionByTopicThunk;
