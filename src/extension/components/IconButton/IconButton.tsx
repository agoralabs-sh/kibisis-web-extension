import { Icon, IconButton as ChakraIconButton } from '@chakra-ui/react';
import React, {
  type PropsWithoutRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type LegacyRef,
  type RefAttributes,
} from 'react';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const IconButton: ForwardRefExoticComponent<
  PropsWithoutRef<IProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, IProps>(
  ({ color, icon, ...iconProps }: IProps, ref) => {
    // hooks
    const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
    const subTextColor = useSubTextColor();

    return (
      <ChakraIconButton
        {...iconProps}
        _active={{
          bg: buttonHoverBackgroundColor,
        }}
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        icon={<Icon as={icon} color={color || subTextColor} />}
        ref={ref as LegacyRef<HTMLButtonElement>}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
