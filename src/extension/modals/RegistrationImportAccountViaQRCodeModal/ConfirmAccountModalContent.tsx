import {
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { ARC0300QueryEnum, ErrorCodeEnum } from '@extension/enums';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useUpdateARC0200Assets from '@extension/hooks/useUpdateARC0200Assets';

// selectors
import {
  useSelectLogger,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAddAccountCompleteFunction,
  IAppThunkDispatch,
  IARC0300AccountImportSchema,
  INetwork,
} from '@extension/types';

// utils
import convertPrivateKeyToAddress from '@extension/utils/convertPrivateKeyToAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import decodePrivateKeyFromAccountImportSchema from '@extension/utils/decodePrivateKeyFromImportKeySchema';

interface IProps {
  onComplete: IAddAccountCompleteFunction;
  onPreviousClick: () => void;
  schema: IARC0300AccountImportSchema;
  saving: boolean;
}

const ConfirmAccountModalContent: FC<IProps> = ({
  onComplete,
  onPreviousClick,
  schema,
  saving,
}) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger: ILogger = useSelectLogger();
  const network: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const {
    assets,
    loading,
    reset: resetUpdateAssets,
  } = useUpdateARC0200Assets(schema.query[ARC0300QueryEnum.Asset]);
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // states
  const [address, setAddress] = useState<string | null>(null);
  // handlers
  const handlePreviousClick = () => {
    resetUpdateAssets();
    onPreviousClick();
  };
  const handleImportClick = async () => {
    const _functionName: string = 'handleImportClick';
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);

    if (!privateKey) {
      logger.debug(
        `${ConfirmAccountModalContent.name}#${_functionName}: failed to decode the private key`
      );

      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            context: ErrorCodeEnum.ParsingError,
            type: 'key',
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', {
            context: ErrorCodeEnum.ParsingError,
          }),
          type: 'error',
        })
      );

      return;
    }

    onComplete({
      arc0200Assets: assets,
      name: null,
      privateKey,
    });
  };

  useEffect(() => {
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);

    if (privateKey) {
      setAddress(convertPrivateKeyToAddress(privateKey));
    }
  }, []);

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.importAccount')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.importAccount')}
          </Text>

          <VStack spacing={2} w="full">
            <ModalSubHeading text={t<string>('labels.account')} />

            {/*address*/}
            {!address ? (
              <ModalSkeletonItem />
            ) : (
              <ModalTextItem
                label={`${t<string>('labels.address')}:`}
                tooltipLabel={address}
                value={ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              />
            )}
          </VStack>

          {/*assets*/}
          {loading && (
            <VStack spacing={2} w="full">
              <ModalSkeletonItem />
              <ModalSkeletonItem />
              <ModalSkeletonItem />
            </VStack>
          )}
          {assets.length > 0 && !loading && (
            <VStack spacing={2} w="full">
              <ModalSubHeading text={t<string>('labels.assets')} />

              {assets.map((value, index) => (
                <ModalItem
                  key={`account-import-add-asset-${index}`}
                  label={`${value.name}:`}
                  value={
                    <HStack spacing={2}>
                      {/*icon*/}
                      <AssetAvatar
                        asset={value}
                        fallbackIcon={
                          <AssetIcon
                            color={primaryButtonTextColor}
                            h={3}
                            w={3}
                            {...(network && {
                              networkTheme: network.chakraTheme,
                            })}
                          />
                        }
                        size="xs"
                      />

                      {/*symbol*/}
                      <Text color={subTextColor} fontSize="xs">
                        {value.symbol}
                      </Text>

                      {/*type*/}
                      <AssetBadge size="xs" type={value.type} />
                    </HStack>
                  }
                />
              ))}
            </VStack>
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
          <HStack spacing={DEFAULT_GAP - 2} w="full">
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

            {/*import button*/}
            <Button
              isLoading={loading || saving}
              onClick={handleImportClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.import')}
            </Button>
          </HStack>
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export default ConfirmAccountModalContent;
