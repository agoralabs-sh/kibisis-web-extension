import {
  Checkbox,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import CopyButton from '@extension/components/CopyButton';
import GenericInput from '@extension/components/GenericInput';
import PageHeader from '@extension/components/PageHeader';
import SeedPhraseDisplay from '@extension/components/SeedPhraseDisplay';
import Steps from '@extension/components/Steps';

// constants
import { ACCOUNT_NAME_BYTE_LIMIT, DEFAULT_GAP } from '@extension/constants';

// enums
import { StepsEnum } from './enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { IAddAccountPageProps } from '@extension/types';

// utils
import convertPrivateKeyToSeedPhrase from '@extension/utils/convertPrivateKeyToSeedPhrase';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const CreateNewAccountPage: FC<IAddAccountPageProps> = ({
  onComplete,
  saving,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: StepsEnum.SeedPhrase,
  });
  // selector
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [copySeedPhraseConfirm, setCopySeedPhraseConfirm] =
    useState<boolean>(false);
  const [copySeedPhraseError, setCopySeedPhraseError] = useState<string | null>(
    null
  );
  const [keyPair] = useState<Ed21559KeyPair>(Ed21559KeyPair.generate());
  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  // misc
  const _context = 'create-new-account-page';
  const seedPhrase = convertPrivateKeyToSeedPhrase({
    logger,
    privateKey: keyPair.privateKey,
  });
  const stepsLabels: string[] = [
    t<string>('headings.generateSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  // handlers
  const handleCopySeedPhraseConfirmChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCopySeedPhraseError(null);
    setCopySeedPhraseConfirm(event.target.checked);
  };
  const handleNextClick = () => {
    if (activeStep === StepsEnum.AccountName && nameError) {
      return;
    }

    nextStep();
  };
  const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= StepsEnum.SeedPhrase) {
      navigate(-1);

      return;
    }

    prevStep();
  };
  const handleOnNameError = (value: string | null) => setNameError(value);
  const handleSaveClick = async () => {
    if (!copySeedPhraseConfirm) {
      setCopySeedPhraseError(t<string>('errors.inputs.copySeedPhraseRequired'));

      return;
    }

    await onComplete({
      keyPair,
      name,
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
        spacing={DEFAULT_GAP / 3}
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
          <Step label={stepsLabels[StepsEnum.SeedPhrase]}>
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
                  _context={_context}
                  seedPhrase={seedPhrase}
                />
              </VStack>

              {/*copy seed phrase button*/}
              <CopyButton
                colorScheme={primaryColorScheme}
                size="md"
                value={seedPhrase}
                variant="solid"
                w="full"
              >
                {t<string>('buttons.copySeedPhrase')}
              </CopyButton>
            </VStack>
          </Step>

          {/*name account*/}
          <Step label={stepsLabels[StepsEnum.AccountName]}>
            <VStack
              alignItems="flex-start"
              p={1}
              spacing={DEFAULT_GAP / 2}
              w="full"
            >
              <Text
                color={defaultTextColor}
                fontSize="sm"
                textAlign="left"
                w="full"
              >
                {t<string>('captions.nameYourAccount')}
              </Text>

              <GenericInput
                characterLimit={ACCOUNT_NAME_BYTE_LIMIT}
                error={nameError}
                label={t<string>('labels.accountName')}
                isDisabled={saving}
                onChange={handleOnNameChange}
                onError={handleOnNameError}
                placeholder={t<string>('placeholders.nameAccount')}
                type="text"
                value={name || ''}
              />
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
              colorScheme={copySeedPhraseError ? 'red' : primaryColorScheme}
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

            {copySeedPhraseError && (
              <Text color="red.500" fontSize="xs" textAlign="left" w="full">
                {copySeedPhraseError}
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
