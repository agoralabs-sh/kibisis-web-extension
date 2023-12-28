import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsTextItem from '@extension/components/SettingsTextItem';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

const AboutSettingsPage: FC = () => {
  const { t } = useTranslation();
  // hooks
  const subTextColor: string = useSubTextColor();

  return (
    <>
      {/*header*/}
      <PageHeader title={t<string>('titles.page', { context: 'about' })} />

      <VStack w="full">
        {/*extension id*/}
        <SettingsTextItem fontSize="sm" label={t<string>('labels.extensionId')}>
          <Text color={subTextColor} size="sm" textAlign="right">
            {browser.runtime.id}
          </Text>
        </SettingsTextItem>

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
