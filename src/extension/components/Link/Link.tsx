import React, {
  type PropsWithoutRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type LegacyRef,
  type RefAttributes,
} from 'react';
import {
  Button,
  ButtonProps,
  Link as ChakraLink,
  type LinkProps,
} from '@chakra-ui/react';
import { IoOpenOutline } from 'react-icons/io5';

// hooks
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

const Link: ForwardRefExoticComponent<
  PropsWithoutRef<LinkProps> &
    PropsWithoutRef<ButtonProps> &
    RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ButtonProps & LinkProps>((props, ref) => {
  // hooks
  const primaryColorScheme = usePrimaryColorScheme();

  return (
    <Button
      colorScheme={primaryColorScheme}
      {...props}
      as={ChakraLink}
      ref={ref as LegacyRef<HTMLButtonElement>}
      {...(props.isExternal && {
        rightIcon: <IoOpenOutline />,
        target: '_blank',
      })}
      variant="link"
    />
  );
});

Link.displayName = 'Link';

export default Link;
