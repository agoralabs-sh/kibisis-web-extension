import { HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// components
import CopyIconButton from '@extension/components/CopyIconButton';
import PageHeader from '@extension/components/PageHeader';
import SettingsTextItem from '@extension/components/SettingsTextItem';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectSystemInfo } from '@extension/selectors';

const AboutSettingsPage: FC = () => {
  const { t } = useTranslation();
  // selectors
  const systemInfo = useSelectSystemInfo();
  // hooks
  const subTextColor: string = useSubTextColor();

  return (
    <>
      {/*header*/}
      <PageHeader title={t<string>('titles.page', { context: 'about' })} />

      <VStack w="full">
        {/*extension id*/}
        <SettingsTextItem fontSize="sm" label={t<string>('labels.extensionId')}>
          <HStack
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
            w="full"
          >
            <Text color={subTextColor} size="sm" textAlign="right">
              {browser.runtime.id}
            </Text>

            <CopyIconButton
              ariaLabel={t<string>('labels.copyExtensionID')}
              tooltipLabel={t<string>('labels.copyExtensionID')}
              value={browser.runtime.id}
            />
          </HStack>
        </SettingsTextItem>

        {/*device id*/}
        {systemInfo?.deviceID && (
          <SettingsTextItem fontSize="sm" label={t<string>('labels.deviceID')}>
            <HStack
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
              w="full"
            >
              <Text color={subTextColor} size="sm" textAlign="right">
                {systemInfo.deviceID}
              </Text>

              <CopyIconButton
                ariaLabel={t<string>('labels.copyDeviceID')}
                tooltipLabel={t<string>('labels.copyDeviceID')}
                value={systemInfo.deviceID}
              />
            </HStack>
          </SettingsTextItem>
        )}

        {/*version*/}
        <SettingsTextItem fontSize="sm" label={t<string>('labels.version')}>
          <Text color={subTextColor} size="sm" textAlign="right">
            {__VERSION__}
          </Text>
        </SettingsTextItem>
      </VStack>
    </>
  );
};

export default AboutSettingsPage;
