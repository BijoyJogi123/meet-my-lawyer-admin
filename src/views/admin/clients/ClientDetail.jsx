import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Badge,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
  SimpleGrid,
  Avatar,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdBlock, MdDelete } from 'react-icons/md';
import {
  getClientDetails,
  blockClient,
  deleteClient,
} from 'services/adminApi';
import Card from 'components/card/Card';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { isOpen: isBlockOpen, onOpen: onBlockOpen, onClose: onBlockClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await getClientDetails(id);
      setClientData(response.data.data);
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load client details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (isActive) => {
    try {
      setActionLoading(true);
      await blockClient(id, isActive);
      toast({
        title: 'Success',
        description: `Client ${isActive ? 'unblocked' : 'blocked'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onBlockClose();
      fetchClientData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update client status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteClient(id);
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      navigate('/admin/clients');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!clientData) {
    return (
      <Center h="400px">
        <Text>Client not found</Text>
      </Center>
    );
  }

  const { client, orders, payments, totalSpent } = clientData;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Button
        leftIcon={<MdArrowBack />}
        onClick={() => navigate('/admin/clients')}
        mb={4}
        variant="ghost"
      >
        Back to Clients
      </Button>

      {/* Client Info Card */}
      <Card mb={4}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <Avatar
            size="2xl"
            src={client.profile_image_url}
            name={`${client.first_name} ${client.last_name}`}
          />
          <VStack align="start" flex={1} spacing={3}>
            <Flex align="center" gap={3}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {client.first_name} {client.last_name}
              </Text>
              <Badge colorScheme={client.is_active ? 'green' : 'red'}>
                {client.is_active ? 'ACTIVE' : 'BLOCKED'}
              </Badge>
            </Flex>
            <Text color="gray.500">{client.email}</Text>
            <Text color="gray.500">{client.phone || 'No phone'}</Text>
            <Text color="gray.500">
              Registered: {new Date(client.createdAt).toLocaleDateString()}
            </Text>
            <HStack spacing={4} mt={4}>
              <Button
                colorScheme={client.is_active ? 'red' : 'green'}
                leftIcon={<MdBlock />}
                onClick={onBlockOpen}
              >
                {client.is_active ? 'Block' : 'Unblock'}
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                leftIcon={<MdDelete />}
                onClick={onDeleteOpen}
              >
                Delete
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Card>

      {/* Statistics */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={4}>
        <Card>
          <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>
            Total Orders
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="blue.500">
            {orders.length}
          </Text>
        </Card>
        <Card>
          <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>
            Total Spent
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="green.500">
            ₹{totalSpent.toFixed(2)}
          </Text>
        </Card>
        <Card>
          <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>
            Total Payments
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="purple.500">
            {payments.length}
          </Text>
        </Card>
      </SimpleGrid>

      {/* Order History */}
      <Card mb={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
          Order History
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Service</Th>
                <Th borderColor={borderColor}>Lawyer</Th>
                <Th borderColor={borderColor}>Amount</Th>
                <Th borderColor={borderColor}>Status</Th>
                <Th borderColor={borderColor}>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td borderColor={borderColor}>{order.service_title}</Td>
                  <Td borderColor={borderColor}>
                    {order.lawyer?.first_name} {order.lawyer?.last_name}
                  </Td>
                  <Td borderColor={borderColor}>₹{order.total_amount}</Td>
                  <Td borderColor={borderColor}>
                    <Badge>{order.status?.toUpperCase()}</Badge>
                  </Td>
                  <Td borderColor={borderColor}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {orders.length === 0 && (
            <Center py={6}>
              <Text color="gray.500">No orders found</Text>
            </Center>
          )}
        </Box>
      </Card>

      {/* Payment History */}
      <Card>
        <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
          Payment History
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Amount</Th>
                <Th borderColor={borderColor}>Status</Th>
                <Th borderColor={borderColor}>Payment ID</Th>
                <Th borderColor={borderColor}>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((payment) => (
                <Tr key={payment.id}>
                  <Td borderColor={borderColor}>₹{payment.amount}</Td>
                  <Td borderColor={borderColor}>
                    <Badge colorScheme={payment.payment_status === 'completed' ? 'green' : 'orange'}>
                      {payment.payment_status?.toUpperCase()}
                    </Badge>
                  </Td>
                  <Td borderColor={borderColor}>{payment.razorpay_payment_id || 'N/A'}</Td>
                  <Td borderColor={borderColor}>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {payments.length === 0 && (
            <Center py={6}>
              <Text color="gray.500">No payments found</Text>
            </Center>
          )}
        </Box>
      </Card>

      {/* Block Confirmation Dialog */}
      <AlertDialog
        isOpen={isBlockOpen}
        leastDestructiveRef={cancelRef}
        onClose={onBlockClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {client.is_active ? 'Block Client' : 'Unblock Client'}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to {client.is_active ? 'block' : 'unblock'} this client?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onBlockClose}>
                Cancel
              </Button>
              <Button
                colorScheme={client.is_active ? 'red' : 'green'}
                onClick={() => handleBlock(!client.is_active)}
                ml={3}
                isLoading={actionLoading}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Client
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this client? This action cannot be undone.
              All related data (orders, payments) will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={actionLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
