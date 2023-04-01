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
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

// Selectors
import { useSelectColorMode } from '../../selectors';

interface IProps extends Omit<IconButtonProps, 'icon'> {
  icon: IconType;
}

const IconButton: ForwardRefExoticComponent<
  PropsWithoutRef<IProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, IProps>(
  ({ icon, ...iconProps }: IProps, ref) => {
    const defaultTextColor: string = useDefaultTextColor();
    const colorMode: ColorMode = useSelectColorMode();
    const [active, setActive] = useState<boolean>(false);
    const handleMouseOver = () => setActive(!active);

    return (
      <ChakraIconButton
        {...iconProps}
        icon={
          <Icon
            as={icon}
            color={
              active && colorMode === 'dark' ? 'gray.500' : defaultTextColor
            }
          />
        }
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOver}
        ref={ref as LegacyRef<HTMLButtonElement>}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
