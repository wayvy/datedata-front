import { configure } from 'mobx';
import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from 'react-router';
import 'temporal-polyfill';

import { ROUTES } from '@/config/routes';
import { withAuth } from '@/hocs/withAuth';
import Root from '@/layouts/Root';
import DevPage from '@/pages/dev';
import RouterErrorPage from '@/pages/router-error';

import '@/styles/global.scss';

const AccountPage = withAuth(lazy(() => import('@/pages/account')));
const HomePage = withAuth(lazy(() => import('@/pages/home')));
const InfoPage = lazy(() => import('@/pages/info'));
const LoginPage = lazy(() => import('@/pages/login'));
const GoogleCallbackPage = lazy(() => import('@/pages/google-callback'));
const CalendarPage = withAuth(lazy(() => import('@/pages/calendar')));

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
        path: ROUTES.info.path,
        element: <InfoPage />,
      },
      {
        path: ROUTES.googleCallback.path,
        element: <GoogleCallbackPage />,
      },
      {
        path: ROUTES.calendar.path,
        element: <CalendarPage />,
      },
      {
        path: ROUTES.dev.path,
        element: <DevPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
