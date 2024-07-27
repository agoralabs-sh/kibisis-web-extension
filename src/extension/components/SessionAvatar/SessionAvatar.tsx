import { Avatar, Box } from '@chakra-ui/react';
import React, { FC } from 'react';

// types
import type { IProps } from './types';

const SessionAvatar: FC<IProps> = ({ iconUrl, name, size = 'md' }) => {
  return (
    <Box position="relative" p={1}>
      {/*app icon */}
      <Avatar name={name} size={size} src={iconUrl} />
    </Box>
  );
};

export default SessionAvatar;
