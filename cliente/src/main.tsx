import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login.tsx';
import Registro from './routes/Registro.tsx';
import Empresa from './routes/Empresa.tsx';
import Empleado from './routes/Empleado.tsx';
import Administrador from './routes/Administrador.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';

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
        path: "/Adiministrador",
        element: <Administrador />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  //llamamos a AuthProvider para verificar la autentificacion y despues a router para direccionarnos
  <React.StrictMode>
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
