import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
  Grid,
  HStack,
  TabPanel,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { decode as decodeBase64 } from '@stablelib/base64';
import React, { ChangeEvent, FC, useState } from 'react';
import { sign } from 'tweetnacl';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import type { ISignMessageActionResult } from '../../types';
import type { IProps } from './types';

const SignMessageTab: FC<IProps> = ({ account, signMessageAction }) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // states
  const [message, setMessage] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [signer, setSigner] = useState<string | null>(null);
  // handlers
  const handleClearClick = () => {
    setMessage(null);
    setSignature(null);
    setSigner(null);
  };
  const handleSignMessageClick = (withSigner: boolean) => async () => {
    let result: ISignMessageActionResult;

    if (!account) {
      toast({
        description: 'You must first enable the dApp with the wallet.',
        status: 'error',
        title: 'No Account Not Found!',
      });

      return;
    }

    if (!message) {
      toast({
        description: 'You must first enter some input to sign.',
        status: 'error',
        title: 'No Message To Sign!',
      });

      return;
    }

    try {
      result = await signMessageAction(
        message,
        withSigner && account?.address ? account.address : undefined
      );

      toast({
        description: `Successfully signed message with signer "${result.signer}".`,
        status: 'success',
        title: 'Message Signed!',
      });

      setSignature(result.signature);
      setSigner(result.signer);
    } catch (error) {
      toast({
        description: (error as BaseARC0027Error).message,
        status: 'error',
        title: `${(error as BaseARC0027Error).code}: ${
          (error as BaseARC0027Error).name
        }`,
      });
    }
  };
  const handleTextareaOnChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(event.target.value);
  const handleVerifySignature = () => {
    let verified: boolean;

    if (!message || !signature || !signer) {
      toast({
        status: 'error',
        title: 'No Signature To Verify!',
      });

      return;
    }

    verified = sign.detached.verify(
      new TextEncoder().encode(message),
      decodeBase64(signature),
      AccountService.decodePublicKey(
        AccountService.convertAlgorandAddressToPublicKey(signer)
      )
    );

    if (!verified) {
      toast({
        description: 'The signed message failed verification',
        status: 'error',
        title: 'Signed Message is Invalid!',
      });

      return;
    }

    toast({
      description: 'The signed message has been verified.',
      status: 'success',
      title: 'Signed Message is Valid!',
    });
  };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        <Textarea
          onChange={handleTextareaOnChange}
          placeholder="Add message to be signed"
          value={message || ''}
        />

        {/*encoded data*/}
        <HStack spacing={2} w="full">
          <Text>Encoded signed data (hex):</Text>
          {signature && (
            <Code fontSize="sm" wordBreak="break-word">
              {signature}
            </Code>
          )}
        </HStack>

        {/*ctas*/}
        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignMessageClick(true)}
            size="lg"
          >
            Sign Message
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignMessageClick(false)}
            size="lg"
          >
            Sign Message Without Signer
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            isDisabled={!signature}
            minW={250}
            onClick={handleVerifySignature}
            size="lg"
          >
            Verify Signature
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleClearClick}
            size="lg"
            variant="outline"
          >
            Clear
          </Button>
        </Grid>
      </VStack>
    </TabPanel>
  );
};

export default SignMessageTab;
