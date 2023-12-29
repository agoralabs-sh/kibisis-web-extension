import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Input,
  Tooltip,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import EditableAccountControls from './EditableAccountControls';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';

interface IProps {
  value: string;
}

const EditableAccountField: FC<IProps> = ({ value }: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();

  return (
    <Editable
      fontSize="md"
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      textAlign="left"
      value={value}
    >
      <Tooltip label="Click to edit" shouldWrapChildren={true}>
        <EditablePreview
          py={1}
          px={1}
          _hover={{
            background: buttonHoverBackgroundColor,
          }}
        />
      </Tooltip>

      <HStack w="full">
        {/*/inout*/}
        <Input py={2} px={4} as={EditableInput} />

        {/*controls*/}
        <EditableAccountControls />
      </HStack>
    </Editable>
  );
};

export default EditableAccountField;
