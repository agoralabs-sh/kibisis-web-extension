import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import { IAddNotificationPayload, INotificationsState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Notifications,
  reducers: {
    closeById: (
      state: Draft<INotificationsState>,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.map((value) =>
        value.id === action.payload
          ? { ...value, showing: false, shown: true }
          : value
      );
    },
    create: (
      state: Draft<INotificationsState>,
      action: PayloadAction<IAddNotificationPayload>
    ) => {
      state.items = [
        ...state.items,
        {
          description: action.payload.description || null,
          ephemeral: action.payload.ephemeral || false,
          id: uuid(),
          title: action.payload.title,
          read: false,
          showing: false,
          shown: false,
          type: action.payload.type,
        },
      ];
    },
    removeAll: (state: Draft<INotificationsState>) => {
      state.items = [];
    },
    removeById: (
      state: Draft<INotificationsState>,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter((value) => value.id !== action.payload);
    },
    setShowingById: (
      state: Draft<INotificationsState>,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.map((value) =>
        value.id === action.payload ? { ...value, showing: true } : value
      );
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { closeById, create, removeAll, removeById, setShowingById } =
  slice.actions;
