import { ColorMode, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsSelectItem, {
  IOption,
} from '@extension/components/SettingsSelectItem';

// features
import { saveSettingsToStorage } from '@extension/features/settings';

// selectors
import { useSelectSettings } from '@extension/selectors';

// types
import { IAppThunkDispatch, ISettings } from '@extension/types';

const AppearanceSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const settings: ISettings = useSelectSettings();
  // misc
  const themeOptions: IOption<ColorMode>[] = [
    {
      icon: IoMoonOutline,
      label: t<string>('labels.dark'),
      value: 'dark',
    },
    {
      icon: IoSunnyOutline,
      label: t<string>('labels.light'),
      value: 'light',
    },
  ];
  // handlers
  const handleThemeChange = (option: IOption<ColorMode>) => {
    dispatch(
      saveSettingsToStorage({
        ...settings,
        appearance: {
          ...settings.appearance,
          theme: option.value,
        },
      })
    );
  };

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'appearance' })} />

      <VStack spacing={4} w="full">
        <SettingsSelectItem
          description={t<string>('captions.changeTheme')}
          label={t<string>('labels.theme')}
          onChange={handleThemeChange}
          options={themeOptions}
          value={
            themeOptions.find(
              (value) => value.value === settings.appearance.theme
            ) || themeOptions[0]
          }
        />
      </VStack>
    </>
  );
};

export default AppearanceSettingsPage;
