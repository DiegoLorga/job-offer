import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/apis";
export default function Navigation() {
    const auth = useAuth();

    async function handleLogout() {
        try {
            const response = await fetch(`${API_URL}/login/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (response.ok) {
                console.log("El usuario cerró sesión");
                auth.setIsAuthenticated(false);
            } else {
                console.log("Algo va mal");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="navigation">
            <ul>
                <li className="logout">
                    <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
    );
}
