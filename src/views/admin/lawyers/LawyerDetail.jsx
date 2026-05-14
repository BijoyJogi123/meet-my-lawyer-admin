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
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdBlock, MdCheckCircle, MdDelete } from 'react-icons/md';
import {
  getLawyerDetails,
  getLawyerOrders,
  getLawyerEarnings,
  verifyLawyer,
  blockLawyer,
  deleteLawyer,
} from 'services/adminApi';
import Card from 'components/card/Card';

export default function LawyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [lawyer, setLawyer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState('');

  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  const { isOpen: isBlockOpen, onOpen: onBlockOpen, onClose: onBlockClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [actionType, setActionType] = useState('');
  const cancelRef = React.useRef();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchLawyerData();
  }, [id]);

  const fetchLawyerData = async () => {
    try {
      setLoading(true);
      const [lawyerRes, ordersRes, earningsRes] = await Promise.all([
        getLawyerDetails(id),
        getLawyerOrders(id),
        getLawyerEarnings(id),
      ]);
      setLawyer(lawyerRes.data.data);
      setOrders(ordersRes.data.data);
      setEarnings(earningsRes.data.data);
    } catch (error) {
      console.error('Error fetching lawyer data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lawyer details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    try {
      setActionLoading(true);
      await verifyLawyer(id, status, reason);
      toast({
        title: 'Success',
        description: `Lawyer ${status} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onVerifyClose();
      fetchLawyerData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
      setReason('');
    }
  };

  const handleBlock = async (isActive) => {
    try {
      setActionLoading(true);
      await blockLawyer(id, isActive, reason);
      toast({
        title: 'Success',
        description: `Lawyer ${isActive ? 'unblocked' : 'blocked'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onBlockClose();
      fetchLawyerData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lawyer status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
      setReason('');
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteLawyer(id);
      toast({
        title: 'Success',
        description: 'Lawyer deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      navigate('/admin/lawyers');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete lawyer',
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

  if (!lawyer) {
    return (
      <Center h="400px">
        <Text>Lawyer not found</Text>
      </Center>
    );
  }

  const profile = lawyer.lawyerProfile;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Button
        leftIcon={<MdArrowBack />}
        onClick={() => navigate('/admin/lawyers')}
        mb={4}
        variant="ghost"
      >
        Back to Lawyers
      </Button>

      {/* Lawyer Info Card */}
      <Card mb={4}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <Avatar
            size="2xl"
            src={lawyer.profile_image_url}
            name={`${lawyer.first_name} ${lawyer.last_name}`}
          />
          <VStack align="start" flex={1} spacing={3}>
            <Flex align="center" gap={3}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {lawyer.first_name} {lawyer.last_name}
              </Text>
              <Badge colorScheme={lawyer.is_active ? 'green' : 'red'}>
                {lawyer.is_active ? 'ACTIVE' : 'BLOCKED'}
              </Badge>
              <Badge
                colorScheme={
                  profile?.verification_status === 'verified'
                    ? 'green'
                    : profile?.verification_status === 'pending'
                    ? 'orange'
                    : 'red'
                }
              >
                {profile?.verification_status?.toUpperCase()}
              </Badge>
            </Flex>
            <Text color="gray.500">{lawyer.email}</Text>
            <Text color="gray.500">{lawyer.phone}</Text>
            <HStack spacing={4} mt={4}>
              <Button
                colorScheme="purple"
                leftIcon={<MdCheckCircle />}
                onClick={() => navigate(`/admin/lawyers/${id}/documents`)}
              >
                Verify Documents
              </Button>
              {profile?.verification_status === 'pending' && (
                <>
                  <Button
                    colorScheme="green"
                    leftIcon={<MdCheckCircle />}
                    onClick={() => {
                      setActionType('verify');
                      onVerifyOpen();
                    }}
                  >
                    Verify
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      setActionType('reject');
                      onVerifyOpen();
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button
                colorScheme={lawyer.is_active ? 'red' : 'green'}
                leftIcon={<MdBlock />}
                onClick={onBlockOpen}
              >
                {lawyer.is_active ? 'Block' : 'Unblock'}
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

      {/* Professional Details */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={4}>
        <Card>
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
            Professional Details
          </Text>
          <VStack align="start" spacing={2}>
            <Text><strong>Bar Council Number:</strong> {profile?.bar_council_number || 'N/A'}</Text>
            <Text><strong>Experience:</strong> {profile?.years_of_experience || 0} years</Text>
            <Text><strong>Specializations:</strong> {profile?.specializations?.join(', ') || 'N/A'}</Text>
            <Text><strong>Languages:</strong> {profile?.languages?.join(', ') || 'N/A'}</Text>
            <Text><strong>City:</strong> {profile?.city || 'N/A'}</Text>
            <Text><strong>State:</strong> {profile?.state || 'N/A'}</Text>
            <Text><strong>Hourly Rate:</strong> ₹{profile?.hourly_rate || 0}</Text>
          </VStack>
        </Card>

        <Card>
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
            Statistics
          </Text>
          <VStack align="start" spacing={2}>
            <Text><strong>Total Orders:</strong> {profile?.total_orders || 0}</Text>
            <Text><strong>Completed Orders:</strong> {profile?.completed_orders || 0}</Text>
            <Text><strong>Average Rating:</strong> {profile?.average_rating || 0} / 5</Text>
            <Text><strong>Total Reviews:</strong> {profile?.total_reviews || 0}</Text>
            <Text><strong>Total Earnings:</strong> ₹{earnings?.totalEarnings?.toFixed(2) || '0.00'}</Text>
            <Text><strong>Platform Commission:</strong> ₹{earnings?.platformCommission?.toFixed(2) || '0.00'}</Text>
          </VStack>
        </Card>
      </SimpleGrid>

      {/* Bank Account Details */}
      {lawyer.payoutAccount && (
        <Card mb={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
            Bank Account Details
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Text><strong>Account Holder:</strong> {lawyer.payoutAccount.account_holder_name}</Text>
            <Text><strong>Account Number:</strong> {lawyer.payoutAccount.account_number}</Text>
            <Text><strong>IFSC Code:</strong> {lawyer.payoutAccount.ifsc_code}</Text>
            <Text><strong>Bank Name:</strong> {lawyer.payoutAccount.bank_name}</Text>
            <Text>
              <strong>Verification Status:</strong>{' '}
              <Badge colorScheme={lawyer.payoutAccount.is_verified ? 'green' : 'orange'}>
                {lawyer.payoutAccount.verification_status?.toUpperCase()}
              </Badge>
            </Text>
          </SimpleGrid>
        </Card>
      )}

      {/* Order History */}
      <Card>
        <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
          Order History
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Service</Th>
                <Th borderColor={borderColor}>Client</Th>
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
                    {order.client?.first_name} {order.client?.last_name}
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

      {/* Verification Modal */}
      <Modal isOpen={isVerifyOpen} onClose={onVerifyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType === 'verify' ? 'Verify Lawyer' : 'Reject Lawyer'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Reason (optional):</Text>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onVerifyClose}>
              Cancel
            </Button>
            <Button
              colorScheme={actionType === 'verify' ? 'green' : 'red'}
              onClick={() => handleVerify(actionType === 'verify' ? 'verified' : 'rejected')}
              isLoading={actionLoading}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Block Modal */}
      <Modal isOpen={isBlockOpen} onClose={onBlockClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {lawyer.is_active ? 'Block Lawyer' : 'Unblock Lawyer'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Reason (optional):</Text>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBlockClose}>
              Cancel
            </Button>
            <Button
              colorScheme={lawyer.is_active ? 'red' : 'green'}
              onClick={() => handleBlock(!lawyer.is_active)}
              isLoading={actionLoading}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Lawyer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this lawyer? This action cannot be undone.
              All related data (profile, services, orders) will be permanently deleted.
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
