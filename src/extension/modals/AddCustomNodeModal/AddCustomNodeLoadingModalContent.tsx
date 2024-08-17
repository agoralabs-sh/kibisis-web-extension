import { Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineCallReceived } from 'react-icons/md';

// components
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const AddCustomNodeLoadingModalContent: FC = () => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgressWithIcon
        icon={MdOutlineCallReceived}
        iconColor={defaultTextColor}
      />

      {/*caption*/}
      <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
        {t<string>('captions.fetchingNetworkDetails')}
      </Text>
    </VStack>
  );
};

export default AddCustomNodeLoadingModalContent;
