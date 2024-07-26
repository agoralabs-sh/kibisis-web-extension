import {
  CircularProgress,
  CircularProgressLabel,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const CircularProgressWithIcon: FC<IProps> = ({
  icon,
  iconColor,
  progress,
  progressColor,
}) => {
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  const trackColor = useColorModeValue('gray.300', 'whiteAlpha.400');
  // misc
  const iconSize = calculateIconSize('lg');

  return (
    <CircularProgress
      color={progressColor || primaryColor}
      isIndeterminate={!progress}
      size="100px"
      thickness="4px"
      trackColor={trackColor}
      {...(progress && {
        value: progress[1] > 0 ? (progress[0] / progress[1]) * 100 : 0,
      })}
    >
      <CircularProgressLabel
        alignItems="center"
        display="flex"
        justifyContent="center"
      >
        <Icon
          as={icon}
          color={iconColor || subTextColor}
          h={iconSize}
          w={iconSize}
        />
      </CircularProgressLabel>
    </CircularProgress>
  );
};

export default CircularProgressWithIcon;
