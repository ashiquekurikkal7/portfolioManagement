import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import Login from '../../pages/Login';
import NotFound from  '../../pages/NotFound'; // extract 404 component to own file
import { routes, redirects } from '../../constants/routesConfig';

const AppRoutes = () => {
  const { login } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login onLogin={login} />} />

      {/* Protected Routes */}
      {routes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Layout>{element}</Layout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* Redirects */}
      {redirects.map(({ from, to }) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
