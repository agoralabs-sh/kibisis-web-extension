import { Heading, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  IoEyeOutline,
  IoCogOutline,
  IoColorPaletteOutline,
  IoConstructOutline,
  IoInformationCircleOutline,
  IoLinkOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// components
import SettingsLinkItem from '@extension/components/SettingsLinkItem';

// constants
import {
  ABOUT_ROUTE,
  ADVANCED_ROUTE,
  APPEARANCE_ROUTE,
  DEFAULT_GAP,
  GENERAL_ROUTE,
  PRIVACY_ROUTE,
  SECURITY_ROUTE,
  SESSIONS_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const SettingsIndexPage: FC = () => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <VStack flexGrow={1} pt={DEFAULT_GAP - 2} spacing={0} w="full">
      <Heading
        color={defaultTextColor}
        pb={DEFAULT_GAP - 2}
        px={DEFAULT_GAP - 2}
        size="md"
        textAlign="left"
        w="full"
      >
        {t<string>('titles.page', { context: 'settings' })}
      </Heading>
      <SettingsLinkItem
        icon={IoCogOutline}
        label={t<string>('titles.page', { context: 'general' })}
        to={`${SETTINGS_ROUTE}${GENERAL_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoShieldCheckmarkOutline}
        label={t<string>('titles.page', { context: 'security' })}
        to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoColorPaletteOutline}
        label={t<string>('titles.page', { context: 'appearance' })}
        to={`${SETTINGS_ROUTE}${APPEARANCE_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoEyeOutline}
        label={t<string>('titles.page', { context: 'privacy' })}
        to={`${SETTINGS_ROUTE}${PRIVACY_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoLinkOutline}
        label={t<string>('titles.page', { context: 'sessions' })}
        to={`${SETTINGS_ROUTE}${SESSIONS_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoConstructOutline}
        label={t<string>('titles.page', { context: 'advanced' })}
        to={`${SETTINGS_ROUTE}${ADVANCED_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoInformationCircleOutline}
        label={t<string>('titles.page', { context: 'about' })}
        to={`${SETTINGS_ROUTE}${ABOUT_ROUTE}`}
      />
    </VStack>
  );
};

export default SettingsIndexPage;
