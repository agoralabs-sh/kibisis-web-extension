import { Icon, IconProps } from '@chakra-ui/react';
import React, { FC } from 'react';

const QRCodeFrameIcon: FC<IconProps> = (props: IconProps) => (
  <Icon viewBox="0 0 100 100" {...props}>
    <path
      d="M25,2 L2,2 L2,25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />

    <path
      d="M2,75 L2,98 L25,98"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />

    <path
      d="M75,98 L98,98 L98,75"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />

    <path
      d="M98,25 L98,2 L75,2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
  </Icon>
);

export default QRCodeFrameIcon;
