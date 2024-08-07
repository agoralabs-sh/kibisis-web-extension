import { AvatarBadge, Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoEyeOutline, IoLockClosedOutline } from 'react-icons/io5';

// components
import AccountAvatar from '../AccountAvatar';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

const AccountAvatarWithBadges: FC<IProps> = ({
  account,
  accounts,
  network,
}) => {
  // misc
  const accountInformation = network
    ? AccountService.extractAccountInformationForNetwork(account, network)
    : null;
  const iconSize = calculateIconSize('xs');
  // renders
  const renderWatchAccountBadge = () => {
    const watchAccountBadge = (
      <AvatarBadge
        bg="blue.500"
        borderWidth={0}
        boxSize="1.25em"
        p={1}
        placement="top-end"
      >
        <Icon as={IoEyeOutline} color="white" h={iconSize} w={iconSize} />
      </AvatarBadge>
    );

    // if this is a re-keyed account
    if (accountInformation && accountInformation.authAddress) {
      // if no auth account is present, or the auth account is a watch account, show a watch badge
      if (
        !isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      ) {
        return watchAccountBadge;
      }

      return null;
    }

    if (account.watchAccount) {
      return watchAccountBadge;
    }

    return null;
  };

  return (
    <AccountAvatar>
      {/*watch badge*/}
      {renderWatchAccountBadge()}

      {/*re-key badge*/}
      {accountInformation && accountInformation.authAddress && (
        <AvatarBadge
          bg="orange.500"
          borderWidth={0}
          boxSize="1.25em"
          p={1}
          placement="bottom-end"
        >
          <Icon
            as={IoLockClosedOutline}
            color="white"
            h={iconSize}
            w={iconSize}
          />
        </AvatarBadge>
      )}
    </AccountAvatar>
  );
};

export default AccountAvatarWithBadges;
