import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline } from 'react-icons/io5';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsLinkItem from '@extension/components/SettingsLinkItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// constants
import {
  CHANGE_PASSWORD_ROUTE,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

const SecuritySettingsIndexPage: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'security' })} />
      <VStack w="full">
        {/* Authentication */}
        <SettingsSubHeading text={t<string>('headings.authentication')} />
        <SettingsLinkItem
          icon={IoLockClosedOutline}
          label={t<string>('titles.page', { context: 'changePassword' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${CHANGE_PASSWORD_ROUTE}`}
        />
      </VStack>
    </>
  );
};

export default SecuritySettingsIndexPage;
