import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Asegúrate de tener los estilos personalizados aquí
import { API_URL, API_URI_IMAGENES } from "../auth/apis";
import Swal from 'sweetalert2';
import '../estilos/estiloPerfilUsuario.css';
import { Navigate, useNavigate } from "react-router-dom";
import { AuthReponseRegister, AuthResponseError } from "../types/types";


interface Estado {
    _id: string;
    nombre: string;
    clave: string;
}

interface Ciudad {
    _id: string;
    nombre: string;
    clave: string;
}

interface Usuario {
    _id: string;
    nombre: string;
    correo: string;
    direccion: string;
    estado: string;
    ciudad: string;
}

interface perfilUsuario {
    _id: string;
    cv: false,
    experiencia: string,
    especialidad: string,
    habilidades: string,
    educacion: string,
    idiomas: string,
    certificaciones: false,
    repositorio: string,
    status: false,
    foto: false
}

export default function PerfilUsuarios() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [direccion, setDireccion] = useState<string>("");
    const [selectedEstado, setSelectedEstado] = useState<string>("");
    const [selectedCiudad, setSelectedCiudad] = useState("");
    const [selectedNombre, setSelectedNombre] = useState<string>("");
    const [selectedDireccion, setSelectedDireccion] = useState<string>("");
    const [ciudad, setCiudad] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Para manejar la imagen
    const [previewImage, setPreviewImage] = useState<string | null>(null); // Asegurarse de que solo sea string o null
    const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input de archivo
    const [foto, setFoto] = useState<boolean>(false);
    const [errorNombre, setErrorNombre] = useState("");
    const auth = useAuth();
    const goTo = useNavigate();


    // Obtener la lista de estados al cargar el componente
    useEffect(() => {
        async function fetchEstados() {
            try {
                const response = await fetch(`${API_URL}/usuario/getEstados`);
                if (response.ok) {
                    const data = await response.json() as Estado[];
                    setEstados(data);
                    /*if (data.length > 0) {
                        setSelectedEstado(data[0].clave);
                    } */
                } else {
                    console.error('Error al obtener los estados:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los estados:', error);
            }
        }

        fetchEstados();
    }, []);

    //setSelectedCiudad(ciudad);
    useEffect(() => {
        async function fetchCiudades() {
            if (selectedEstado) {
                try {
                    const response = await fetch(`${API_URL}/usuario/getCiudades/${selectedEstado}`);
                    if (response.ok) {
                        const data = await response.json() as Ciudad[];
                        setCiudades(data);
                        if (data.length > 0) {
                            setSelectedCiudad(data[0].nombre);
                        }
                    } else {
                        console.error('Error al obtener las ciudades:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error al obtener las ciudades:', error);
                }
            } else {
                setCiudades([]); // Limpiar ciudades si no hay un estado seleccionado
            }

        }

        fetchCiudades();
    }, [selectedEstado]);


    useEffect(() => {
        const modalElement = document.getElementById('modal1');
        if (modalElement) {
            // Asegúrate de que `modalElement` no sea `null` antes de inicializar el modal
            const modalInstance = M.Modal.init(modalElement);

            // Asegúrate de actualizar el modal con la información correcta cuando se abre
            modalInstance.options.onOpenStart = () => {
                setSelectedNombre(nombre);
                setSelectedDireccion(direccion);
                setSelectedEstado(estado);
                setSelectedCiudad(ciudad);
            };

            return () => {
                modalInstance.destroy();
            };
        }
    }, [nombre, direccion, estado, ciudad]);

    //para consultas
    useEffect(() => {


        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            auth.setIsAuthenticated(true);

            async function fetchUsuario() {
                try {
                    const response = await fetch(`${API_URL}/usuario/getUsuario/${usuario.id}`);
                    if (response.ok) {
                        const data = await response.json() as Usuario;
                        setNombre(data.nombre);
                        setCorreo(data.correo);
                        setDireccion(data.direccion);
                        setEstado(data.estado);
                        setCiudad(data.ciudad);
                        //console.log("Datos del usuario en perfil ", data);
                    } else {
                    }
                } catch (error) {
                    console.error('Error al obtener el usuario:', error);
                }
            }

            async function fetchPerfilUsuario() {
                try {
                    const response = await fetch(`${API_URL}/usuario/getPerfilUsuario/${usuario.id}`);
                    if (response.ok) {
                        const data = await response.json() as perfilUsuario;
                        setFoto(data.foto);
                        console.log("Datos del usuario en perfil ", data);
                    } else {
                    }
                } catch (error) {
                    console.error('Error al obtener el perfil del usuario:', error);
                }
            }
            fetchUsuario();
            fetchPerfilUsuario();
        }

    }, [auth]);


    //para obtener imágenes 
    const storedUser = localStorage.getItem('usuario');
    let imageSrc = `${API_URI_IMAGENES}/img/auxiliares/perfil.png`;
    if (storedUser) {
        const usuario = JSON.parse(storedUser);
        //auth.setIsAuthenticated(true);
        console.log(foto);
        imageSrc = previewImage
            ? previewImage
            : foto
                ? `${API_URI_IMAGENES}/img/perfilUsuario/${usuario.id}.jpg`
                : `${API_URI_IMAGENES}/img/auxiliares/perfil.png`;
    }



    //para cargar la imagen 
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    //para cargar la imagen
    const handleUploadImage = async () => {
        if (!selectedFile) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result?.toString();
            const storedUser = localStorage.getItem('usuario');
            if (storedUser) {
                const usuario = JSON.parse(storedUser);
                const userId = usuario.id;

                try {
                    const response = await fetch(`${API_URI_IMAGENES}/uploadImagen`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            src: base64Image,
                            id: userId
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        Swal.fire({
                            title: "¡Éxito!",
                            text: "Imagen actualizada exitosamente.",
                            icon: "success"
                        });
                        console.log(data);
                    } else {
                        const errorData = await response.json();
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            text: 'Error al caragar la imagen'
                        })

                    }
                } catch (error) {
                    console.error('Error al cargar la imagen:', error);
                    setErrorResponse("Error al cargar la imagen");
                }
            }
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Activa el input de archivo
        }
    };

    // Función de manejo del envío del formulario
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Mostrar una alerta de confirmación antes de proceder
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas actualizar la información?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario confirma, continuar con la actualización
        if (result.isConfirmed) {
            const storedUser = localStorage.getItem('usuario');
            if (storedUser) {
                const usuario = JSON.parse(storedUser);

                // Crear el objeto de actualización solo con los campos que tienen valor
                const updatedFields: Record<string, string> = {};

                if (selectedNombre) updatedFields.nombre = selectedNombre;
                if (selectedDireccion) updatedFields.direccion = selectedDireccion;
                if (selectedEstado) updatedFields.estado = selectedEstado;
                if (selectedCiudad) updatedFields.ciudad = selectedCiudad;

                try {
                    const response = await fetch(`${API_URL}/usuario/actualizarUsuario/${usuario.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedFields) // Solo los campos con valor
                    });

                    if (response.ok) {
                        const updatedUser = await response.json(); // Obtener la respuesta actualizada

                        // Actualizar el estado del formulario principal con los nuevos valores
                        setNombre(updatedUser.nombre || nombre);
                        setDireccion(updatedUser.direccion || direccion);
                        setEstado(updatedUser.estado || estado);
                        setCiudad(updatedUser.ciudad || ciudad);

                        Swal.fire({
                            title: "Éxito",
                            text: "Usuario actualizado exitosamente",
                            icon: "success"
                        });

                        const modalElement = document.getElementById('modal1');
                        if (modalElement) {
                            const modalInstance = M.Modal.getInstance(modalElement);
                            if (modalInstance) {
                                modalInstance.close();
                            }
                        }
                        setSelectedNombre('');
                        setSelectedDireccion('');
                        setSelectedEstado('');
                        setSelectedCiudad('');
                        setErrorNombre("");

                    } else {
                        const json = await response.json() as AuthResponseError;
                        if (json.body.nombreError) {
                            Swal.fire({
                                title: "Error",
                                text: json.body.nombreError,
                                icon: "error"
                            });
                        } else {
                            if (json.body.camposError) {
                                Swal.fire({
                                    title: "Error",
                                    text: json.body.camposError,
                                    icon: "error"
                                });
                            }
                        }
                        setErrorNombre(json.body.nombreError || "");
                        setSuccessMessage("");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }



    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }


    return (
        <DefaultLayout showNav={true}>

            <div className="nav-content">
                <ul id="tabs-swipe-demo" className="tabs">
                    <li className="tab col s6"><a className="active" href="#perfil">Perfil</a></li>
                    <li className="tab col s6"><a href="#info">Competencias</a></li>
                </ul>
            </div>

            {/* para perfil  */}
            <div id="perfil" className="container2">
                <br /><br />

                <div className="profile-container">
                    <div className="profile-picture-container" onClick={handleImageClick}>
                        <img
                            src={imageSrc} // Convertir a string
                            alt="Foto de perfil"
                            className="profile-picture"
                        />
                        <div className="overlay">
                            <i className="material-icons">edit</i>
                            <span>Cambiar foto</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}

                <div className="button-containerSave">
                    <button
                        type="button"
                        className="btn"
                        onClick={handleUploadImage}
                        disabled={!previewImage} // Desactiva si no hay imagen precargada ni seleccionada
                    >
                        Guardar
                    </button>
                </div>


                <div className="nombre-contenedor">
                    <h1 className="nombre-titulo">{nombre}</h1>
                </div>

                <form className="form-horizontal">
                    <label htmlFor="correo">Correo</label>
                    <div className="input-field1">
                        <input type="email" id="correo" name="correo" value={correo} readOnly />
                    </div>
                    <label htmlFor="direccion">Dirección</label>
                    <div className="input-field1">
                        <input type="text" id="direccion" name="direccion" value={direccion} readOnly />
                    </div>
                    <label htmlFor="estado">Estado</label>
                    <div className="input-field1">
                        <input type="text" id="estado" name="estado" value={estado} readOnly />
                    </div>
                    <label htmlFor="ciudad">Ciudad</label>
                    <div className="input-field1">
                        <input type="text" id="ciudad" name="ciudad" value={ciudad} readOnly />
                    </div>

                    <div className="button-container1">
                        <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Actualizar</a>
                    </div>

                </form>

                {/* Modal Structure */}
                <div id="modal1" className="modal">
                    <div className="modal-contentperfil">
                        <h4 style={{ textAlign: 'center' }}>Actualizar Información</h4>

                        <form className="col s12" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="input-fieldperfil col s12">
                                    <input
                                        id="nombre"
                                        type="text"
                                        className="validate"
                                        value={selectedNombre}
                                        onChange={(e) => setSelectedNombre(e.target.value)}
                                    />
                                    <label htmlFor="nombre">Nombre</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-fieldperfil col s12">
                                    <input
                                        id="direccion"
                                        type="text"
                                        className="validate"
                                        value={selectedDireccion}
                                        onChange={(e) => setSelectedDireccion(e.target.value)}
                                    />
                                    <label htmlFor="direccion">Dirección</label>
                                </div>
                            </div>

                            <div className="input-fieldperfil2">
                                <label>Estado</label>
                                <div className="input-fieldperfil2 col s12">
                                    <select
                                        value={selectedEstado}
                                        onChange={(e) => setSelectedEstado(e.target.value)}
                                        className="browser-default"
                                    >
                                        <option value="">Seleccione un estado</option> {/* Opción por defecto */}
                                        {estados.map(estado => (
                                            <option key={estado._id} value={estado.clave}>{estado.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="input-fieldperfil2">
                                <label>Ciudad</label>
                                <div className="input-fieldperfil2 col s12">
                                    <select
                                        value={selectedCiudad}
                                        onChange={(e) => setSelectedCiudad(e.target.value)}
                                        className="browser-default"
                                    >

                                        {ciudades.map(ciudad => (
                                            <option key={ciudad._id} value={ciudad.nombre}>{ciudad.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>



                            <div className="modal-footer">
                                <button type="submit" className="waves-effect waves-light btn modal-trigger"
                                    style={{ marginRight: '15px' }}>Enviar
                                    <i className="material-icons right">send</i>
                                </button>
                                <a href="#!" className="modal-close waves-effect waves-light btn modal-trigger"
                                    style={{ marginRight: '30px' }}>Cerrar</a>
                            </div>

                        </form>
                    </div>

                </div>

            </div>
            {/* para informacion  */}
            <div id="info" className="containerinfo">
            <h2>Información Adicional</h2><br/>


                <div className="card">
                    <div className="card-content">
                        <span className="card-title">CV</span>
                        <p></p>
                    </div>
                </div><br/>
                <div className="card">
                    <div className="card-content">
                    <br/><span className="card-title">Experiencia laboral reciente</span>
                        <p>Experiencia laboral adquirida de su último trabajo.</p><br/>
                    </div>
                </div><br/>
                <div className="card">
                    <div className="card-content">
                    <br/><span className="card-title">Especialidad</span>
                        <p>Áreas en donde tiene mayor conocimiento.</p><br/>
                    </div>
                </div><br/>
                <div className="card">
                    <div className="card-content">
                    <br/><span className="card-title">Habilidades</span>
                        <p>Habilidades con las que cuenta. Ej: Trabajo en equipo, adaptabilidad, etc.  </p><br/>
                    </div>
                </div><br/>
                <div className="card">
                    <div className="card-content">
                    <br/><span className="card-title">Educación</span>
                        <p>Último nivel de estudios. </p><br/>
                    </div>
                </div><br/>
                <div className="card">
                    <div className="card-content">
                    <br/><span className="card-title">Idioma</span>
                        <p>Idiomas y nivel de conocimiento </p><br/>
                    </div>
                </div><br/>
                <div className="card">
                    <div className="card-content">
                    <br/><span className="card-title">Cursos y certificaciones</span>
                        <p>Cursos adicionales o certificados que respalden sus conocimientos. </p><br/>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
