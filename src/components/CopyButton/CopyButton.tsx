import {
  ColorMode,
  Icon,
  IconButton,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import { useSelectColorMode } from '../../selectors';

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
  const defaultTextColor: string = useDefaultTextColor();
  const colorMode: ColorMode = useSelectColorMode();
  const [active, setActive] = useState<boolean>(false);
  const handleCopyClick = () => onCopy();
  const handleMouseOver = () => setActive(!active);

  return (
    <Tooltip
      arrowSize={15}
      hasArrow={true}
      isOpen={hasCopied}
      label={copiedTooltipLabel || t<string>('captions.copied')}
      placement="bottom"
    >
      <IconButton
        aria-label={ariaLabel}
        icon={
          hasCopied ? (
            <Icon as={IoCheckmarkOutline} color="green.400" />
          ) : (
            <Icon
              as={IoCopyOutline}
              color={
                active && colorMode === 'dark' ? 'gray.500' : defaultTextColor
              }
            />
          )
        }
        onClick={handleCopyClick}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOver}
        size="sm"
        variant="ghost"
      />
    </Tooltip>
  );
};

export default CopyButton;
