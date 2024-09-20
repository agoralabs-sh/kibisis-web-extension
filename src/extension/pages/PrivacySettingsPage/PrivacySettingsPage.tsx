import { VStack } from '@chakra-ui/react';
import React, { type ChangeEvent, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';

// selectors
import { useSelectSettings } from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  IPrivacySettings,
} from '@extension/types';

const PrivacySettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const settings = useSelectSettings();
  // handlers
  const handleOnSwitchChange =
    (key: keyof IPrivacySettings) => (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          privacy: {
            ...settings.privacy,
            [key]: event.target.checked,
          },
        })
      );
    };

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'privacy' })} />

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*analytics & tracking*/}
        <VStack w="full">
          <SettingsSubHeading
            text={t<string>('headings.analyticsAndTracking')}
          />

          <SettingsSwitchItem
            checked={settings.privacy.allowActionTracking}
            description={t<string>('captions.allowActionTracking')}
            label={t<string>('labels.allowActionTracking')}
            onChange={handleOnSwitchChange('allowActionTracking')}
          />
        </VStack>
      </VStack>
    </>
  );
};

export default PrivacySettingsPage;
