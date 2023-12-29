import { HStack, useEditableControls } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';

const EditableAccountControls: FC = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();

  if (!isEditing) {
    return null;
  }

  return (
    <HStack>
      {/*submit*/}
      <IconButton
        {...getSubmitButtonProps()}
        aria-label="Confirm rename account"
        icon={IoCheckmarkOutline}
        size="sm"
        variant="ghost"
      />

      {/*cancel*/}
      <IconButton
        {...getCancelButtonProps()}
        aria-label="Cancel rename account"
        icon={IoCloseOutline}
        size="sm"
        variant="ghost"
      />
    </HStack>
  );
};

export default EditableAccountControls;
