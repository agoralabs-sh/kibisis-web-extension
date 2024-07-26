import {
  Code,
  Heading,
  HStack,
  Image,
  Link,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// components
import AssetBadge from '@extension/components/AssetBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';
import PageItem from '@extension/components/PageItem';

// constants
import { ACCOUNTS_ROUTE, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useNFTPage from './hooks/useNFTPage';

// images
import nftPlaceholderImage from '@extension/images/placeholder_nft.png';

// pages
import SkeletonAssetPage from '@extension/pages/SkeletonAssetPage';

// selectors
import {
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettingsPreferredNFTExplorer,
} from '@extension/selectors';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const NFTPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { appId, tokenId } = useParams();
  // selectors
  const blockExplorer = useSelectSettingsPreferredBlockExplorer();
  const nftExplorer = useSelectSettingsPreferredNFTExplorer();
  // hooks
  const { account, accountInformation, asset, assetHolding } = useNFTPage({
    appId: appId || null,
    tokenId: tokenId || null,
  });
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // handlers
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  // renders
  const renderImage = () => {
    let imageElement: ReactElement;

    if (!assetHolding) {
      return (
        <Skeleton>
          <Image
            alt="NFT image loading"
            borderRadius="md"
            boxSize="250px"
            objectFit="cover"
            src={nftPlaceholderImage}
          />
        </Skeleton>
      );
    }

    imageElement = (
      <Image
        alt="NFT image"
        borderRadius="md"
        boxSize="250px"
        objectFit="cover"
        src={assetHolding.metadata.image || nftPlaceholderImage}
      />
    );

    // if we have an nft explorer, wrap the nft in a link
    if (nftExplorer) {
      return (
        <Link
          href={`${nftExplorer.tokensURL({
            appID: assetHolding.id,
            tokenID: assetHolding.tokenId,
          })}`}
          isExternal={true}
        >
          {imageElement}
        </Link>
      );
    }

    return imageElement;
  };
  let accountAddress: string;

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!appId || !tokenId) {
      return reset();
    }
  }, []);

  if (!account || !accountInformation || !assetHolding) {
    return <SkeletonAssetPage />;
  }

  accountAddress = convertPublicKeyToAVMAddress(account.publicKey);

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
          {renderImage()}

          {/*name (or id)*/}
          {assetHolding.metadata.name ? (
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
          ) : (
            <Heading color={defaultTextColor} size="lg" textAlign="center">
              {`#${assetHolding.tokenId}`}
            </Heading>
          )}

          {/*description*/}
          {assetHolding.metadata.description && (
            <Tooltip
              aria-label="NFT description"
              label={assetHolding.metadata.description}
            >
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={250}
                noOfLines={4}
                textAlign="center"
              >
                {assetHolding.metadata.description}
              </Text>
            </Tooltip>
          )}

          {/*token id/total supply*/}
          <PageItem fontSize="sm" label={t<string>('labels.tokenId')}>
            <Text color={subTextColor} fontSize="sm">
              {asset
                ? `${assetHolding.tokenId}/${asset.totalSupply}`
                : assetHolding.tokenId}
            </Text>
          </PageItem>

          {/*application id*/}
          <PageItem fontSize="sm" label={t<string>('labels.applicationId')}>
            <HStack spacing={1}>
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
              {blockExplorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: blockExplorer.canonicalName,
                  })}
                  url={`${blockExplorer.baseUrl}${blockExplorer.applicationPath}/${assetHolding.id}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*type*/}
          <PageItem fontSize="sm" label={t<string>('labels.type')}>
            <AssetBadge type={assetHolding.type} />
          </PageItem>
        </VStack>
      </VStack>
    </>
  );
};

export default NFTPage;
