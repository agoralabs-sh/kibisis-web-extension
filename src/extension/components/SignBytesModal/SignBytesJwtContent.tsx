import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAccount, IDecodedJwt } from '@extension/types';

interface IProps {
  decodedJwt: IDecodedJwt;
  host: string;
  signer: IAccount | null;
}

const SignBytesJwtContent: FC<IProps> = ({
  decodedJwt,
  host,
  signer,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();

  return (
    <VStack spacing={2} w="full">
      <Text textAlign="left" w="full">{`${t<string>(
        'labels.information'
      )}:`}</Text>
      {/* Address/sub */}
      {decodedJwt.payload.subject && (
        <HStack spacing={2} w="full">
          <Text fontSize="xs">{`${t<string>('labels.address')}:`}</Text>
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs" wordBreak="break-word">
              {decodedJwt.payload.subject}
            </Text>
          </Box>
          {decodedJwt.payload.subject !== signer?.address && (
            <Tooltip
              aria-label="Address does not match the signer"
              label={t<string>('captions.addressDoesNotMatch')}
            >
              <span
                style={{
                  height: '1em',
                  lineHeight: '1em',
                }}
              >
                <Icon as={IoWarningOutline} color="yellow.500" />
              </span>
            </Tooltip>
          )}
        </HStack>
      )}
      {/* Audience/aud */}
      {decodedJwt.payload.audience && (
        <HStack spacing={2} w="full">
          <Text fontSize="xs">{`${t<string>('labels.audience')}:`}</Text>
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs" wordBreak="break-word">
              {decodedJwt.payload.audience}
            </Text>
          </Box>
          {decodedJwt.payload.audience !== host && (
            <Tooltip
              aria-label="Audience does not match the host"
              label={t<string>('captions.audienceDoesNotMatch')}
            >
              <span
                style={{
                  height: '1em',
                  lineHeight: '1em',
                }}
              >
                <Icon as={IoWarningOutline} color="yellow.500" />
              </span>
            </Tooltip>
          )}
        </HStack>
      )}
      {/* Expiration date/exp */}
      <HStack spacing={2} w="full">
        <Text fontSize="xs">{`${t<string>('labels.expirationDate')}:`}</Text>
        <Box
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={2}
          py={1}
        >
          <Text color={defaultTextColor} fontSize="xs" wordBreak="break-word">
            {decodedJwt.payload.expiresAt.toLocaleString()}
          </Text>
        </Box>
        {decodedJwt.payload.expiresAt < new Date() && (
          <Tooltip
            aria-label="Expiriation date is in the past"
            label={t<string>('captions.securityTokenExpired')}
          >
            <span
              style={{
                height: '1em',
                lineHeight: '1em',
              }}
            >
              <Icon as={IoWarningOutline} color="yellow.500" />
            </span>
          </Tooltip>
        )}
      </HStack>
      {/* More information */}
      <Accordion allowToggle={true} w="full">
        <AccordionItem border="none" w="full">
          <AccordionButton px={0}>
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.moreInformation'
            )}:`}</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0}>
            <VStack spacing={2} w="full">
              {/* ID/jti */}
              {decodedJwt.payload.id && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>('labels.id')}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.payload.id}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Issuer/iss */}
              {decodedJwt.payload.issuer && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>('labels.issuer')}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.payload.issuer}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Issue date/iat */}
              {decodedJwt.payload.issuedAt && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>(
                    'labels.issueDate'
                  )}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.payload.issuedAt.toLocaleString()}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Signing method/alg */}
              {decodedJwt.header.algorithm && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>(
                    'labels.signingMethod'
                  )}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.header.algorithm}
                    </Text>
                  </Box>
                  {decodedJwt.header.curve && (
                    <Box
                      borderColor="blue.500"
                      borderRadius={theme.radii['3xl']}
                      borderStyle="solid"
                      borderWidth="1px"
                      px={2}
                      py={1}
                    >
                      <Text
                        color="blue.500"
                        fontSize="xs"
                        wordBreak="break-word"
                      >
                        {decodedJwt.header.curve}
                      </Text>
                    </Box>
                  )}
                  {decodedJwt.header.algorithm !== 'EdDSA' && (
                    <Tooltip
                      aria-label="Invalid signing algorithm"
                      label={t<string>('captions.invalidAlgorithm')}
                    >
                      <span
                        style={{
                          height: '1em',
                          lineHeight: '1em',
                        }}
                      >
                        <Icon as={IoWarningOutline} color="yellow.500" />
                      </span>
                    </Tooltip>
                  )}
                </HStack>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default SignBytesJwtContent;
