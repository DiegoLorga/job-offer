import DefaultLayout from "../layout/DefaultLayout"

export default function Login() {
    return (
        <DefaultLayout>
            <form className="form">
                <h1>Login</h1>
                <label> Correo </label>
                <input type="text" />

                <label> Contraseña </label>
                <input type="password" />

                <button>Login</button>
            </form>

        </DefaultLayout>

    );
}