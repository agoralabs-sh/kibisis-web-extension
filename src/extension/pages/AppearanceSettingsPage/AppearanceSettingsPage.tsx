import { type ColorMode, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsSelectItem from '@extension/components/SettingsSelectItem';

// contants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';

// selectors
import { useSelectSettings } from '@extension/selectors';

// types
import type { IOption } from '@extension/components/Select';
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

const AppearanceSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const settings = useSelectSettings();
  // misc
  const _context = 'appearance-settings-page';
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
      saveSettingsToStorageThunk({
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

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        <SettingsSelectItem
          _context={_context}
          description={t<string>('captions.changeTheme')}
          emptyOptionLabel={t<string>('captions.noThemesAvailable')}
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
