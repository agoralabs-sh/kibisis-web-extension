import {
  Heading,
  HStack,
  Input,
  InputGroup,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Account, mnemonicToSecretKey } from 'algosdk';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import EnterMnemonicPhraseInput, {
  validate,
} from '@extension/components/EnterMnemonicPhraseInput';
import PageHeader from '@extension/components/PageHeader';
import Steps from '@extension/components/Steps';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type {
  IAddAccountPageProps,
  IAppThunkDispatch,
  IMainRootState,
  IRegistrationRootState,
} from '@extension/types';

const ImportAccountViaSeedPhrasePage: FC<IAddAccountPageProps> = ({
  onComplete,
  saving,
}) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch<IMainRootState | IRegistrationRootState> =
    useDispatch<IAppThunkDispatch<IMainRootState | IRegistrationRootState>>();
  const navigate: NavigateFunction = useNavigate();
  // selectors
  const logger: ILogger = useSelectLogger();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  // states
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<string[]>(
    Array.from({ length: 25 }, () => '')
  );
  // misc
  const stepsLabels: string[] = [
    t<string>('headings.enterYourSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  // handlers
  const handleImportClick = () => {
    const _functionName: string = 'handleImportClick';

    if (!account) {
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
      `${ImportAccountViaSeedPhrasePage.name}#${_functionName}: importing account "${account.addr}"`
    );

    onComplete({
      name: name !== account.addr ? name : null, //  if the address is the same as the name, ignore
      privateKey: account.sk,
    });
  };
  const handleOnMnemonicPhraseChange = (value: string[]) => setPhrases(value);
  const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handleNextClick = () => {
    let validateError: string | null;

    // if this is the first step, validate the mnemonic
    if (activeStep <= 0) {
      validateError = validate(phrases, t);

      setError(validateError);

      // if we have an error, deny the next step
      if (validateError) {
        return;
      }

      setAccount(mnemonicToSecretKey(phrases.join(' ')));
    }

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

  useEffect(() => {
    if (account && !name) {
      setName(account.addr);
    }
  }, [account]);

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
          {/*enter seed phrase inputs*/}
          <Step label={stepsLabels[0]}>
            <VStack alignItems="flex-start" p={1} spacing={2} w="full">
              <Text color={subTextColor} size="md" textAlign="left">
                {t<string>('captions.enterSeedPhrase')}
              </Text>

              <EnterMnemonicPhraseInput
                disabled={saving}
                error={error}
                onChange={handleOnMnemonicPhraseChange}
                phrases={phrases}
              />
            </VStack>
          </Step>

          {/*name account input*/}
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

        {/*confirm completed*/}
        {hasCompletedAllSteps && (
          <VStack alignItems="flex-start" spacing={2} w="full">
            <Heading color={defaultTextColor} fontSize="md" textAlign="left">
              {t<string>('headings.importAccountViaSeedPhraseComplete')}
            </Heading>

            <Text color={subTextColor} fontSize="md" textAlign="left">
              {t<string>('captions.importAccountViaSeedPhraseComplete')}
            </Text>
          </VStack>
        )}

        <Spacer />

        <HStack spacing={4} w="full">
          {/*previous button*/}
          <Button
            isDisabled={saving}
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
