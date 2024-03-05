import {
  Code,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// components
import AssetBadge from '@extension/components/AssetBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import LoadingPage from '@extension/components/LoadingPage';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';

// constants
import { ACCOUNTS_ROUTE, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useNFTPage from './hooks/useNFTPage';

// selectors
import {
  useSelectARC0072AssetsFetching,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IBlockExplorer } from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const NFTPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { appId, tokenId } = useParams();
  // selectors
  const explorer: IBlockExplorer | null = useSelectPreferredBlockExplorer();
  const fetchingARC0072Assets: boolean = useSelectARC0072AssetsFetching();
  // hooks
  const { account, accountInformation, assetHolding } = useNFTPage({
    appId: appId || null,
    onError: () =>
      navigate(ACCOUNTS_ROUTE, {
        replace: true,
      }),
    tokenId: tokenId || null,
  });
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  let accountAddress: string;

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!appId || !tokenId) {
      return reset();
    }
  }, []);

  if (
    !account ||
    !accountInformation ||
    !assetHolding ||
    fetchingARC0072Assets
  ) {
    return <LoadingPage />;
  }

  accountAddress = AccountService.convertPublicKeyToAlgorandAddress(
    account.publicKey
  );

  return (
    <>
      <PageHeader
        subTitle={
          account.name
            ? ellipseAddress(accountAddress, { end: 10, start: 10 })
            : undefined
        }
        title={
          account.name || ellipseAddress(accountAddress, { end: 10, start: 10 })
        }
      />

      <VStack
        alignItems="center"
        justifyContent="flex-start"
        px={DEFAULT_GAP - 2}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        <VStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={DEFAULT_GAP / 3}
          w="full"
        >
          {/*image*/}
          {assetHolding.metadata.image ? (
            <Link href={assetHolding.metadata.image} isExternal={true}>
              <Image
                alt="NFT image"
                borderRadius="md"
                boxSize="250px"
                objectFit="cover"
                src={assetHolding.metadata.image}
              />
            </Link>
          ) : (
            <Image
              alt="Placeholder image"
              borderRadius="md"
              boxSize="250px"
              objectFit="cover"
              src=""
            />
          )}

          {/*token id/type*/}
          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={DEFAULT_GAP / 3}
            w="full"
          >
            {/*name*/}
            {assetHolding.metadata.name && (
              <Tooltip
                aria-label="Name of NFT"
                label={assetHolding.metadata.name}
              >
                <Heading
                  color={defaultTextColor}
                  maxW={250}
                  noOfLines={1}
                  size="lg"
                  textAlign="center"
                >
                  {assetHolding.metadata.name}
                </Heading>
              </Tooltip>
            )}

            {/*token id*/}
            <Text color={subTextColor} fontSize="md" textAlign="center">
              {`#${assetHolding.tokenId}`}
            </Text>
          </HStack>

          {/*app id/type*/}
          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={DEFAULT_GAP / 3}
            w="full"
          >
            {/*type*/}
            <AssetBadge type={assetHolding.type} />

            {/*app id*/}
            <HStack alignItems="center" justifyContent="center" spacing={0}>
              <Code
                borderRadius="md"
                color={defaultTextColor}
                fontSize="sm"
                wordBreak="break-word"
              >
                {assetHolding.id}
              </Code>

              {/*copy app id button*/}
              <CopyIconButton
                ariaLabel={t<string>('labels.copyApplicationId')}
                tooltipLabel={t<string>('labels.copyApplicationId')}
                value={assetHolding.id}
              />

              {/*open app on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.applicationPath}/${assetHolding.id}`}
                />
              )}
            </HStack>
          </HStack>

          {/*description*/}
          {assetHolding.metadata.description && (
            <Tooltip
              aria-label="NFT description"
              label={assetHolding.metadata.description}
            >
              <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                {assetHolding.metadata.description}
              </Text>
            </Tooltip>
          )}
        </VStack>
      </VStack>
    </>
  );
};

export default NFTPage;
