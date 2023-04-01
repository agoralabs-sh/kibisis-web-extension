import { ColorMode, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import SettingsHeader from '../../components/SettingsHeader';
import SettingsSelectItem from '../../components/SettingsSelectItem';

// Features
import { setSettings } from '../../features/settings';

// Selectors
import { useSelectSettings } from '../../selectors';

// Types
import { IAppThunkDispatch, ISettings } from '../../types';

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
      <SettingsHeader
        title={t<string>('titles.page', { context: 'appearance' })}
      />
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
