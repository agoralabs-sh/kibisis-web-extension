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
import React, { type FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useBorderColor from '../../hooks/useBorderColor';
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

// types
import type { INetwork } from '@extension/types';
import type { IAccountInformation } from '../../types';

// utils
import { parseConnectorType } from '../../utils';

interface IProps {
  enabledAccounts: IAccountInformation[];
  connectionType: ConnectionTypeEnum | null;
  network: INetwork | null;
}

const EnabledAccountsTable: FC<IProps> = ({
  enabledAccounts,
  connectionType,
  network,
}) => {
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <TableContainer
      borderColor={borderColor}
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
            <HStack spacing={DEFAULT_GAP / 3}>
              <Text as="b" color={defaultTextColor}>
                Network:
              </Text>

              <Text color={subTextColor}>{network?.genesisId || 'N/A'}</Text>
            </HStack>

            <HStack spacing={DEFAULT_GAP / 3}>
              <Text as="b" color={defaultTextColor}>
                Connection Type:
              </Text>

              <Text color={subTextColor}>
                {connectionType ? parseConnectorType(connectionType) : 'N/A'}
              </Text>
            </HStack>
          </VStack>
        </TableCaption>

        <Thead>
          <Tr>
            <Th>
              <Text color={defaultTextColor}>Address</Text>
            </Th>

            <Th>
              <Text color={defaultTextColor}>Name</Text>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {enabledAccounts.map((value, index) => (
            <Tr key={`enabled-account-item-${index}`}>
              <Td>
                <Text color={subTextColor}>{value.address}</Text>
              </Td>

              <Td>
                <Text color={subTextColor}>{value.name || '-'}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default EnabledAccountsTable;
