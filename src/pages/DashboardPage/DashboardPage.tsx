import { Heading } from '@chakra-ui/react';
import React, { FC } from 'react';

// Components
import PopupShell from '../../components/PopupShell';

const DashboardPage: FC = () => {
  return (
    <PopupShell>
      <Heading color="gray.500">Agora Wallet - Dashboard</Heading>
    </PopupShell>
  );
}

export default DashboardPage;
