import { Link } from "react-router-dom";
import Registro from '../routes/Registro';

interface DefaultLayoutProps{
    children: React.ReactNode;
}

export default function DefaultLayout({children}: DefaultLayoutProps){
    return(
        <>
        <main>{children}</main>
        </>
    );

}