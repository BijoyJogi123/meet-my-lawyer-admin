import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';

function AdminSignIn() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('adminToken', data.token);
        
        toast({
          title: 'Success',
          description: 'Login successful!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/admin/marketplace');
        }, 500);
      } else {
        toast({
          title: 'Error',
          description: data.message || data.error || 'Login failed',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: 'Error',
        description: 'Failed to login. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Admin Login
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to access the admin panel
          </Text>
        </Box>

        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <form onSubmit={handleLogin}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="admin@lawyermarketplace.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                isLoading={loading}
              >
                Sign In
              </Button>
            </FormControl>
          </form>

          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            mt="20px"
          >
            <Text color={textColorSecondary} fontWeight="400" fontSize="14px">
              Admin access only
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default AdminSignIn;
