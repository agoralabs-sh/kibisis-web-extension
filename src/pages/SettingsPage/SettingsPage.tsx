import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import MainLayout from '../../components/MainLayout';
import PageShell from '../../components/PageShell';

// Types
import { IAppThunkDispatch } from '../../types';

const SettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();

  return (
    <PageShell noPadding={true}>
      <MainLayout title={t<string>('titles.page', { context: 'settings' })}>
        <div>Hello human</div>
      </MainLayout>
    </PageShell>
  );
};

export default SettingsPage;
