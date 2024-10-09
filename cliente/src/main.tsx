import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login';
import Registro from './routes/Registro';
import Empresa from './routes/Empresa';
import Empleado from './routes/Empleado';
import Administrador from './routes/Administrador';
import ProtectedRoute from './routes/ProtectedRoute';
import RecuperarContrasena from './routes/RecuperarContrasena';
import RestablecerContrasena from './routes/RestablecerContrasena';
import { AuthProvider } from './auth/AuthProvider';
import PerfilUsuario from './routes/PerfilUsuario';
import PerfilEmpresa from './routes/PerfilEmpresa';
import Postulantes from './routes/Postulantes';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css';

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
    element: <RecuperarContrasena />,
  },
  {
    path: "/RestablecerContrasena",
    element: <RestablecerContrasena />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "Empresa",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <Empresa />,
          },
          {
            path: "PerfilEmpresa",
            element: <PerfilEmpresa />,
          },
          {
            path: "Postulantes",
            element: <Postulantes />,
          },
        ],
      },
      {
        path: "Empleado",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <Empleado />,
          },
          {
            path: "PerfilUsuario",
            element: <PerfilUsuario />,
          },
        ],
      },
      {
        path: "Administrador",
        element: <Administrador />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
