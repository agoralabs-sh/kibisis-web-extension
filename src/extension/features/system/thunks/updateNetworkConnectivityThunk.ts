import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import type {
  IBaseAsyncThunkConfig,
  IMainRootState,
  INode,
} from '@extension/types';

// utils
import getRandomItem from '@common/utils/getRandomItem';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

const updateNetworkConnectivityThunk: AsyncThunk<
  boolean, // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<boolean, undefined, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.UpdateNetworkConnectivity,
  async (_, { getState }) => {
    const logger = getState().system.logger;
    const network = selectNetworkFromSettings(
      getState().networks.items,
      getState().settings
    );
    let result: Response;

    if (!network) {
      return false;
    }

    try {
      // use a random node
      result = await fetch(
        `${getRandomItem<INode>(network.algods).url}/versions`
      );

      return result.status >= 200 && result.status < 300;
    } catch (error) {
      logger.error(`${ThunkEnum.UpdateNetworkConnectivity}:`, error);

      return false;
    }
  }
);

export default updateNetworkConnectivityThunk;
