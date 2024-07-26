import { Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { isValidAddress } from 'algosdk';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const AddWatchAccountPage: FC<IProps> = ({ onComplete, saving }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeStep, nextStep, prevStep, setStep } = useSteps({
    initialStep: StepsEnum.Address,
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [address, setAddress] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  // misc
  const stepsLabels: string[] = [
    t<string>('headings.enterAnAddress'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  const validateAddress = (value: string): string | null => {
    if (value.length <= 0) {
      return t<string>('errors.inputs.required', {
        name: t<string>('labels.address'),
      });
    }

    if (!isValidAddress(value)) {
      return t<string>('errors.inputs.invalidAddress');
    }

    return null;
  };
  // handlers
  const handleOnAddressChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAddress(event.target.value);
  const handleNextClick = () => {
    const _addressError = validateAddress(address || '');

    if (_addressError) {
      setAddressError(_addressError);

      return;
    }

    if (
      (activeStep === StepsEnum.Address && addressError) ||
      (activeStep === StepsEnum.AccountName && nameError)
    ) {
      return;
    }

    nextStep();
  };
  const handleOnAddressError = (value: string | null) => setAddressError(value);
  const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handleOnNameError = (value: string | null) => setNameError(value);
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= StepsEnum.Address) {
      navigate(-1);

      return;
    }

    prevStep();
  };
  const handleSaveClick = async () => {
    if (!address) {
      setStep(StepsEnum.Address);

      return;
    }

    await onComplete({
      address,
      name,
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
                label={t<string>('labels.address')}
                isDisabled={saving}
                onChange={handleOnAddressChange}
                onError={handleOnAddressError}
                placeholder={t<string>('placeholders.enterAddress')}
                required={true}
                type="text"
                validate={validateAddress}
                value={address || ''}
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

export default AddWatchAccountPage;
