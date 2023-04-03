import {
  BaseError,
  IBaseResult,
  ISignBytesResult,
} from '@agoralabs-sh/algorand-provider';
import {
  Code,
  CreateToastFnReturn,
  HStack,
  Icon,
  Select,
  TabPanel,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { verifyBytes } from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from 'react-icons/io5';
import { v4 as uuid } from 'uuid';

// Components
import Button from '../src/components/Button';

// Types
import { IWindow } from '../src/types';

// Utils
import encodeBase64Url from '../src/utils/encodeBase64Url';
import { isValidJwt } from './utils';

interface IProps {
  address: string | null;
  toast: CreateToastFnReturn;
}

const SignDataTab: FC<IProps> = ({ address, toast }: IProps) => {
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [signedData, setSignedData] = useState<string | null>(null);
  const handleClearClick = () => {
    setHeader('');
    setPayload('');
    setSignedData(null);
  };
  const handleSignJwtClick = (withSigner: boolean) => async () => {
    let decoder: TextDecoder;
    let encoder: TextEncoder;
    let result: IBaseResult & ISignBytesResult;
    let signature: string;

    if (
      !header ||
      !payload ||
      (withSigner && !address) ||
      !isValidJwt(header, payload)
    ) {
      console.error('no data/address or the jwt is invalid');

      return;
    }

    if (!(window as IWindow).algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet.',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'window.algorand Not Found!',
      });

      return;
    }

    try {
      signature = `${encodeBase64Url(
        JSON.parse(JSON.stringify(header))
      )}.${encodeBase64Url(JSON.parse(JSON.stringify(payload)))}`;
      encoder = new TextEncoder();
      result = await (window as IWindow).algorand.signBytes({
        data: encoder.encode(signature),
        ...(withSigner && {
          signer: address || undefined,
        }),
      });

      toast({
        description: `Successfully signed JWT for wallet "${result.id}".`,
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: 'JWT Signed!',
      });

      decoder = new TextDecoder();

      setSignedData(decoder.decode(result.signature));
    } catch (error) {
      toast({
        description: (error as BaseError).message,
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });
    }
  };
  const handleHeaderTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setHeader(event.target.value);
  const handlePayloadTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setPayload(event.target.value);
  const handleVerifySignedJWT = () => {
    let encoder: TextEncoder;
    let verifiedResult: boolean;

    if (!header || !payload || !signedData || !address) {
      toast({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'No Data To Verify!',
      });

      return;
    }

    encoder = new TextEncoder();
    verifiedResult = verifyBytes(
      encoder.encode(''),
      encoder.encode(signedData),
      address
    ); // verify using the algosdk

    if (!verifiedResult) {
      toast({
        description: 'The signed data failed verification',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'Signed Data is Invalid!',
      });

      return;
    }

    toast({
      description: 'The signed data has been verified.',
      duration: 3000,
      isClosable: true,
      status: 'success',
      title: 'Signed Data is Valid!',
    });
  };
  const handleUseJwtPreset = () => {
    const now: number = new Date().getTime(); // now in milliseconds

    setHeader(`{
  "alg": "EdDSA",
  "crv": "Ed25519",
  "typ": "JWT"
}`);
    setPayload(`{
  "aud": "${window.location.protocol}//${window.location.host}",
  "exp": ${now + 300000},
  "iat": ${now},
  "iss": "did:algo:${address}",
  "jti": "${uuid()}",
  "gty": "did",
  "sub": "${address}"
}`);
  };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/* Header */}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text>Header:</Text>
          <Textarea
            onChange={handleHeaderTextareaChange}
            placeholder={`A valid JWT header, e.g.:
{
  "alg": "EdDSA",
  "crv": "Ed25519",
  "typ": "JWT"
}
            `}
            rows={5}
            value={header || ''}
          />
          <HStack spacing={2} w="full">
            <Text>Encoded:</Text>
            {header && (
              <Code wordBreak="break-word">{encodeBase64Url(header)}</Code>
            )}
          </HStack>
        </VStack>
        {/* Payload */}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text>Payload:</Text>
          <Textarea
            onChange={handlePayloadTextareaChange}
            placeholder={`A valid JWT payload, e.g.:
{
  "aud": "https://exmaple.com",
  "exp": 109282718234,
  ...
}
            `}
            rows={9}
            value={payload || ''}
          />
          <HStack spacing={2} w="full">
            <Text>Encoded:</Text>
            {payload && (
              <Code wordBreak="break-word">{encodeBase64Url(payload)}</Code>
            )}
          </HStack>
        </VStack>
        {/* Valid */}
        <HStack spacing={2}>
          <Text>Is JWT Valid:</Text>
          {isValidJwt(header, payload) ? (
            <Icon as={IoCheckmarkCircleSharp} color="green.500" size="md" />
          ) : (
            <Icon as={IoCloseCircleSharp} color="red.500" size="md" />
          )}
        </HStack>
        {/* CTAs */}
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleUseJwtPreset}
            size="lg"
          >
            Use JWT Preset
          </Button>
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleSignJwtClick(true)}
            size="lg"
          >
            Sign JWT
          </Button>
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleSignJwtClick(false)}
            size="lg"
          >
            Sign JWT Without Signer
          </Button>
          <Button
            colorScheme="primary"
            isDisabled={!signedData}
            minW={250}
            onClick={handleVerifySignedJWT}
            size="lg"
          >
            Verify Signed JWT
          </Button>
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleClearClick}
            size="lg"
            variant="outline"
          >
            Clear
          </Button>
        </VStack>
      </VStack>
    </TabPanel>
  );
};

export default SignDataTab;
