import {
  Checkbox,
  Code,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Account, generateAccount, secretKeyToMnemonic } from 'algosdk';
import { Step, useSteps } from 'chakra-ui-steps';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '@extension/components/Button';
import CopyButton from '@extension/components/CopyButton';
import PageHeader from '@extension/components/PageHeader';
import Steps from '@extension/components/Steps';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { IAddAccountCompleteFunction } from '@extension/types';

interface IProps {
  onComplete: IAddAccountCompleteFunction;
  saving: boolean;
}

const CreateNewAccountPage: FC<IProps> = ({ onComplete, saving }: IProps) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [account] = useState<Account>(generateAccount());
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>(account.addr);
  const [copySeedPhraseConfirm, setCopySeedPhraseConfirm] =
    useState<boolean>(false);
  const stepsLabels: string[] = [
    t<string>('headings.generateSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  const handleCopySeedPhraseConfirmChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    setCopySeedPhraseConfirm(event.target.checked);
  };
  const handleNextClick = () => nextStep();
  const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= 0) {
      navigate(-1);

      return;
    }

    prevStep();
  };
  const handleSaveClick = () => {
    if (!copySeedPhraseConfirm) {
      setError(t<string>('errors.inputs.copySeedPhraseRequired'));

      return;
    }

    onComplete({
      name,
      privateKey: account.sk,
    });
  };

  return (
    <>
      <PageHeader
        title={t<string>('titles.page', { context: 'createNewAccount' })}
      />
      <VStack
        flexGrow={1}
        justifyContent="center"
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={2}
        w="full"
      >
        <Steps
          activeStep={activeStep}
          colorScheme={primaryColorScheme}
          flexGrow={0}
          orientation="vertical"
          variant="circles"
        >
          {/* Save mnemonic */}
          <Step label={stepsLabels[0]}>
            <VStack
              alignItems="flex-start"
              p={1}
              spacing={DEFAULT_GAP}
              w="full"
            >
              <VStack alignItems="flex-start" spacing={2} w="full">
                <Text color={subTextColor} size="md" textAlign="left">
                  {t<string>('captions.saveMnemonicPhrase1')}
                </Text>
                <Text color={subTextColor} size="md" textAlign="left">
                  {t<string>('captions.saveMnemonicPhrase2')}
                </Text>
                <Grid gap={2} templateColumns="repeat(3, 1fr)" w="full">
                  {secretKeyToMnemonic(account.sk)
                    .split(' ')
                    .map((value, index, array) => {
                      if (index >= array.length - 1) {
                        return (
                          <GridItem colEnd={2} colStart={2} key={nanoid()}>
                            <Code w="full">{value}</Code>
                          </GridItem>
                        );
                      }

                      return (
                        <GridItem key={nanoid()}>
                          <Code w="full">{value}</Code>
                        </GridItem>
                      );
                    })}
                </Grid>
              </VStack>
              <CopyButton
                colorScheme={primaryColorScheme}
                size="md"
                value={secretKeyToMnemonic(account.sk)}
                variant="solid"
                w="full"
              >
                {t<string>('buttons.copySeedPhrase')}
              </CopyButton>
            </VStack>
          </Step>
          {/* Name account */}
          <Step label={stepsLabels[1]}>
            <VStack alignItems="flex-start" p={1} spacing={2} w="full">
              <Text color={subTextColor} size="md" textAlign="left">
                {t<string>('captions.nameYourAccount')}
              </Text>
              <VStack w="full">
                <Text color={defaultTextColor} textAlign="left" w="full">
                  {t<string>('labels.accountName')}
                </Text>
                <InputGroup size="md">
                  <Input
                    focusBorderColor={primaryColor}
                    isDisabled={saving}
                    onChange={handleOnNameChange}
                    placeholder={t<string>('placeholders.nameAccount')}
                    type="text"
                    value={name || ''}
                  />
                </InputGroup>
              </VStack>
            </VStack>
          </Step>
        </Steps>

        {/* Confirm completed */}
        {hasCompletedAllSteps && (
          <VStack alignItems="flex-start" spacing={2} w="full">
            <Heading color={defaultTextColor} fontSize="md" textAlign="left">
              {t<string>('headings.newAccountComplete')}
            </Heading>
            <Text color={subTextColor} fontSize="md" textAlign="left">
              {t<string>('captions.newAccountComplete')}
            </Text>
            <Checkbox
              colorScheme={error ? 'red' : primaryColorScheme}
              isChecked={copySeedPhraseConfirm}
              isDisabled={saving}
              onChange={handleCopySeedPhraseConfirmChange}
            >
              <Text color={subTextColor} fontSize="sm">
                {t<string>('labels.copySeedPhraseConfirm')}
              </Text>
            </Checkbox>
            {error && (
              <Text color="red.500" fontSize="xs" textAlign="left">
                {error}
              </Text>
            )}
          </VStack>
        )}

        <Spacer />

        <HStack spacing={4} w="full">
          <Button
            colorScheme={primaryColorScheme}
            onClick={handlePreviousClick}
            isDisabled={saving}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>
          {hasCompletedAllSteps ? (
            <Button
              colorScheme={primaryColorScheme}
              onClick={handleSaveClick}
              isLoading={saving}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.save')}
            </Button>
          ) : (
            <Button
              colorScheme={primaryColorScheme}
              onClick={handleNextClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.next')}
            </Button>
          )}
        </HStack>
      </VStack>
    </>
  );
};

export default CreateNewAccountPage;
