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
import { MdVisibility, MdBlock, MdCheckCircle, MdDescription } from 'react-icons/md';
import { getAllLawyers } from 'services/adminApi';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';

export default function LawyersList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', verification: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    fetchLawyers();
  }, [filter]);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const response = await getAllLawyers(filter);
      setLawyers(response.data.data);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lawyers',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = (status) => {
    const colors = {
      pending: 'orange',
      verified: 'green',
      rejected: 'red',
      in_review: 'blue',
    };
    return (
      <Badge colorScheme={colors[status] || 'gray'}>
        {status?.toUpperCase()}
      </Badge>
    );
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
            Lawyers Management
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
            <Select
              placeholder="All Verification"
              value={filter.verification}
              onChange={(e) => setFilter({ ...filter, verification: e.target.value })}
              w="180px"
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
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
                <Th borderColor={borderColor}>Specialization</Th>
                <Th borderColor={borderColor}>Experience</Th>
                <Th borderColor={borderColor}>Verification</Th>
                <Th borderColor={borderColor}>Status</Th>
                <Th borderColor={borderColor}>Total Orders</Th>
                <Th borderColor={borderColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lawyers.map((lawyer) => (
                <Tr key={lawyer.id}>
                  <Td borderColor={borderColor}>
                    {lawyer.first_name} {lawyer.last_name}
                  </Td>
                  <Td borderColor={borderColor}>{lawyer.email}</Td>
                  <Td borderColor={borderColor}>{lawyer.phone || 'N/A'}</Td>
                  <Td borderColor={borderColor}>
                    {lawyer.lawyerProfile?.specializations?.[0] || 'N/A'}
                  </Td>
                  <Td borderColor={borderColor}>
                    {lawyer.lawyerProfile?.years_of_experience || 0} years
                  </Td>
                  <Td borderColor={borderColor}>
                    {getVerificationBadge(lawyer.lawyerProfile?.verification_status)}
                  </Td>
                  <Td borderColor={borderColor}>
                    {getStatusBadge(lawyer.is_active)}
                  </Td>
                  <Td borderColor={borderColor}>
                    {lawyer.lawyerProfile?.total_orders || 0}
                  </Td>
                  <Td borderColor={borderColor}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<MdVisibility />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigate(`/admin/lawyers/${lawyer.id}`)}
                        aria-label="View Details"
                        title="View Details"
                      />
                      <IconButton
                        icon={<MdDescription />}
                        size="sm"
                        colorScheme="purple"
                        onClick={() => navigate(`/admin/lawyers/${lawyer.id}/documents`)}
                        aria-label="Verify Documents"
                        title="Verify Documents"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {lawyers.length === 0 && (
            <Center py={10}>
              <Text color="gray.500">No lawyers found</Text>
            </Center>
          )}
        </Box>
      </Card>
    </Box>
  );
}
