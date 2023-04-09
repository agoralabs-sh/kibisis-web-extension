import { HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';
import PageShell from '@extension/components/PageShell';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const ImportNewAccountPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const stepsLabels: string[] = [
    t<string>('headings.enterYourMnemonicSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  const handleNextClick = () => {
    nextStep();
  };
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= 0) {
      navigate(-1);

      return;
    }

    prevStep();
  };

  return (
    <PageShell>
      <PageHeader
        title={t<string>('titles.page', { context: 'importExistingAccount' })}
      />
      <VStack
        flexGrow={1}
        justifyContent="center"
        mb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={2}
        w="full"
      >
        <Steps
          activeStep={activeStep}
          colorScheme="primary"
          flexGrow={0}
          orientation="vertical"
          variant="circles"
        >
          {/* Enter mnemonic */}
          <Step label={stepsLabels[0]}>
            <VStack spacing={2} w="full">
              <Text color={subTextColor} size="md" textAlign="left">
                {t<string>('captions.enterMnemonicSeedPhrase')}
              </Text>
            </VStack>
          </Step>
          {/* Name account */}
          <Step label={stepsLabels[1]}>
            <VStack spacing={2} w="full">
              <Text color={subTextColor} size="md" textAlign="left">
                {t<string>('captions.nameYourAccount')}
              </Text>
            </VStack>
          </Step>
        </Steps>

        <Spacer />

        <HStack spacing={4} w="full">
          <Button
            colorScheme="primary"
            onClick={handlePreviousClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>
          <Button
            colorScheme="primary"
            onClick={handleNextClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {hasCompletedAllSteps
              ? t<string>('buttons.import')
              : t<string>('buttons.next')}
          </Button>
        </HStack>
      </VStack>
    </PageShell>
  );
};

export default ImportNewAccountPage;
