import { ROUTES } from '../../shared/constants';

export const routeBuilder = {
  home: ROUTES.home,
  callback: ROUTES.callback,
  orders: ROUTES.orders,
  newOrder: ROUTES.newOrder,
  cart: ROUTES.cart,
  stock: ROUTES.stock,
  orderDetail: (id: string) => `/orders/${id}`,
};
