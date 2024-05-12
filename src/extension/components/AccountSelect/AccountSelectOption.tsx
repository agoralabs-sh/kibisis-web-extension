import { HStack } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import AccountItem from '@extension/components/AccountItem';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  OPTION_HEIGHT,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IOptionProps } from './types';

const AccountSelectOption: FC<IOptionProps> = ({
  account,
  isSelected,
  onClick,
}) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = useColorModeValue(
    theme.colors.primaryLight['100'],
    theme.colors.primaryDark['100']
  );
  const subTextColor = useSubTextColor();
  // state
  const [backgroundColor, setBackgroundColor] = useState<string>(
    isSelected ? primaryColor : BODY_BACKGROUND_COLOR
  );
  // misc
  const formattedDefaultTextColor: string = isSelected
    ? primaryButtonTextColor
    : defaultTextColor;
  const formattedSubTextColor: string = isSelected
    ? primaryButtonTextColor
    : subTextColor;
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
      h={OPTION_HEIGHT}
      m={0}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      p={DEFAULT_GAP / 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <AccountItem
        account={account}
        subTextColor={formattedSubTextColor}
        textColor={formattedDefaultTextColor}
      />
    </HStack>
  );
};

export default AccountSelectOption;
