import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login';
import Registro from './routes/Registro';
import Empresa from './routes/Empresa';
import Empleado from './routes/Empleado';
import Administrador from './routes/Administrador';
import ProtectedRoute from './routes/ProtectedRoute';
import RecuperarContrasena from './routes/RecuperarContrasena';
import { AuthProvider } from './auth/AuthProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Registro",
    element: <Registro />,
  },
  {
    path: "/RecuperarContrasena",
    element: <RecuperarContrasena/>,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/Empresa",
        element: <Empresa />,
      },
      {
        path: "/Empleado",
        element: <Empleado />,
      },
      {
        path: "/Administrador",
        element: <Administrador />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
