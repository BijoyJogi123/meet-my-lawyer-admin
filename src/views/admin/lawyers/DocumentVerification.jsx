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
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheckCircle, MdCancel, MdVisibility } from 'react-icons/md';
import { getLawyerDocuments, verifyDocument } from 'services/adminApi';
import Card from 'components/card/Card';

export default function DocumentVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationLevel, setVerificationLevel] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    console.log('📄 [DocumentVerification] Component mounted with lawyer ID:', id);
    fetchDocuments();
  }, [id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getLawyerDocuments(id);
      setDocuments(response.data.data.documents);
      setVerificationLevel(response.data.data.verification_level);
      setVerificationStatus(response.data.data.verification_status);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    onViewOpen();
  };

  const handleVerifyDocument = async (documentId) => {
    try {
      setActionLoading(true);
      await verifyDocument(documentId, 'verified', null);
      toast({
        title: 'Success',
        description: 'Document verified successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchDocuments();
      onViewClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDocument = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setActionLoading(true);
      await verifyDocument(selectedDocument.id, 'rejected', rejectionReason);
      toast({
        title: 'Success',
        description: 'Document rejected',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setRejectionReason('');
      fetchDocuments();
      onRejectClose();
      onViewClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'orange',
      verified: 'green',
      rejected: 'red',
    };
    return (
      <Badge colorScheme={colors[status] || 'gray'} fontSize="sm">
        {status?.toUpperCase()}
      </Badge>
    );
  };

  const getDocumentTitle = (type) => {
    const titles = {
      llb_degree: 'LLB Degree Certificate',
      marksheets: 'Academic Marksheets',
      bar_council_cert: 'Bar Council Certificate',
      aibe_cert: 'AIBE Certificate',
      identity_proof: 'Identity Proof',
      address_proof: 'Address Proof',
      character_cert: 'Character Certificate',
      practice_cert: 'Practice Certificate',
      additional_cert: 'Additional Certificate',
    };
    return titles[type] || type;
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
          <HStack spacing={4}>
            <IconButton
              icon={<MdArrowBack />}
              onClick={() => navigate('/admin/lawyers')}
              variant="ghost"
              aria-label="Go back"
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Document Verification
              </Text>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.500">
                  Verification Level: {verificationLevel?.toUpperCase()}
                </Text>
                <Text fontSize="sm" color="gray.500">•</Text>
                <Text fontSize="sm" color="gray.500">
                  Status: {getStatusBadge(verificationStatus)}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Flex>

        <Divider mb="20px" />

        {documents.length === 0 ? (
          <Center h="200px">
            <VStack spacing={3}>
              <Text fontSize="lg" color="gray.500">
                No documents uploaded yet
              </Text>
              <Text fontSize="sm" color="gray.400">
                Lawyer hasn't submitted any verification documents
              </Text>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {documents.map((doc) => (
              <Card key={doc.id} bg={cardBg} p={5}>
                <VStack align="stretch" spacing={3}>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="md" fontWeight="bold" color={textColor}>
                        {getDocumentTitle(doc.document_type)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                      </Text>
                    </VStack>
                    {getStatusBadge(doc.verification_status)}
                  </Flex>

                  {doc.document_number && (
                    <Text fontSize="sm" color="gray.600">
                      Doc #: {doc.document_number}
                    </Text>
                  )}

                  {doc.issuing_authority && (
                    <Text fontSize="sm" color="gray.600">
                      Issued by: {doc.issuing_authority}
                    </Text>
                  )}

                  {doc.rejection_reason && (
                    <Box bg="red.50" p={2} borderRadius="md">
                      <Text fontSize="xs" color="red.600">
                        Rejection Reason: {doc.rejection_reason}
                      </Text>
                    </Box>
                  )}

                  <HStack spacing={2} mt={2}>
                    <Button
                      size="sm"
                      leftIcon={<MdVisibility />}
                      onClick={() => handleViewDocument(doc)}
                      colorScheme="blue"
                      variant="outline"
                      flex={1}
                    >
                      View
                    </Button>
                    {doc.verification_status === 'pending' && (
                      <>
                        <IconButton
                          size="sm"
                          icon={<MdCheckCircle />}
                          onClick={() => handleVerifyDocument(doc.id)}
                          colorScheme="green"
                          aria-label="Verify"
                          isLoading={actionLoading}
                        />
                        <IconButton
                          size="sm"
                          icon={<MdCancel />}
                          onClick={() => {
                            setSelectedDocument(doc);
                            onRejectOpen();
                          }}
                          colorScheme="red"
                          aria-label="Reject"
                        />
                      </>
                    )}
                  </HStack>
                </VStack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Card>

      {/* View Document Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>{getDocumentTitle(selectedDocument?.document_type)}</Text>
              {getStatusBadge(selectedDocument?.verification_status)}
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDocument && (
              <VStack align="stretch" spacing={4}>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Document Number</Text>
                    <Text fontSize="md" fontWeight="medium">{selectedDocument.document_number || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Issuing Authority</Text>
                    <Text fontSize="md" fontWeight="medium">{selectedDocument.issuing_authority || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Issue Date</Text>
                    <Text fontSize="md" fontWeight="medium">
                      {selectedDocument.issue_date ? new Date(selectedDocument.issue_date).toLocaleDateString() : 'N/A'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Expiry Date</Text>
                    <Text fontSize="md" fontWeight="medium">
                      {selectedDocument.expiry_date ? new Date(selectedDocument.expiry_date).toLocaleDateString() : 'N/A'}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.500" mb={2}>Document Preview</Text>
                  <Box
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius="md"
                    p={4}
                    bg={cardBg}
                    minH="400px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="auto"
                  >
                    {selectedDocument.document_url?.includes('mock-storage') ? (
                      <VStack spacing={3}>
                        <Text color="gray.500">Mock Document (Development Mode)</Text>
                        <Text fontSize="sm" color="gray.400">{selectedDocument.document_url}</Text>
                      </VStack>
                    ) : selectedDocument.file_type?.includes('image') || selectedDocument.document_url?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                      <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
                        <img
                          src={`http://localhost:3000${selectedDocument.document_url}`}
                          alt={getDocumentTitle(selectedDocument.document_type)}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '600px',
                            objectFit: 'contain',
                            width: 'auto',
                            height: 'auto'
                          }}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('❌ Image load error');
                            console.error('   URL:', selectedDocument.document_url);
                            console.error('   Full URL:', `http://localhost:3000${selectedDocument.document_url}`);
                            console.error('   File type:', selectedDocument.file_type);
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EFailed to load image%3C/text%3E%3C/svg%3E';
                          }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully:', selectedDocument.document_url);
                          }}
                        />
                      </Box>
                    ) : (
                      <iframe
                        src={`http://localhost:3000${selectedDocument.document_url}`}
                        width="100%"
                        height="500px"
                        title="Document Preview"
                        style={{ border: 'none' }}
                      />
                    )}
                  </Box>
                </Box>

                {selectedDocument.rejection_reason && (
                  <Box bg="red.50" p={3} borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" color="red.600" mb={1}>
                      Rejection Reason:
                    </Text>
                    <Text fontSize="sm" color="red.600">
                      {selectedDocument.rejection_reason}
                    </Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onViewClose}>
                Close
              </Button>
              {selectedDocument?.verification_status === 'pending' && (
                <>
                  <Button
                    colorScheme="red"
                    leftIcon={<MdCancel />}
                    onClick={() => {
                      onViewClose();
                      onRejectOpen();
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    colorScheme="green"
                    leftIcon={<MdCheckCircle />}
                    onClick={() => handleVerifyDocument(selectedDocument.id)}
                    isLoading={actionLoading}
                  >
                    Verify Document
                  </Button>
                </>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reject Document Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Please provide a reason for rejecting this document. The lawyer will see this message.
              </Text>
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onRejectClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleRejectDocument}
                isLoading={actionLoading}
              >
                Reject Document
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
