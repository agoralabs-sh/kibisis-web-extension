import { Heading, Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const AccountNftsTab: FC = () => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <TabPanel
      flexGrow={1}
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
        <Spacer />
        <VStack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          w="full"
        >
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.comingSoon')}
          </Heading>
        </VStack>
        <Spacer />
      </VStack>
    </TabPanel>
  );
};

export default AccountNftsTab;
