import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoOpenOutline } from 'react-icons/io5';
import browser from 'webextension-polyfill';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  size?: string;
  tooltipLabel: string;
  url: string;
}

const OpenTabIconButton: FC<IProps> = ({
  size = 'sm',
  tooltipLabel,
  url,
}: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const handleOpenClick = () =>
    browser.tabs.create({
      url,
    });

  return (
    <Tooltip
      arrowSize={15}
      hasArrow={true}
      label={tooltipLabel}
      placement="bottom"
    >
      <IconButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        aria-label="Open url in a new tab"
        icon={<Icon as={IoOpenOutline} color={defaultTextColor} />}
        onClick={handleOpenClick}
        size={size}
        variant="ghost"
      />
    </Tooltip>
  );
};

export default OpenTabIconButton;
