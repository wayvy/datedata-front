import { FullPanelLoader } from '@repo/ui/components';
import { configure } from 'mobx';
import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from 'react-router';
import 'temporal-polyfill';

import { ROUTES } from '@/config/routes';
import { withAuth } from '@/hocs/withAuth';
import Root from '@/layouts/Root';
import GoogleCallbackPage from '@/pages/google-callback';
import RouterErrorPage from '@/pages/router-error';

import '@/styles/global.scss';

import LoginPage from './pages/login/LoginPage';

const CalendarPage = withAuth(lazy(() => import('@/pages/calendar')));
const HomePage = withAuth(lazy(() => import('@/pages/home')));
const AccountPage = withAuth(lazy(() => import('@/pages/account')));

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  useProxies: 'ifavailable',
});

const isProd = import.meta.env.MODE === 'production';

const createRouter = isProd ? createBrowserRouter : createHashRouter;

const router = createRouter([
  {
    element: <Root />,
    errorElement: <RouterErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.home.create()} replace />,
      },
      {
        path: ROUTES.home.path,
        element: <HomePage />,
      },
      {
        path: ROUTES.login.path,
        element: <LoginPage />,
      },
      {
        path: ROUTES.account.path,
        element: <AccountPage />,
      },
      {
        path: ROUTES.googleCallback.path,
        element: <GoogleCallbackPage />,
      },
      {
        path: ROUTES.calendar.path,
        element: (
          <Suspense fallback={<FullPanelLoader />}>
            <CalendarPage />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
