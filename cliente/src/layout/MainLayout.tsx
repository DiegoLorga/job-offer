import Navigation from "../routes/Navegacion";
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
