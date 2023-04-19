import {
  ButtonProps,
  Heading,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, MouseEvent } from 'react';
import { IconType } from 'react-icons';

// Components
import Button from '@extension/components/Button';
import EmptyIcon from '@extension/components/EmptyIcon';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IButtonProps {
  colorScheme?: string;
  icon?: IconType;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}
interface IProps extends StackProps {
  button?: IButtonProps;
  description?: string;
  text: string;
}

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
          leftIcon: <button.icon />,
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
      p={4}
      spacing={3}
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
