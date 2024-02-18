import {
  Heading,
  Icon,
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, {
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoBanOutline,
} from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import QRCodeFrameIcon from './QRCodeFrameIcon';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  SUPPORT_MAIL_TO_LINK,
} from '@extension/constants';

// errors
import { BaseExtensionError, CameraError } from '@extension/errors';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectLogger } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';

interface IProps {
  onPreviousClick: () => void;
}

const ScanQRCodeModalCameraStreamContent: FC<IProps> = ({
  onPreviousClick,
}: IProps) => {
  const { t } = useTranslation();
  const videoRef: MutableRefObject<HTMLVideoElement | null> =
    useRef<HTMLVideoElement | null>(null);
  // selectors
  const logger: ILogger = useSelectLogger();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const subTextColor: string = useSubTextColor();
  // state
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notAllowed, setNotAllowed] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // misc
  const startStreaming = async () => {
    const _functionName: string = 'useEffect';
    let _stream: MediaStream;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        setError(null);
        setLoading(true);

        _stream = await navigator.mediaDevices.getUserMedia({
          video: {
            height: window.innerHeight,
            width: window.innerWidth,
          },
        });

        setStream(_stream);
      } catch (error) {
        logger.error(
          `${ScanQRCodeModalCameraStreamContent.name}#${_functionName}: `,
          error
        );

        // if the user denied access, inform the user
        if (
          (error as DOMException).name === 'NotAllowedError' ||
          (error as DOMException).name === 'SecurityError'
        ) {
          setNotAllowed(true);
          setLoading(false);

          return;
        }

        setError(new CameraError((error as DOMException).name, error.message));
      }

      setLoading(false);
    }
  };
  // handlers
  const handlePreviousClick = () => {
    // stop the camera stream
    if (stream) {
      stream.getTracks().forEach((value) => value.stop());
    }

    setError(null);
    setLoading(false);
    setStream(null);
    setNotAllowed(false);

    onPreviousClick();
  };
  // renders
  const renderBody = () => {
    if (stream) {
      return <QRCodeFrameIcon color="white" h="20rem" w="20rem" />;
    }

    // show a general error page
    if (error) {
      return (
        <>
          {/*icon*/}
          <Icon as={IoAlertCircleOutline} color="red.500" h={16} w={16} />

          {/*heading*/}
          <Heading color={defaultTextColor} textAlign="center">
            {t<string>('errors.titles.code', { context: error.code })}
          </Heading>

          {/*description*/}
          <Text color={subTextColor} fontSize="sm" textAlign="center">
            {t<string>('errors.descriptions.code', { context: error.code })}
          </Text>

          <Text color={subTextColor} fontSize="sm" textAlign="center">
            <Trans i18nKey="captions.support">
              Please{' '}
              <Link
                color="red.500"
                href={SUPPORT_MAIL_TO_LINK}
                isExternal={true}
              >
                contact us
              </Link>{' '}
              for further assistance so we can resolve this issue for you.
            </Trans>
          </Text>
        </>
      );
    }

    if (notAllowed) {
      return (
        <>
          {/*icon*/}
          <Icon as={IoBanOutline} color={defaultTextColor} h={16} w={16} />

          {/*captions*/}
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.cameraQRCodeScanNotAllowed1')}
          </Text>
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.cameraQRCodeScanNotAllowed2')}
          </Text>
        </>
      );
    }

    return (
      <>
        {/*loader*/}
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor={defaultTextColor}
          color={primaryColor}
          size="xl"
        />

        {/*caption*/}
        <Text color={defaultTextColor} fontSize="md" textAlign="center">
          {t<string>('captions.loadingCameraStream')}
        </Text>
      </>
    );
  };

  useEffect(() => {
    (async () => await startStreaming())();
  }, []);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
      position="relative"
    >
      {/*video element*/}
      <video
        autoPlay={true}
        ref={videoRef}
        style={{
          height: '100%',
          maxWidth: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          transform: 'rotateY(180deg)',
          zIndex: 0,
        }}
      />

      {/*header*/}
      {notAllowed && (
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.cameraDenied')}
          </Heading>
        </ModalHeader>
      )}
      {loading && (
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.cameraLoading')}
          </Heading>
        </ModalHeader>
      )}

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP} zIndex={1}>
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {renderBody()}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP} zIndex={1}>
        {/*previous button*/}
        <Button
          leftIcon={<IoArrowBackOutline />}
          onClick={handlePreviousClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.previous')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ScanQRCodeModalCameraStreamContent;
