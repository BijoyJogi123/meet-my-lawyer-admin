import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdPeople,
  MdShoppingCart,
  MdAttachMoney,
  MdGroup,
} from 'react-icons/md';

// Lawyer Marketplace Admin Imports
import MarketplaceDashboard from 'views/admin/marketplace-dashboard';
import LawyersList from 'views/admin/lawyers/LawyersList';
import LawyerDetail from 'views/admin/lawyers/LawyerDetail';
import DocumentVerification from 'views/admin/lawyers/DocumentVerification';
import ClientsList from 'views/admin/clients/ClientsList';
import ClientDetail from 'views/admin/clients/ClientDetail';

// Original Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import AdminSignIn from 'views/auth/adminSignIn';

const routes = [
  {
    name: 'Marketplace Dashboard',
    layout: '/admin',
    path: '/marketplace',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MarketplaceDashboard />,
  },
  {
    name: 'Lawyers',
    layout: '/admin',
    path: '/lawyers',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <LawyersList />,
  },
  {
    name: 'Lawyer Detail',
    layout: '/admin',
    path: '/lawyers/:id',
    component: <LawyerDetail />,
    invisible: true,
  },
  {
    name: 'Document Verification',
    layout: '/admin',
    path: '/lawyers/:id/documents',
    component: <DocumentVerification />,
    invisible: true,
  },
  {
    name: 'Clients',
    layout: '/admin',
    path: '/clients',
    icon: <Icon as={MdGroup} width="20px" height="20px" color="inherit" />,
    component: <ClientsList />,
  },
  {
    name: 'Client Detail',
    layout: '/admin',
    path: '/clients/:id',
    component: <ClientDetail />,
    invisible: true,
  },
  {
    name: 'Admin Login',
    layout: '/auth',
    path: '/admin-login',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <AdminSignIn />,
  },
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    invisible: true,
  },
  {
    name: 'NFT Marketplace',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
    invisible: true,
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
    invisible: true,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    invisible: true,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    invisible: true,
  },
  {
    name: 'RTL Admin',
    layout: '/rtl',
    path: '/rtl-default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <RTL />,
    invisible: true,
  },
];

export default routes;
