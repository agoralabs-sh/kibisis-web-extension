import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import { MalformedDataError } from '@extension/errors';

// types
import type {
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  INode,
} from '@extension/types';
import type { IUpdateNodesThunkResult } from '../types';

// utils
import getRandomItem from '@common/utils/getRandomItem';
import selectCustomNodeFromSettings from '@extension/utils/selectCustomNodeFromSettings';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

const updateNodesThunk: AsyncThunk<
  IUpdateNodesThunkResult, // return
  undefined, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  IUpdateNodesThunkResult,
  undefined,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(ThunkEnum.UpdateNodesThunk, async (_, { getState, rejectWithValue }) => {
  const customNodes = getState().customNodes.items;
  const logger = getState().system.logger;
  const networks = getState().networks.items;
  const settings = getState().settings;
  const customNode = selectCustomNodeFromSettings({
    customNodes,
    settings,
  });
  const network = selectNetworkFromSettings({
    networks,
    settings,
  });
  let _error: string;
  let algod: INode | null = null;
  let indexer: INode | null = null;

  if (!network) {
    _error = 'no network selected';

    logger.error(`${ThunkEnum.UpdateNodesThunk}: ${_error}`);

    return rejectWithValue(new MalformedDataError(_error));
  }

  if (customNode) {
    logger.debug(
      `${ThunkEnum.UpdateNodesThunk}: setting custom nodes from "${customNode.name}" for "${network.genesisId}"`
    );

    algod = customNode.algod;
    indexer = customNode.indexer || null;
  }

  if (!algod) {
    logger.debug(
      `${ThunkEnum.UpdateNodesThunk}: setting default algod node for "${network.genesisId}"`
    );

    algod = getRandomItem<INode>(network.algods);
  }

  if (!indexer) {
    logger.debug(
      `${ThunkEnum.UpdateNodesThunk}: setting default indexer node for "${network.genesisId}"`
    );

    indexer = getRandomItem<INode>(network.indexers);
  }

  return {
    algod,
    indexer,
  };
});

export default updateNodesThunk;
