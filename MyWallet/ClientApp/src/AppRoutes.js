import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Wallets } from "./Wallets";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {UserWallet} from './components/Wallets/UserWallet'
import { News } from './components/News/News';
import { Balance } from './components/Balance/Balance';

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
  ,
  {
    path: '/news',
    requireAuth: true,
    element: <News />
  }, {
    path: '/balance/:id',
    requireAuth: true,
    element: <Balance />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
