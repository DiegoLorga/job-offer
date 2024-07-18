import Navigation from "../routes/Navegacion";

interface DefaultLayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
}

export default function DefaultLayout({ children, showNav = false }: DefaultLayoutProps) {
    return (
        <>
            {showNav && <Navigation />}
            <main>{children}</main>
        </>
    );
}
