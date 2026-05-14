// chakra imports
import { Box, Flex, Stack, Button, useColorModeValue, Icon } from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";
import React from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;
  const navigate = useNavigate();
  const buttonBg = useColorModeValue("white", "whiteAlpha.100");
  const buttonColor = useColorModeValue("red.500", "red.300");

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/auth/admin-login');
  };

  // SIDEBAR
  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
      <Brand />
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mb='20px'>
        <Button
          leftIcon={<Icon as={MdLogout} />}
          onClick={handleLogout}
          w="100%"
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: "red.50" }}
          _active={{ bg: "red.100" }}
        >
          Logout
        </Button>
      </Box>

      <Box
        mt='20px'
        mb='40px'
        borderRadius='30px'>
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;
