import { ColorMode, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import PageHeader from '@extension/components/PageHeader';
import SettingsSelectItem from '@extension/components/SettingsSelectItem';

// Features
import { setSettings } from '@extension/features/settings';

// Selectors
import { useSelectSettings } from '@extension/selectors';

// Types
import { IAppThunkDispatch, ISettings } from '@extension/types';

const AppearanceSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const settings: ISettings = useSelectSettings();
  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setSettings({
        ...settings,
        appearance: {
          ...settings.appearance,
          theme: event.target.value as ColorMode,
        },
      })
    );
  };

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'appearance' })} />
      <VStack w="full">
        <SettingsSelectItem
          description={t<string>('captions.changeTheme')}
          label={t<string>('labels.theme')}
          onChange={handleThemeChange}
          options={[
            {
              label: t<string>('labels.dark'),
              value: 'dark',
            },
            {
              label: t<string>('labels.light'),
              value: 'light',
            },
          ]}
          value={settings.appearance.theme}
        />
      </VStack>
    </>
  );
};

export default AppearanceSettingsPage;
