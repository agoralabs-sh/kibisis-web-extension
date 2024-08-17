import { Button, Link, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { IoOpenOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// constants
import {
  DEFAULT_GAP,
  VOIAGE_TO_MAINNET_BLOG_POST_LINK,
} from '@extension/constants';

// features
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';

// hooks
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

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
  // hooks
  const primaryColorScheme = usePrimaryColorScheme();
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
            description={
              <Trans i18nKey="captions.allowActionTracking">
                By tracking certain actions, you can earn rewards. See{' '}
                <Button
                  as={Link}
                  colorScheme={primaryColorScheme}
                  fontSize="xs"
                  href={VOIAGE_TO_MAINNET_BLOG_POST_LINK}
                  rightIcon={<IoOpenOutline />}
                  target="_blank"
                  variant="link"
                >
                  here
                </Button>
                {` `}for more information.
              </Trans>
            }
            label={t<string>('labels.allowActionTracking')}
            onChange={handleOnSwitchChange('allowActionTracking')}
          />
        </VStack>
      </VStack>
    </>
  );
};

export default PrivacySettingsPage;
