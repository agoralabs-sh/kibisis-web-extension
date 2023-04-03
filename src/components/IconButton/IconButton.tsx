import {
  ColorMode,
  Icon,
  IconButton as ChakraIconButton,
  IconButtonProps,
} from '@chakra-ui/react';
import React, {
  PropsWithoutRef,
  ForwardRefExoticComponent,
  forwardRef,
  LegacyRef,
  RefAttributes,
  useState,
} from 'react';
import { IconType } from 'react-icons';

// Hooks
import useButtonHoverBackgroundColor from '../../hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

interface IProps extends Omit<IconButtonProps, 'icon'> {
  icon: IconType;
}

const IconButton: ForwardRefExoticComponent<
  PropsWithoutRef<IProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, IProps>(
  ({ icon, ...iconProps }: IProps, ref) => {
    const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
    const defaultTextColor: string = useDefaultTextColor();

    return (
      <ChakraIconButton
        {...iconProps}
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        icon={<Icon as={icon} color={defaultTextColor} />}
        ref={ref as LegacyRef<HTMLButtonElement>}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
