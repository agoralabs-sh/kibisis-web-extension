import { Box, Heading, HStack, IconButton, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Divider from '../Divider';

interface IProps {
  title: string;
}

const MainHeader: FC<IProps> = ({ title }: IProps) => {
  const navigate: NavigateFunction = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <VStack spacing={0} w="full">
      <HStack spacing={0} w="full">
        <IconButton
          aria-label="Go back"
          borderRadius={0}
          colorScheme="gray"
          icon={<IoArrowBackOutline />}
          onClick={handleBackClick}
          variant="ghost"
        />
        <Heading color="gray.500" flexGrow={1} size="md" textAlign="center">
          {title}
        </Heading>
        <Box w="40px" />
      </HStack>
      <Divider />
    </VStack>
  );
};

export default MainHeader;
