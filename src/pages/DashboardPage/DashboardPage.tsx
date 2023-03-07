import { Heading } from '@chakra-ui/react';
import React, { FC } from 'react';

// Components
import PageShell from '../../components/PageShell';

const DashboardPage: FC = () => {
  return (
    <PageShell>
      <Heading color="gray.500">Agora Wallet - Dashboard</Heading>
    </PageShell>
  );
};

export default DashboardPage;
