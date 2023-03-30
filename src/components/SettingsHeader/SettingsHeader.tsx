import { Box, Heading, HStack, IconButton } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Constants
import { DEFAULT_GAP } from '../../constants';

interface IProps {
  title: string;
}

const SettingsHeader: FC<IProps> = ({ title }: IProps) => {
  const navigate: NavigateFunction = useNavigate();
  const handleBackClick = () => navigate(-1);

  return (
    <HStack pb={DEFAULT_GAP - 2} spacing={0} w="full">
      <IconButton
        aria-label="Go back"
        borderRadius={0}
        colorScheme="gray"
        icon={<IoArrowBackOutline />}
        onClick={handleBackClick}
        variant="ghost"
      />
      <Heading color="gray.500" flexGrow={1} size="sm" textAlign="center">
        {title}
      </Heading>
      <Box w="40px" /> {/* zombie element to off center the title */}
    </HStack>
  );
};

export default SettingsHeader;
