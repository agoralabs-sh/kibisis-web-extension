import { Spacer, Text, VStack } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Button from '@extension/components/Button';
import CreatePasswordInput from '@extension/components/CreatePasswordInput';
import PageHeader from '@extension/components/PageHeader';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const ChangePasswordPage: FC = () => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const [password, setPassword] = useState<string | null>(null);
  const [score, setScore] = useState<number>(-1);
  const handlePasswordChange = (newPassword: string, newScore: number) => {
    setPassword(newPassword);
    setScore(newScore);
  };
  const handleChangeClick = () => {
    console.log('choose change');
  };

  return (
    <>
      <PageHeader
        title={t<string>('titles.page', { context: 'changePassword' })}
      />
      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={8}
        w="full"
      >
        <VStack flexGrow={1} spacing={8} w="full">
          <Text color={defaultTextColor}>
            {t<string>('captions.changePassword')}
          </Text>
          <CreatePasswordInput
            onChange={handlePasswordChange}
            score={score}
            value={password || ''}
          />
        </VStack>
        <Button
          colorScheme="primary"
          onClick={handleChangeClick}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.changePassword')}
        </Button>
      </VStack>
    </>
  );
};

export default ChangePasswordPage;
