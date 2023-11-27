import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoSendOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// constants
import { ACCOUNTS_ROUTE, ASSETS_ROUTE } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// servcies
import { AccountService } from '@extension/services';

interface IProps {
  ariaLabel: string;
  toolTipLabel?: string;
  size?: string;
  publicKey: string;
}

const SendNativeTokenButton: FC<IProps> = ({
  ariaLabel,
  toolTipLabel,
  size = 'sm',
  publicKey,
}: IProps) => {
  const { t } = useTranslation();
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Tooltip
      label={toolTipLabel || t<string>('labels.sendNativeToken')}
      placement="bottom"
    >
      <IconButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        aria-label={ariaLabel}
        icon={
          <Icon as={IoSendOutline} color={defaultTextColor} />
        }
        size={size}
        variant="ghost"
        as={Link}
        to={`${ACCOUNTS_ROUTE}/${AccountService.convertPublicKeyToAlgorandAddress(
          publicKey
        )}${ASSETS_ROUTE}/${0}`}
      />
    </Tooltip>
  );
};

export default SendNativeTokenButton;
