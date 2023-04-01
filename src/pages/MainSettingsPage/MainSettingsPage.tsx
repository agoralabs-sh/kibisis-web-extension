import { Heading, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoColorPaletteOutline, IoConstructOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// Components
import SettingsLinkItem from '../../components/SettingsLinkItem';

// Constants
import {
  ADVANCED_ROUTE,
  APPEARANCE_ROUTE,
  DEFAULT_GAP,
  SETTINGS_ROUTE,
} from '../../constants';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

const MainSettingsPage: FC = () => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <VStack flexGrow={1} pt={4} spacing={0} w="full">
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
        icon={IoColorPaletteOutline}
        label={t<string>('titles.page', { context: 'appearance' })}
        to={`${SETTINGS_ROUTE}${APPEARANCE_ROUTE}`}
      />
      <SettingsLinkItem
        icon={IoConstructOutline}
        label={t<string>('titles.page', { context: 'advanced' })}
        to={`${SETTINGS_ROUTE}${ADVANCED_ROUTE}`}
      />
      <Spacer />
      <Text
        color={defaultTextColor}
        fontSize="sm"
        py={4}
        textAlign="center"
        w="full"
      >
        {`v${__VERSION__}`}
      </Text>
    </VStack>
  );
};

export default MainSettingsPage;
