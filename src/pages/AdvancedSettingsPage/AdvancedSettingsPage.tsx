import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import SettingsHeader from '../../components/SettingsHeader';

// Types
import { IAppThunkDispatch } from '../../types';

const AdvancedSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();

  return (
    <>
      <SettingsHeader
        title={t<string>('titles.page', { context: 'advanced' })}
      />
    </>
  );
};

export default AdvancedSettingsPage;
