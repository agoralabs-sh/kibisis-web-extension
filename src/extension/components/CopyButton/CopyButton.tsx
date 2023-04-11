import { ButtonProps, Icon, Tooltip, useClipboard } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// Components
import Button from '@extension/components/Button';

interface IProps extends ButtonProps {
  copiedTooltipLabel?: string;
  value: string;
}

const CopyButton: FC<IProps> = ({
  copiedTooltipLabel,
  value,
  ...buttonProps
}: IProps) => {
  const { t } = useTranslation();
  const { hasCopied, onCopy } = useClipboard(value);
  const handleCopyClick = () => onCopy();

  return (
    <Tooltip
      arrowSize={15}
      hasArrow={true}
      isOpen={hasCopied}
      label={copiedTooltipLabel || t<string>('captions.copied')}
      placement="bottom"
    >
      <Button
        {...buttonProps}
        onClick={handleCopyClick}
        rightIcon={
          hasCopied ? (
            <Icon as={IoCheckmarkOutline} />
          ) : (
            <Icon as={IoCopyOutline} />
          )
        }
      />
    </Tooltip>
  );
};

export default CopyButton;
