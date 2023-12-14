import {
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import IconButton from '@extension/components/IconButton';
import AddAssetArc200AssetItem from './AddAssetArc200AssetItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { clearAssets, queryByIdThunk } from '@extension/features/add-asset';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// selectors
import {
  useSelectAddAssetArc200Assets,
  useSelectAddAssetError,
  useSelectAddAssetFetching,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import { IAppThunkDispatch, IArc200Asset, INetwork } from '@extension/types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAssetModal: FC<IProps> = ({ isOpen, onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const error: BaseExtensionError | null = useSelectAddAssetError();
  const fetching: boolean = useSelectAddAssetFetching();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const arc200Assets: IArc200Asset[] = useSelectAddAssetArc200Assets();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  // state
  const [query, setQuery] = useState<string>('');
  // handlers
  const handleCancelClick = () => onClose();
  const handleClearQuery = () => {
    setQuery('');
    dispatch(clearAssets());
  };
  const handleKeyUp = () => {
    // if we have only numbers, we have an asset/app id
    if (new RegExp(/^\d+$/).test(query)) {
      dispatch(queryByIdThunk(query));

      return;
    }
  };
  const handleOnQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  // renders
  const renderContent = () => {
    return (
      <VStack flexGrow={1} spacing={DEFAULT_GAP / 2} w="full">
        <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
          {t<string>('captions.addAsset')}
        </Text>

        <InputGroup w="full">
          <Input
            colorScheme={primaryColorScheme}
            focusBorderColor={primaryColor}
            onChange={handleOnQueryChange}
            onKeyUp={handleKeyUp}
            size="md"
            type="text"
            value={query}
            w="full"
          />

          <InputRightElement>
            {fetching && (
              <Spinner
                thickness="1px"
                speed="0.65s"
                color={defaultTextColor}
                size="sm"
              />
            )}
            {!fetching && query.length > 0 && (
              <IconButton
                aria-label="Clear query"
                icon={IoCloseOutline}
                onClick={handleClearQuery}
                size="sm"
                variant="ghost"
              />
            )}
          </InputRightElement>
        </InputGroup>

        <VStack flexGrow={1} overflowY="scroll" spacing={0} w="full">
          {selectedNetwork &&
            arc200Assets.map((value, index) => (
              <AddAssetArc200AssetItem
                asset={value}
                key={`add-asset-modal-item-${index}`}
                network={selectedNetwork}
              />
            ))}
        </VStack>
      </VStack>
    );
  };
  const renderFooter = () => {
    return (
      <Button onClick={handleCancelClick} size="lg" variant="outline" w="full">
        {t<string>('buttons.cancel')}
      </Button>
    );
  };

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.OfflineError:
          dispatch(
            createNotification({
              ephemeral: true,
              title: t<string>('headings.offline'),
              type: 'error',
            })
          );
          break;
        default:
          dispatch(
            createNotification({
              description: `Please contact support with code "${error.code}" and describe what happened.`,
              ephemeral: true,
              title: t<string>('errors.titles.code'),
              type: 'error',
            })
          );
          break;
      }
    }
  }, [error]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.addAsset')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAssetModal;
