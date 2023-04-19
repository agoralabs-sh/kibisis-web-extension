import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import IconButton from '@extension/components/IconButton';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps {
  subTitle?: string;
  title: string;
}

const PageHeader: FC<IProps> = ({ subTitle, title }: IProps) => {
  const navigate: NavigateFunction = useNavigate();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleBackClick = () => navigate(-1);

  return (
    <HStack pb={DEFAULT_GAP - 2} spacing={4} w="full">
      <IconButton
        aria-label="Go back"
        icon={IoArrowBackOutline}
        onClick={handleBackClick}
        variant="ghost"
      />
      <VStack
        alignItems="center"
        flexGrow={1}
        justifyContent="center"
        spacing={1}
      >
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {title}
        </Heading>
        {subTitle && (
          <Text color={subTextColor} fontSize="xs" textAlign="center">
            {subTitle}
          </Text>
        )}
      </VStack>
      <Box w="40px" /> {/* zombie element to off center the title */}
    </HStack>
  );
};

export default PageHeader;
