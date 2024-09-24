import type { Store } from '@reduxjs/toolkit';
import type { i18n } from 'i18next';

// types
import type { IMainRootState } from '@extension/types';

interface IOptions {
  i18n: i18n;
  store: Store<IMainRootState>;
}

export default IOptions;
