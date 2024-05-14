import {
  Checkbox,
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
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import CopyButton from '@extension/components/CopyButton';
import PageHeader from '@extension/components/PageHeader';
import SeedPhraseDisplay from '@extension/components/SeedPhraseDisplay';
import Steps from '@extension/components/Steps';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IAddAccountPageProps } from '@extension/types';

const CreateNewAccountPage: FC<IAddAccountPageProps> = ({
  onComplete,
  saving,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [account] = useState<Account>(generateAccount());
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>(account.addr);
  const [copySeedPhraseConfirm, setCopySeedPhraseConfirm] =
    useState<boolean>(false);
  // misc
  const stepsLabels: string[] = [
    t<string>('headings.generateSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  // handlers
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
  const handleSaveClick = async () => {
    if (!copySeedPhraseConfirm) {
      setError(t<string>('errors.inputs.copySeedPhraseRequired'));

      return;
    }

    await onComplete({
      name: name !== account.addr ? name : null, //  if the address is the same as the name, ignore
      privateKey: account.sk,
    });
  };

  return (
    <>
      {/*page title*/}
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
          {/*save seed phrase*/}
          <Step label={stepsLabels[0]}>
            <VStack
              alignItems="flex-start"
              p={1}
              spacing={DEFAULT_GAP}
              w="full"
            >
              <VStack
                alignItems="flex-start"
                spacing={DEFAULT_GAP / 2}
                w="full"
              >
                <Text
                  color={subTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('captions.saveMnemonicPhrase1')}
                </Text>

                <Text
                  color={subTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('captions.saveMnemonicPhrase2')}
                </Text>

                {/*seed phrase*/}
                <SeedPhraseDisplay
                  seedPhrase={secretKeyToMnemonic(account.sk)}
                />
              </VStack>

              {/*copy seed phrase button*/}
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

          {/*name account*/}
          <Step label={stepsLabels[1]}>
            <VStack
              alignItems="flex-start"
              p={1}
              spacing={DEFAULT_GAP / 2}
              w="full"
            >
              <Text
                color={subTextColor}
                fontSize="sm"
                textAlign="left"
                w="full"
              >
                {t<string>('captions.nameYourAccount')}
              </Text>

              <VStack w="full">
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
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

        {/*confirm completed*/}
        {hasCompletedAllSteps && (
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 2} w="full">
            <Heading color={defaultTextColor} fontSize="md" textAlign="left">
              {t<string>('headings.newAccountComplete')}
            </Heading>

            <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
              {t<string>('captions.newAccountComplete')}
            </Text>

            <Checkbox
              colorScheme={error ? 'red' : primaryColorScheme}
              isChecked={copySeedPhraseConfirm}
              isDisabled={saving}
              onChange={handleCopySeedPhraseConfirmChange}
            >
              <Text
                color={subTextColor}
                fontSize="xs"
                textAlign="left"
                w="full"
              >
                {t<string>('labels.copySeedPhraseConfirm')}
              </Text>
            </Checkbox>

            {error && (
              <Text color="red.500" fontSize="xs" textAlign="left" w="full">
                {error}
              </Text>
            )}
          </VStack>
        )}

        <Spacer />

        <HStack spacing={DEFAULT_GAP - 2} w="full">
          {/*previous button*/}
          <Button
            onClick={handlePreviousClick}
            isDisabled={saving}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>

          {hasCompletedAllSteps ? (
            // save button
            <Button
              onClick={handleSaveClick}
              isLoading={saving}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.save')}
            </Button>
          ) : (
            // next button
            <Button
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
