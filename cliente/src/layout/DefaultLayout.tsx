import Navigation from "../routes/Navegacion";

interface DefaultLayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
}

console.log("DefaultLayout rendered");

export default function DefaultLayout({ children, showNav = false }: DefaultLayoutProps) {
    return (
        <>
            {showNav && <Navigation />}
            
            <main>{children}</main>
        </>
    );
}
