import { Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoDownloadOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import GenericInput from '@extension/components/GenericInput';
import PageHeader from '@extension/components/PageHeader';
import SeedPhraseInput from '@extension/components/SeedPhraseInput';
import Steps from '@extension/components/Steps';

// constants
import { ACCOUNT_NAME_BYTE_LIMIT, DEFAULT_GAP } from '@extension/constants';

// enums
import { StepsEnum } from './enums';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type {
  IAddAccountPageProps,
  IAppThunkDispatch,
  IMainRootState,
  IRegistrationRootState,
} from '@extension/types';

// utils
import { validate } from '@extension/components/SeedPhraseInput';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import convertSeedPhraseToPrivateKey from '@extension/utils/convertSeedPhraseToPrivateKey';

const ImportAccountViaSeedPhrasePage: FC<IAddAccountPageProps> = ({
  onComplete,
  saving,
}) => {
  const { t } = useTranslation();
  const dispatch =
    useDispatch<IAppThunkDispatch<IMainRootState | IRegistrationRootState>>();
  const navigate = useNavigate();
  // selectors
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    charactersRemaining: nameCharactersRemaining,
    error: nameError,
    label: nameLabel,
    onBlur: nameOnBlur,
    onChange: nameOnChange,
    required: isNameRequired,
    value: nameValue,
    validate: nameValidate,
  } = useGenericInput({
    characterLimit: ACCOUNT_NAME_BYTE_LIMIT,
    label: t<string>('labels.accountName'),
    required: false,
  });
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // states
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: StepsEnum.SeedPhrase,
  });
  const [keyPair, setKeyPair] = useState<Ed21559KeyPair | null>(null);
  const [seedPhrases, setSeedPhrases] = useState<string[]>(
    Array.from({ length: 25 }, () => '')
  );
  const [seedPhraseError, setSeedPhraseError] = useState<string | null>(null);
  // misc
  const _context = 'import-account-via-seed-phrase-page';
  const stepsLabels = [
    t<string>('headings.enterYourSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  // handlers
  const handleImportClick = async () => {
    const _functionName = 'handleImportClick';

    if (!keyPair) {
      logger.debug(
        `${ImportAccountViaSeedPhrasePage.name}#${_functionName}: unable to import account, account "null"`
      );

      dispatch(
        createNotification({
          ephemeral: true,
          description: t<string>('errors.descriptions.code'),
          title: t<string>('errors.titles.code'),
          type: 'error',
        })
      );

      return;
    }

    logger.debug(
      `${
        ImportAccountViaSeedPhrasePage.name
      }#${_functionName}: importing account "${convertPublicKeyToAVMAddress(
        keyPair.publicKey
      )}"`
    );

    await onComplete({
      keyPair,
      name: nameValue.length > 0 ? nameValue : null,
    });
  };
  const handleOnMnemonicPhraseChange = (value: string[]) =>
    setSeedPhrases(value);
  const handleNextClick = () => {
    let _seedPhraseError: string | null;

    // if this is the first step, validate the mnemonic
    if (activeStep <= StepsEnum.SeedPhrase) {
      _seedPhraseError = validate(
        t<string>('labels.seedPhrase'),
        seedPhrases,
        t
      );

      setSeedPhraseError(_seedPhraseError);

      // if we have an error, deny the next step
      if (_seedPhraseError) {
        return;
      }

      setKeyPair(
        Ed21559KeyPair.generateFromPrivateKey(
          convertSeedPhraseToPrivateKey({
            logger,
            seedPhrase: seedPhrases.join(' '),
          })
        )
      );
    }

    if (
      activeStep === StepsEnum.AccountName &&
      (!!nameError || !!nameValidate(nameValue))
    ) {
      return;
    }

    nextStep();
  };
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= StepsEnum.SeedPhrase) {
      navigate(-1);

      return;
    }

    prevStep();
  };

  return (
    <>
      {/*page title*/}
      <PageHeader
        title={t<string>('titles.page', {
          context: 'importAccountViaSeedPhrase',
        })}
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
          {/*enter seed phrase inputs*/}
          <Step label={stepsLabels[StepsEnum.SeedPhrase]}>
            <VStack
              alignItems="flex-start"
              p={1}
              spacing={DEFAULT_GAP / 3}
              w="full"
            >
              <Text color={subTextColor} fontSize="sm" textAlign="left">
                {t<string>('captions.enterSeedPhrase')}
              </Text>

              <SeedPhraseInput
                _context={_context}
                disabled={saving}
                error={seedPhraseError}
                onChange={handleOnMnemonicPhraseChange}
                phrases={seedPhrases}
              />
            </VStack>
          </Step>

          {/*name account input*/}
          <Step label={stepsLabels[StepsEnum.AccountName]}>
            <VStack
              alignItems="flex-start"
              p={1}
              spacing={DEFAULT_GAP / 3}
              w="full"
            >
              <Text color={subTextColor} fontSize="sm" textAlign="left">
                {t<string>('captions.nameYourAccount')}
              </Text>

              <GenericInput
                charactersRemaining={nameCharactersRemaining}
                error={nameError}
                label={nameLabel}
                isDisabled={saving}
                onBlur={nameOnBlur}
                onChange={nameOnChange}
                required={isNameRequired}
                placeholder={t<string>('placeholders.nameAccount')}
                type="text"
                validate={nameValidate}
                value={nameValue}
              />
            </VStack>
          </Step>
        </Steps>

        {/*confirm completed*/}
        {hasCompletedAllSteps && (
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
            <Heading color={defaultTextColor} fontSize="md" textAlign="left">
              {t<string>('headings.almostThere')}
            </Heading>

            <Text color={subTextColor} fontSize="sm" textAlign="left">
              {t<string>('captions.importAccountViaSeedPhraseComplete')}
            </Text>
          </VStack>
        )}

        <Spacer />

        <HStack spacing={DEFAULT_GAP - 2} w="full">
          {/*previous button*/}
          <Button
            isDisabled={saving}
            leftIcon={<IoArrowBackOutline />}
            onClick={handlePreviousClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>

          {hasCompletedAllSteps ? (
            // import button
            <Button
              isLoading={saving}
              onClick={handleImportClick}
              rightIcon={<IoDownloadOutline />}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.import')}
            </Button>
          ) : (
            // next button
            <Button
              isLoading={saving}
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

export default ImportAccountViaSeedPhrasePage;
