import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  HStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// enums
import { ConnectionTypeEnum } from '../../enums';

// types
import { INetwork } from '@extension/types';
import { IAccountInformation } from '../../types';

interface IProps {
  enabledAccounts: IAccountInformation[];
  connectionType: ConnectionTypeEnum | null;
  network: INetwork | null;
}

const EnabledAccountsTable: FC<IProps> = ({
  enabledAccounts,
  connectionType,
  network,
}: IProps) => {
  return (
    <TableContainer
      borderColor="gray.200"
      borderRadius="md"
      borderStyle="solid"
      borderWidth={1}
      w="full"
    >
      <Table variant="simple">
        <TableCaption>
          <VStack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            w="full"
          >
            <HStack spacing={2}>
              <Text as="b">Network:</Text>

              <Text>{network?.genesisId || 'N/A'}</Text>
            </HStack>

            <HStack spacing={2}>
              <Text as="b">Connection Type:</Text>

              <Text>{connectionType || 'N/A'}</Text>
            </HStack>
          </VStack>
        </TableCaption>

        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th>Name</Th>
          </Tr>
        </Thead>

        <Tbody>
          {enabledAccounts.map((value, index) => (
            <Tr key={`enabled-account-item-${index}`}>
              <Td>
                <Text>{value.address}</Text>
              </Td>

              <Td>
                <Text>{value.name || '-'}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default EnabledAccountsTable;
