import { Box } from '@chakra-ui/react';
import React, { CSSProperties, FC } from 'react';
interface IProps {
  score: number;
}

const StrengthMeter: FC<IProps> = ({ score }: IProps) => {
  const getStrengthProperties = (): CSSProperties => {
    if (score < 0) {
      return {
        width: '0',
      };
    }

    if (score <= 0) {
      return {
        background: 'darkred',
        width: '20%',
      };
    }

    if (score <= 1) {
      return {
        background: 'orangered',
        width: '40%',
      };
    }

    if (score <= 2) {
      return {
        background: 'orange',
        width: '60%',
      };
    }

    if (score <= 3) {
      return {
        background: 'yellowgreen',
        width: '80%',
      };
    }

    // 4+
    return {
      background: 'green',
      width: '100%',
    };
  };

  return (
    <Box
      as="div"
      style={{
        background: 'var(--chakra-colors-gray-300)',
        borderRadius: '2px',
        height: '3px',
        margin: '7px 0',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        as="div"
        style={{
          borderColor: 'inherit',
          height: 'inherit',
          transition: 'width 0.5s ease-in-out, background 0.25s',
          ...getStrengthProperties(),
        }}
      />
    </Box>
  );
};

export default StrengthMeter;
