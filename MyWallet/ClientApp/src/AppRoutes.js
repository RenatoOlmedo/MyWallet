import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Wallets } from "./Wallets";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {UserWallet} from './components/Wallets/UserWallet'

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/users',
    element: <Wallets />
  },
  {
    path: '/fetch-data',
    requireAuth: true,
    element: <FetchData />
  },
  {
    path: '/wallets/:id',
    requireAuth: true,
    element: <UserWallet />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
