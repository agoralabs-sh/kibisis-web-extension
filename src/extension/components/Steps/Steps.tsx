import { Steps as ChakraSteps, StepsProps } from 'chakra-ui-steps';
import React, { FC } from 'react';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

const Steps: FC<StepsProps> = (props: StepsProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();

  return (
    <ChakraSteps
      {...props}
      sx={{
        '& .cui-steps__vertical-step-container span': {
          color: defaultTextColor,
        },
        '& .cui-steps__step-icon-container': {
          bg: textBackgroundColor,
        },
      }}
    />
  );
};

export default Steps;
