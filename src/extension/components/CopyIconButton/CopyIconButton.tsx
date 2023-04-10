import { Icon, IconButton, Tooltip, useClipboard } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  ariaLabel: string;
  copiedTooltipLabel?: string;
  value: string;
}

const CopyButton: FC<IProps> = ({
  ariaLabel,
  copiedTooltipLabel,
  value,
}: IProps) => {
  const { t } = useTranslation();
  const { hasCopied, onCopy } = useClipboard(value);
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const handleCopyClick = () => onCopy();

  return (
    <Tooltip
      arrowSize={15}
      hasArrow={true}
      isOpen={hasCopied}
      label={copiedTooltipLabel || t<string>('captions.copied')}
      placement="bottom"
    >
      <IconButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        aria-label={ariaLabel}
        icon={
          hasCopied ? (
            <Icon as={IoCheckmarkOutline} color="green.400" />
          ) : (
            <Icon as={IoCopyOutline} color={defaultTextColor} />
          )
        }
        onClick={handleCopyClick}
        size="sm"
        variant="ghost"
      />
    </Tooltip>
  );
};

export default CopyButton;
