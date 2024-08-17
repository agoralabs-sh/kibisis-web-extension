import { ButtonProps, Heading, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import Button from '@extension/components/Button';
import EmptyIcon from '@extension/components/EmptyIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const EmptyState: FC<IProps> = ({
  button,
  description,
  text,
  ...stackProps
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const renderButton = () => {
    let buttonProps: ButtonProps;

    if (button) {
      buttonProps = {
        onClick: button.onClick,
        ...(button.colorScheme && {
          colorScheme: button.colorScheme,
        }),
        ...(button.icon && {
          rightIcon: <button.icon />,
        }),
      };

      return <Button {...buttonProps}>{button.label}</Button>;
    }

    return null;
  };

  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      p={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      <EmptyIcon h={20} w={20} />

      <Heading color={defaultTextColor} size="md" textAlign="center">
        {text}
      </Heading>

      {description && (
        <Text color={subTextColor} fontSize="sm" textAlign="center">
          {description}
        </Text>
      )}
      {renderButton()}
    </VStack>
  );
};

export default EmptyState;
