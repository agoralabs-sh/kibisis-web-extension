import {
  BaseError,
  IBaseResult,
  ISignBytesResult,
} from '@agoralabs-sh/algorand-provider';
import {
  Code,
  CreateToastFnReturn,
  HStack,
  TabPanel,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { verifyBytes } from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';

// Components
import Button from '../src/components/Button';

// Types
import { IWindow } from '../src/types';

interface IProps {
  address: string | null;
  toast: CreateToastFnReturn;
}

const SignDataTab: FC<IProps> = ({ address, toast }: IProps) => {
  const [dataToSign, setDataToSign] = useState<string | null>(null);
  const [signedData, setSignedData] = useState<string | null>(null);
  const handleClearClick = () => {
    setDataToSign('');
    setSignedData(null);
  };
  const handleSignDataClick = async () => {
    let decoder: TextDecoder;
    let encoder: TextEncoder;
    let result: IBaseResult & ISignBytesResult;

    if (!dataToSign || !address) {
      console.error('no data or address');

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
      encoder = new TextEncoder();
      result = await (window as IWindow).algorand.signBytes({
        data: encoder.encode(dataToSign),
        signer: address,
      });

      toast({
        description: `Successfully signed data for wallet "${result.id}".`,
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: 'Data Signed!',
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
  const handleTextareaOnChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setDataToSign(event.target.value);
  const handleVerifySignedData = () => {
    let encoder: TextEncoder;
    let verifiedResult: boolean;

    if (!dataToSign || !signedData || !address) {
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
      encoder.encode(dataToSign),
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

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        <Textarea
          onChange={handleTextareaOnChange}
          placeholder="Add data to be signed"
          value={dataToSign || ''}
        />
        <HStack spacing={2} w="full">
          <Text>Decoded signed data:</Text>
          {signedData && <Code fontSize="sm">{signedData}</Code>}
        </HStack>
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleSignDataClick}
            size="lg"
          >
            Sign Data
          </Button>
          <Button
            colorScheme="primary"
            isDisabled={!signedData}
            minW={250}
            onClick={handleVerifySignedData}
            size="lg"
          >
            Verify Signed Data
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
