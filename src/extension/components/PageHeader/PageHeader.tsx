import {
  Box,
  Heading,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// components
import IconButton from '@extension/components/IconButton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const PageHeader: FC<IProps> = ({
  hideBackButton = false,
  loading = false,
  subTitle,
  title,
}) => {
  const navigate: NavigateFunction = useNavigate();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const minHeight = 10; // 2.5rem - 40px
  // handlers
  const handleBackClick = () => navigate(-1);

  return (
    <HStack
      minH={minHeight}
      mb={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {/*back button*/}
      {!hideBackButton && (
        <IconButton
          aria-label="Go back"
          icon={IoArrowBackOutline}
          onClick={handleBackClick}
          variant="ghost"
        />
      )}

      <VStack
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        spacing={1}
        w="full"
      >
        {loading ? (
          <Skeleton>
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {title}
            </Heading>
          </Skeleton>
        ) : (
          <>
            {/*title*/}
            <Tooltip label={title}>
              <Heading
                color={defaultTextColor}
                maxW={200}
                noOfLines={1}
                size="md"
                textAlign="center"
              >
                {title}
              </Heading>
            </Tooltip>

            {/*subtitle*/}
            {subTitle && (
              <Tooltip label={subTitle}>
                <Text color={subTextColor} fontSize="xs" textAlign="center">
                  {subTitle}
                </Text>
              </Tooltip>
            )}
          </>
        )}
      </VStack>

      {/* zombie element to off center the title */}
      {!hideBackButton && <Box minH={minHeight} minW={minHeight} />}
    </HStack>
  );
};

export default PageHeader;
