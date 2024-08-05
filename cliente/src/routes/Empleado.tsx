import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';


export default function Empleados() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const auth = useAuth();

    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        console.log("Pestañas inicializadas");
    }, []);

    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (

        <DefaultLayout showNav={true}>
            <div className="container"> <br /><br />
                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs center">
                            <li className="tab col s6"><a className="active" href="#test1">Para ti</a></li>
                            <li className="tab col s6"><a  href="#test2">Buscar</a></li>
                        </ul>
                    </div>
                    <div id="test1" className="col s12">Test 1</div>
                    <div id="test2" className="col s12">Test 2</div>
                </div>
            </div>
        </DefaultLayout>
        
    );
}
