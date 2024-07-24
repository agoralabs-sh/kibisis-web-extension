import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC, ReactEventHandler, useState } from 'react';
import { IconType } from 'react-icons';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';

// theme
import { theme } from '@extension/theme';

interface IProps {
  icon?: IconType;
  isSelected: boolean;
  label: string;
  onClick?: ReactEventHandler<HTMLDivElement>;
}

const SettingsSelectItemOption: FC<IProps> = ({
  icon,
  isSelected,
  label,
  onClick,
}: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  // state
  const [backgroundColor, setBackgroundColor] = useState<string>(
    isSelected ? primaryColor : BODY_BACKGROUND_COLOR
  );
  // misc
  const formattedDefaultTextColor: string = isSelected
    ? primaryButtonTextColor
    : defaultTextColor;
  // handlers
  const handleMouseEnter = () => {
    if (!isSelected) {
      setBackgroundColor(buttonHoverBackgroundColor);
    }
  };
  const handleMouseLeave = () => {
    if (!isSelected) {
      setBackgroundColor(BODY_BACKGROUND_COLOR);
    }
  };

  return (
    <HStack
      alignItems="center"
      backgroundColor={backgroundColor}
      cursor="pointer"
      justifyContent="flex-start"
      m={0}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      p={DEFAULT_GAP / 2}
      spacing={2}
    >
      {/*icon*/}
      {icon && <Icon as={icon} color={formattedDefaultTextColor} h={4} w={4} />}

      {/*label*/}
      <Text
        color={formattedDefaultTextColor}
        fontSize="sm"
        maxW={250}
        noOfLines={1}
      >
        {label}
      </Text>
    </HStack>
  );
};

export default SettingsSelectItemOption;
