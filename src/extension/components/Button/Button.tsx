import React, {
  PropsWithoutRef,
  ForwardRefExoticComponent,
  forwardRef,
  LegacyRef,
  RefAttributes,
} from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

// Hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// Theme
import { theme } from '@extension/theme';

const Button: ForwardRefExoticComponent<
  PropsWithoutRef<ButtonProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref) => {
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();

  return (
    <ChakraButton
      color={props.variant !== 'outline' ? primaryButtonTextColor : props.color}
      colorScheme={primaryColorScheme}
      {...props}
      borderRadius={theme.radii['3xl']}
      ref={ref as LegacyRef<HTMLButtonElement>}
    />
  );
});

Button.displayName = 'Button';

export default Button;
