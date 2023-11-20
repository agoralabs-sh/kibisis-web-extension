import {
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
} from 'react';
import { IconType } from 'react-icons';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

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
        _active={{
          bg: buttonHoverBackgroundColor,
        }}
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
