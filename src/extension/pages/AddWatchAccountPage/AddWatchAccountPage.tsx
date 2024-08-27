import { Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { isValidAddress } from 'algosdk';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoSaveOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import GenericInput from '@extension/components/GenericInput';
import PageHeader from '@extension/components/PageHeader';
import Steps from '@extension/components/Steps';

// constants
import { ACCOUNT_NAME_BYTE_LIMIT, DEFAULT_GAP } from '@extension/constants';

// enums
import { StepsEnum } from './enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const AddWatchAccountPage: FC<IProps> = ({ onComplete, saving }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeStep, nextStep, prevStep } = useSteps({
    initialStep: StepsEnum.Address,
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    error: addressError,
    label: addressLabel,
    onBlur: addressOnBlur,
    onChange: addressOnChange,
    required: isAddressRequired,
    value: addressValue,
    validate: addressValidate,
  } = useGenericInput({
    label: t<string>('labels.address'),
    required: true,
    validate: (_value: string) => {
      if (!isValidAddress(_value)) {
        return t<string>('errors.inputs.invalidAddress');
      }

      return null;
    },
  });
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
  // misc
  const stepsLabels = [
    t<string>('headings.enterAnAddress'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps = activeStep === stepsLabels.length;
  // handlers
  const handleNextClick = () => {
    if (
      (activeStep === StepsEnum.Address &&
        (!!addressError || !!addressValidate(addressValue))) ||
      (activeStep === StepsEnum.AccountName &&
        (!!nameError || !!nameValidate(nameValue)))
    ) {
      return;
    }

    nextStep();
  };
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= StepsEnum.Address) {
      navigate(-1);

      return;
    }

    prevStep();
  };
  const handleSaveClick = async () => {
    await onComplete({
      address: addressValue,
      name: nameValue.length > 0 ? nameValue : null,
    });
  };

  return (
    <>
      {/*page title*/}
      <PageHeader
        title={t<string>('titles.page', { context: 'addWatchAccount' })}
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
          {/*enter address*/}
          <Step label={stepsLabels[StepsEnum.Address]}>
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
                {t<string>('captions.enterWatchAccountAddress')}
              </Text>

              <GenericInput
                error={addressError}
                label={addressLabel}
                isDisabled={saving}
                onBlur={addressOnBlur}
                onChange={addressOnChange}
                placeholder={t<string>('placeholders.enterAddress')}
                required={isAddressRequired}
                type="text"
                validate={addressValidate}
                value={addressValue}
              />
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
                color={subTextColor}
                fontSize="sm"
                textAlign="left"
                w="full"
              >
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
              {t<string>('captions.addWatchAccountComplete')}
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
            // save button
            <Button
              isLoading={saving}
              onClick={handleSaveClick}
              rightIcon={<IoSaveOutline />}
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
              rightIcon={<IoArrowForwardOutline />}
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

export default AddWatchAccountPage;
