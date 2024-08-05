import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login';
import Registro from './routes/Registro';
import Empresa from './routes/Empresa';
import Empleado from './routes/Empleado';
import Administrador from './routes/Administrador';
import ProtectedRoute from './routes/ProtectedRoute';
import RecuperarContrasena from './routes/RecuperarContrasena';
import RestablecerContrasena from './routes/RestablecerContrasena'
import { AuthProvider } from './auth/AuthProvider';
import 'materialize-css/dist/css/materialize.min.css';
//import 'materialize-css/dist/js/materialize.min.js';
import './index.css'; // Importa tus estilos personalizados después



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
      {
        path: "/RestablecerContrasena",
        element: <RestablecerContrasena/>,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

