import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
  Flex,
  Text,
  Select,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { MdVisibility } from 'react-icons/md';
import { getAllClients } from 'services/adminApi';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    fetchClients();
  }, [filter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getAllClients(filter);
      setClients(response.data.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clients',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge colorScheme={isActive ? 'green' : 'red'}>
        {isActive ? 'ACTIVE' : 'BLOCKED'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Flex justify="space-between" align="center" mb="20px">
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Clients Management
          </Text>
          <HStack spacing={4}>
            <Select
              placeholder="All Status"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              w="150px"
            >
              <option value="active">Active</option>
              <option value="inactive">Blocked</option>
            </Select>
          </HStack>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Name</Th>
                <Th borderColor={borderColor}>Email</Th>
                <Th borderColor={borderColor}>Phone</Th>
                <Th borderColor={borderColor}>Registered</Th>
                <Th borderColor={borderColor}>Status</Th>
                <Th borderColor={borderColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client) => (
                <Tr key={client.id}>
                  <Td borderColor={borderColor}>
                    {client.first_name} {client.last_name}
                  </Td>
                  <Td borderColor={borderColor}>{client.email}</Td>
                  <Td borderColor={borderColor}>{client.phone || 'N/A'}</Td>
                  <Td borderColor={borderColor}>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </Td>
                  <Td borderColor={borderColor}>
                    {getStatusBadge(client.is_active)}
                  </Td>
                  <Td borderColor={borderColor}>
                    <IconButton
                      icon={<MdVisibility />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => navigate(`/admin/clients/${client.id}`)}
                      aria-label="View Details"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {clients.length === 0 && (
            <Center py={10}>
              <Text color="gray.500">No clients found</Text>
            </Center>
          )}
        </Box>
      </Card>
    </Box>
  );
}
