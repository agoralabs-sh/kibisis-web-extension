import { Badge } from '@chakra-ui/react';
import { ThemeTypings } from '@chakra-ui/styled-system';
import React, { FC } from 'react';

interface IProps {
  genesisHash: string;
}

const NetworkBadge: FC<IProps> = ({ genesisHash }: IProps) => {
  let color: ThemeTypings['colorSchemes'] = 'blackAlpha';
  let name: string = 'unknown';

  switch (genesisHash) {
    case 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=':
      color = 'green';
      name = 'mainnet';

      break;
    case 'mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0=':
      color = 'blue';
      name = 'betanet';

      break;
    case 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=':
      color = 'orange';
      name = 'testnet';

      break;
    default:
      break;
  }

  return (
    <Badge borderRadius={15} colorScheme={color} variant="subtle">
      {name}
    </Badge>
  );
};

export default NetworkBadge;
