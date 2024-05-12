import {
  Heading,
  HStack,
  Input,
  InputGroup,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { isValidAddress } from 'algosdk';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';
import Steps from '@extension/components/Steps';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const AddWatchAccountPage: FC<IProps> = ({ onComplete, saving }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeStep, nextStep, prevStep, setStep } = useSteps({
    initialStep: 0,
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  // misc
  const stepsLabels: string[] = [
    t<string>('headings.enterAnAddress'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  // handlers
  const handleOnAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setAddress(event.target.value);
  };
  const handleNextClick = () => {
    // if the step is the first step validate the address
    if (activeStep <= 0) {
      if (!address) {
        setError(t<string>('errors.inputs.required', { name: 'Address' }));

        return;
      }

      if (!isValidAddress(address)) {
        setError(t<string>('errors.inputs.invalidAddress'));

        return;
      }
    }

    nextStep();
  };
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
    if (!address) {
      setError(t<string>('errors.inputs.required', { name: 'Address' }));
      setStep(0);

      return;
    }

    if (!isValidAddress(address)) {
      setError(t<string>('errors.inputs.invalidAddress'));
      setStep(0);

      return;
    }

    await onComplete({
      address,
      name,
    });
  };

  useEffect(() => {
    if (!name && address && isValidAddress(address)) {
      setName(address);
    }
  }, [address]);

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
          {/*enter address*/}
          <Step label={stepsLabels[0]}>
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

              <VStack w="full">
                {/*label*/}
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  w="full"
                >
                  <Text
                    color={error ? 'red.300' : defaultTextColor}
                    fontSize="sm"
                    textAlign="left"
                  >
                    {t<string>('labels.address')}
                  </Text>

                  <Text
                    color="red.300"
                    fontSize="xs"
                    textAlign="right"
                    w="full"
                  >
                    {error}
                  </Text>
                </HStack>

                <InputGroup size="md">
                  <Input
                    focusBorderColor={primaryColor}
                    isDisabled={saving}
                    onChange={handleOnAddressChange}
                    placeholder={t<string>('placeholders.enterAddress')}
                    type="text"
                    value={address || ''}
                  />
                </InputGroup>
              </VStack>
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
