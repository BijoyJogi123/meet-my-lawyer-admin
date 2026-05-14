import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import {
  MdPeople,
  MdPerson,
  MdShoppingCart,
  MdAttachMoney,
  MdPending,
  MdBlock,
} from 'react-icons/md';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { getDashboardStats } from 'services/adminApi';

export default function MarketplaceDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color={brandColor} />
      </Center>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Lawyer Statistics */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
            />
          }
          name="Total Lawyers"
          value={stats?.lawyers?.total || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="green.100"
              icon={<Icon w="32px" h="32px" as={MdPeople} color="green.500" />}
            />
          }
          name="Active Lawyers"
          value={stats?.lawyers?.active || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="orange.100"
              icon={<Icon w="32px" h="32px" as={MdPending} color="orange.500" />}
            />
          }
          name="Pending Verification"
          value={stats?.lawyers?.pending || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="red.100"
              icon={<Icon w="32px" h="32px" as={MdBlock} color="red.500" />}
            />
          }
          name="Blocked Lawyers"
          value={stats?.lawyers?.blocked || 0}
        />
      </SimpleGrid>

      {/* Client Statistics */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPerson} color={brandColor} />}
            />
          }
          name="Total Clients"
          value={stats?.clients?.total || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="green.100"
              icon={<Icon w="32px" h="32px" as={MdPerson} color="green.500" />}
            />
          }
          name="Active Clients"
          value={stats?.clients?.active || 0}
        />
      </SimpleGrid>

      {/* Order Statistics */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdShoppingCart} color={brandColor} />}
            />
          }
          name="Total Orders"
          value={stats?.orders?.total || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="orange.100"
              icon={<Icon w="32px" h="32px" as={MdShoppingCart} color="orange.500" />}
            />
          }
          name="Pending Orders"
          value={stats?.orders?.pending || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="blue.100"
              icon={<Icon w="32px" h="32px" as={MdShoppingCart} color="blue.500" />}
            />
          }
          name="In Progress"
          value={stats?.orders?.inProgress || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="green.100"
              icon={<Icon w="32px" h="32px" as={MdShoppingCart} color="green.500" />}
            />
          }
          name="Completed Orders"
          value={stats?.orders?.completed || 0}
        />
      </SimpleGrid>

      {/* Earnings Statistics */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAttachMoney} color="white" />}
            />
          }
          name="Total Platform Earnings"
          value={`₹${stats?.earnings?.total?.toFixed(2) || '0.00'}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #868CFF 0%, #4318FF 100%)"
              icon={<Icon w="28px" h="28px" as={MdAttachMoney} color="white" />}
            />
          }
          name="This Month's Earnings"
          value={`₹${stats?.earnings?.thisMonth?.toFixed(2) || '0.00'}`}
        />
      </SimpleGrid>
    </Box>
  );
}
