import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../presentation/components/layout/Layout';
import { RequireAdmin, RequireAuth } from '../presentation/guards';
import { CallbackPage } from '../presentation/pages/auth/CallbackPage';
import { HomePage } from '../presentation/pages/catalog/HomePage';
import { CartPage } from '../presentation/pages/cart/CartPage';
import { OrdersPage } from '../presentation/pages/orders/OrdersPage';
import { OrderDetailPage } from '../presentation/pages/orders/OrderDetailPage';
import { StockPage } from '../presentation/pages/inventory/StockPage';
import { routeBuilder as R } from './router/routes';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path={R.home} element={<HomePage />} />
        <Route path={R.callback} element={<CallbackPage />} />
        <Route path={R.cart} element={<CartPage />} />
        <Route path={R.orders} element={<RequireAuth><OrdersPage /></RequireAuth>} />
        <Route path="/orders/:id" element={<RequireAuth><OrderDetailPage /></RequireAuth>} />
        <Route path={R.newOrder} element={<Navigate to={R.cart} replace />} />
        <Route path={R.stock} element={<RequireAuth><RequireAdmin><StockPage /></RequireAdmin></RequireAuth>} />
        <Route path="*" element={<p className="text-sm text-slate-500">Página no encontrada.</p>} />
      </Routes>
    </Layout>
  );
}