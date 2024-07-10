import DefaultLayout from "../layout/DefaultLayout";

export default function Registro() {
    return (
        <DefaultLayout>
            <form className="form">
                <h1>Login</h1>
                <label> Nombre </label>
                <input type="text" />

                <label> Correo </label>
                <input type="text" />

                <label> Contraseña </label>
                <input type="password" />

                <label> Verificar Contraseña </label>
                <input type="password" />
                
                <label> Direccion </label>
                <input type="text" />

                <label> Ciudad </label>
                <input type="text" />

                <label> Estado </label>
                <input type="text" />

                <button>Login</button>
            </form>

        </DefaultLayout>

    );
}