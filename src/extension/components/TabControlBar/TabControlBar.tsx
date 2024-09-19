import { HStack, Spacer, Spinner, Tooltip } from '@chakra-ui/react';
import React, { type FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IoReloadOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useItemBorderColor from '@extension/hooks/useItemBorderColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IProps } from './types';

const TabControlBar: FC<IProps> = ({
  _context,
  buttons,
  isLoading = false,
  loadingTooltipLabel,
  onRefresh,
}) => {
  const { t } = useTranslation();
  // hooks
  const itemBorderColor = useItemBorderColor();
  const primaryColor = usePrimaryColor();
  // renders
  const renderLoader = () => {
    let node: ReactElement;

    if (isLoading) {
      node = (
        <Spinner thickness="1px" speed="0.65s" color={primaryColor} size="sm" />
      );

      if (!loadingTooltipLabel) {
        return node;
      }

      return <Tooltip label={loadingTooltipLabel}>{node}</Tooltip>;
    }

    if (onRefresh) {
      return (
        <Tooltip label={t<string>('buttons.refresh')}>
          <IconButton
            aria-label={t<string>('buttons.refresh')}
            icon={IoReloadOutline}
            onClick={onRefresh}
            size="sm"
            variant="ghost"
          />
        </Tooltip>
      );
    }

    return null;
  };

  return (
    <HStack
      alignItems="center"
      borderBottomColor={itemBorderColor}
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      justifyContent="flex-start"
      px={DEFAULT_GAP / 2}
      py={DEFAULT_GAP / 3}
      spacing={1}
      w="full"
    >
      {/*refresh button*/}
      {renderLoader()}

      <Spacer minH={DEFAULT_GAP + 2} />

      {/*buttons*/}
      {buttons.map((value, index) => {
        const button = (
          <IconButton
            {...value.button}
            key={`${_context}-tab-control-bar-button-${index}`}
          />
        );

        return !value.tooltipLabel ? (
          button
        ) : (
          <Tooltip
            key={`${_context}-tab-control-bar-button-${index}`}
            label={value.tooltipLabel}
          >
            {button}
          </Tooltip>
        );
      })}
    </HStack>
  );
};

export default TabControlBar;
