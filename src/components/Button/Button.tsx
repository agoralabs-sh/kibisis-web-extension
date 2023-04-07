import React, {
  PropsWithoutRef,
  ForwardRefExoticComponent,
  forwardRef,
  LegacyRef,
  RefAttributes,
} from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

// Theme
import { theme } from '../../theme';

const Button: ForwardRefExoticComponent<
  PropsWithoutRef<ButtonProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref) => (
  <ChakraButton
    {...props}
    borderRadius={theme.radii['3xl']}
    ref={ref as LegacyRef<HTMLButtonElement>}
  />
));

Button.displayName = 'Button';

export default Button;
