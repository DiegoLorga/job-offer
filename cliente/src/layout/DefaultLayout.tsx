import { Link } from "react-router-dom";
import Registro from '../routes/Registro';

interface DefaultLayoutProps{
    children: React.ReactNode;
}

export default function DefaultLayout({children}: DefaultLayoutProps){
    return(
        <>
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to ="/">Home</Link> 
                    </li>
                    <li>
                        <Link to ="/Registro">Registro</Link> 
                    </li>
                </ul>
            </nav>
        </header>
        <main>{children}</main>
        </>
    );

}