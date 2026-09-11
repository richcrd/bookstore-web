import { ROUTES } from '../../shared/constants';

export const routeBuilder = {
  home: ROUTES.home,
  callback: ROUTES.callback,
  orders: ROUTES.orders,
  newOrder: ROUTES.newOrder,
  newOrderWithBook: (bookId: string) => `${ROUTES.newOrder}?book=${bookId}`,
  stock: ROUTES.stock,
};
