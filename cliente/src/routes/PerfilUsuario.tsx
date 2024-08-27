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
import { AuthResponseError, perfilUsuario } from '../types/types';
import { Estado, Ciudad, Usuario, Experiencia, Educacion, Habilidad, EducacionUsuario } from '../types/types';


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
    const [selectedCorreo, setSelectedCorreo] = useState<string>("")
    const [ciudad, setCiudad] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [estado2, setEstado2] = useState<string>("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Para manejar la imagen
    const [previewImage, setPreviewImage] = useState<string | null>(null); // Asegurarse de que solo sea string o null
    const [previewImageBoton, setPreviewImageBoton] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input de archivo
    const [foto, setFoto] = useState<boolean>(false);
    const [errorNombre, setErrorNombre] = useState("");
    const auth = useAuth();
    const goTo = useNavigate();
    const [selectedFileDoc, setSelectedFileDoc] = useState<File | null>(null);
    const [habilidad, setHabilidad] = useState('');
    const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
    const [experiencia, setExperiencia] = useState<Experiencia | null>(null);
    const [perfilUsuario, setPerfilUsuario] = useState<perfilUsuario | null>(null);
    const [cambios, setCambios] = useState<boolean>(false);
    const [educacion, setEducacion] = useState<Educacion[]>([]);
    const [selectedEducacion, setSelectedEducacion] = useState<string>("");
    const [educacionUsuario, setEduUsu] = useState<EducacionUsuario | null>(null);


    //agregar al cliente habilidades
    const handleAgregarHabilidad = () => {
        if (habilidad.trim()) {
            if (habilidades.length >= 5) {
                Swal.fire('Error', 'Puedes agregar solo 5 habilidades', 'error');
                setHabilidad('');
                return;
            }

            // Verifica que perfilUsuario no sea null
            if (perfilUsuario) {
                // Crear un nuevo objeto Habilidad
                const nuevaHabilidad: Habilidad = {
                    _id: crypto.randomUUID(),  // Genera un ID único temporal (puedes cambiarlo según tu lógica)
                    descripcion: habilidad,
                    id_usuario: perfilUsuario._id // Asegúrate de que `perfilUsuario.id` esté definido
                };

                // Agregar el nuevo objeto Habilidad al array
                setHabilidades([...habilidades, nuevaHabilidad]);

                setHabilidad(''); // Limpiar el campo después de añadir la habilidad
            } else {
                console.error('perfilUsuario es null, no se puede agregar habilidad');
            }
        }
    };

    //para actualizar/agregar habilidades
    const handleEnviarHabilidades = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verifica si las habilidades tienen el número correcto
        if (habilidades.length !== 5) {
            Swal.fire('Error', 'Debes agregar o actualizar en total 5 habilidades', 'error');
            return;
        }

        // Verifica si el perfil del usuario está disponible
        if (!perfilUsuario) {
            Swal.fire('Error', 'Perfil del usuario no encontrado', 'error');
            return;
        }

        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);

            // Muestra un mensaje de confirmación
            Swal.fire({
                title: 'Confirmar',
                text: "¿Deseas agregar las nuevas habilidades?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Realiza la solicitud al servidor
                        const response = await fetch(`${API_URL}/perfilUsuario/crearHabilidades/${usuario.id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(habilidades.map(hab => ({
                                descripcion: hab.descripcion,
                                id_usuario: hab.id_usuario
                            })))
                        });

                        const data = await response.json();
                        if (response.ok) {
                            setCambios(true); // Actualizar el estado para reflejar cambios
                            console.log(data);
                            
                            Swal.fire({
                                title: "Éxito",
                                text: "Habilidades agregadas correctamente",
                                icon: "success"
                            }).then(() => {
                                // Cerrar el modal después de mostrar el mensaje de éxito
                                const modalElement = document.getElementById('modalHab');
                                if (modalElement) {
                                    const modalInstance = M.Modal.getInstance(modalElement);
                                    if (modalInstance) {
                                        modalInstance.close();
                                    }
                                }
                            });



                        } else {
                            Swal.fire('Error', data.message || 'No se pudieron agregar las habilidades', 'error');
                        }
                    } catch (error) {
                        Swal.fire('Error', 'Error al conectar con el servidor', 'error');
                    }
                }
            });
        }
    };

    //para limpiar los campos de habilidades
    const handleCloseHab = () => {
        setHabilidad('');

    };

    //para cargar la imagen 
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setPreviewImageBoton(reader.result as string);
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
                        //const data = await response.json();
                        Swal.fire({
                            title: "¡Éxito!",
                            text: "Imagen actualizada exitosamente.",
                            icon: "success"
                        }).then(() => {
                            // setSelectedFile(null); // Limpia el archivo seleccionado
                            setPreviewImageBoton(null); // Limpia la imagen previa

                        });
                    } else {
                        //const errorData = await response.json();
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            text: 'Error al caragar la imagen'
                        })

                    }
                } catch (error) {
                    console.error('Error al cargar la imagen:', error);
                    //setErrorResponse("Error al cargar la imagen");
                }
            }
        };

        reader.readAsDataURL(selectedFile);
    };

    //para el boton de guardar fotoperfil
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
                if (selectedCorreo) updatedFields.correo = selectedCorreo;
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
                        const nuevoEstado = updatedUser.estado || estado;
                        setNombre(updatedUser.nombre || nombre);
                        setDireccion(updatedUser.direccion || direccion);
                        setEstado(updatedUser.estado || estado);
                        setCorreo(updatedUser.correo || correo);
                        setCiudad(updatedUser.ciudad || ciudad);


                        try {
                            const response = await fetch(`${API_URL}/usuario/getEstado/${nuevoEstado}`);
                            if (response.ok) {
                                const data = await response.json() as Usuario;
                                setEstado2(data.nombre);
                                //console.log("Estadoactualizado", data);
                            }
                        } catch (error) {
                            console.error('Error al obtener el usuario:', error);
                        }

                        // Mostrar mensaje de éxito y cerrar el modal
                        Swal.fire({
                            title: "Éxito",
                            text: "Usuario actualizado exitosamente",
                            icon: "success"
                        }).then(() => {
                            // Cerrar el modal después de mostrar el mensaje de éxito
                            const modalElement = document.getElementById('modal1');
                            if (modalElement) {
                                const modalInstance = M.Modal.getInstance(modalElement);
                                if (modalInstance) {
                                    modalInstance.close();
                                }
                            }
                            // Opcional: Limpiar los campos del formulario
                            setSelectedNombre('');
                            setSelectedCorreo('');
                            setSelectedDireccion('');
                            setSelectedEstado('');
                            setSelectedCiudad('');
                            setErrorNombre("");
                        });

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

    useEffect(() => {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);

        return () => {
            M.FormSelect.getInstance(elems[0])?.destroy();
        };
    }, [educacion]);

    useEffect(() => {
        const dropdownElems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(dropdownElems);

        return () => {
            M.Dropdown.getInstance(dropdownElems[0])?.destroy();
        };
    }, []);

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

    //para consultas en perfil
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
                    }
                } catch (error) {
                    console.error('Error al obtener el usuario:', error);
                }

            }

            async function fetchEstado() {
                try {
                    const nuevoEstado = usuario.estado || estado;
                    const response = await fetch(`${API_URL}/usuario/getEstado/${nuevoEstado}`);
                    if (response.ok) {
                        const data = await response.json() as Usuario;
                        setEstado2(data.nombre);

                        // console.log("Estado", data);
                    }
                } catch (error) {
                    //console.error('Error al obtener el usuario:', error);
                }
            }

            fetchUsuario();
            fetchEstado();
        }

    }, [auth]);

    //para usuario perfil 
    useEffect(() => {

        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);

            async function fetchPerfilUsuario() {
                try {
                    const response = await fetch(`${API_URL}/usuario/getPerfilUsuario/${usuario.id}`);
                    if (response.ok) {
                        const data = await response.json() as perfilUsuario;
                        setFoto(data.foto);
                        setPerfilUsuario(data);
                       // console.log("Datos del usuario en peerfil ", perfilUsuario);
                        
                        
                        if (data.habilidades) {
                            const habilidadesResponse = await fetch(`${API_URL}/perfilUsuario/buscarHabilidades/${usuario.id}`);
                           // console.log('Datos recibidos:', habilidadesResponse);
                            if (habilidadesResponse.ok) {
                                setCambios(true); // Actualizar el estado para reflejar cambios
                                // Extrae el array de habilidades
                                const habilidadesData = await habilidadesResponse.json();
                               // console.log("Habilidades: ", habilidadesData);




                                // Verifica que habilidadesData sea un array
                                if (Array.isArray(habilidadesData)) {
                                    // Extrae solo las descripciones
                                    const habilidades1 = habilidadesData.map((hab: Habilidad) => ({
                                        _id: hab._id,
                                        descripcion: hab.descripcion,
                                        id_usuario: hab.id_usuario
                                    }));
                                    setHabilidades(habilidades1);
                                    //console.log("setHabilidades: ", habilidades1);


                                } else {
                                    console.error('La respuesta del servidor no es un array');
                                }
                            } else {
                                console.error('Error al obtener habilidades:', habilidadesResponse.statusText);
                            }
                        }
                    }

                } catch (error) {
                    console.error('Error al obtener el perfil del usuario:', error);
                }
            }




            fetchPerfilUsuario();
        }

    }, [perfilUsuario?.habilidades, cambios]);

    //inicializar modal1
    useEffect(() => {
        const modalElement = document.getElementById('modal1');


        if (modalElement) {
            // Inicializar el modal solo si el elemento existe
            const modalInstance = M.Modal.init(modalElement, {
                onOpenStart: () => {
                    setSelectedNombre(nombre);
                    setSelectedDireccion(direccion);
                    setSelectedEstado(estado);
                    setSelectedCiudad(ciudad);
                    setSelectedCorreo(correo);
                },
                onCloseEnd: () => {
                    // Opcional: resetear el modal cuando se cierra
                }
            });

            return () => {
                // Destruir la instancia del modal para evitar fugas de memoria
                if (modalInstance) {
                    modalInstance.destroy();
                }
            };
        }
    }, [nombre, direccion, estado, ciudad]);



    //para inicalizar modales
    useEffect(() => {
        // Inicializar primer modal
        const modalElement1 = document.getElementById('modalExp');
        const modalInstance1 = modalElement1 ? M.Modal.init(modalElement1) : null;
        if (modalInstance1) {
            modalInstance1.options.onOpenStart = () => {
                fetchExperiencia();
            };
        }

        // Función asíncrona para obtener la experiencia del usuario
        const fetchExperiencia = async () => {  // Tipo explícito para usuarioId
            const storedUser2 = localStorage.getItem('usuario');
            if (storedUser2) {
                const usuario = JSON.parse(storedUser2);
                auth.setIsAuthenticated(true);
                //console.log(usuario);
                try {
                    console.log(usuario.id);
                    const response = await fetch(`${API_URL}/perfilUsuario/buscarExperiencia/${usuario.id}`);
                    const data = await response.json();
                    setExperiencia(data);
                    console.log("datos exp", data);
                } catch (error) {
                    console.error('Error al obtener la experiencia:', error);
                }
            }
        };

        //fetchExperiencia();
        // Inicializar segundo modal
        const modalElement2 = document.getElementById('modalHab');
        const modalInstance2 = modalElement2 ? M.Modal.init(modalElement2) : null;
        if (modalInstance2) {
            modalInstance2.options.onOpenStart = () => {
                obtenerHabilidades();
            };
        }

        // Inicializar tercer modal
        const handleOpenEduModal = async () => {
            await fetchEducacionUsuario(); // Carga primero la educación del usuario
            await fetchEducacion();        // Luego carga las opciones de nivel
        };

        // Inicializar el modal de educación
        const modalElement3 = document.getElementById('modalEdu');
        let modalInstance3 = modalElement3 ? M.Modal.init(modalElement3) : null;

        if (modalInstance3) {
            modalInstance3.options.onOpenStart = () => {
                handleOpenEduModal()
                
            }
        }

        // Cleanup function
        return () => {
            if (modalInstance1) modalInstance1.destroy();
            if (modalInstance2) modalInstance2.destroy();
            if (modalInstance3) modalInstance3.destroy();
        };
    }, []);

    async function fetchEducacionUsuario() {
        const storedUser2 = localStorage.getItem('usuario');
        if (storedUser2) {
            const usuario = JSON.parse(storedUser2);
            auth.setIsAuthenticated(true);
            try {
                const response = await fetch(`${API_URL}/perfilUsuario/buscarEducacionUsuario/${usuario.id}`);
                const data = await response.json();
                setEduUsu(data);
                //setSelectedEducacion(educacionUsuario?.nivel || '');
                //console.log("datos educacion", data);
                if (data && data.nivel) {
                    console.log("Entroooo");
                    setSelectedEducacion(data.nivel); // Asegurarse de establecer el nivel correcto
                }
            } catch (error) {
                console.error('Error al obtener la experiencia:', error);
            }
        }
    }

    async function fetchEducacion() {
        try {
            const response = await fetch(`${API_URL}/OfertaLaboral/educacion`);
            if (response.ok) {
                const data = await response.json() as Educacion[];
                setEducacion(data);
                console.log("Datos de la educaciónnnnnnn: ", data);
                if (data.length > 0) {
                    //setSelectedEducacion(educacionUsuario?.nivel || '');
                    
                }
            } else {
                console.error('Error al obtener los datos de nivel:', response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener los datos de nivel:', error);
        }
    }

    async function obtenerHabilidades() {
        const storedUser2 = localStorage.getItem('usuario');
        if (storedUser2) {
            const usuario = JSON.parse(storedUser2);
        try {
            const habilidadesResponse = await fetch(`${API_URL}/perfilUsuario/buscarHabilidades/${usuario.id}`);
            
            if (habilidadesResponse.ok) {
                setCambios(true); // Actualizar el estado para reflejar cambios
    
                const habilidadesData = await habilidadesResponse.json();
    
                if (Array.isArray(habilidadesData)) {
                    const habilidades1 = habilidadesData.map((hab: Habilidad) => ({
                        _id: hab._id,
                        descripcion: hab.descripcion,
                        id_usuario: hab.id_usuario
                    }));
                    setHabilidades(habilidades1);
                } else {
                    console.error('La respuesta del servidor no es un array');
                }
            } else {
                console.error('Error al obtener habilidades:', habilidadesResponse.statusText);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }

        }
    }
    

    //para obtener imágenes
    const storedUser = localStorage.getItem('usuario');
    let imageSrc = `${API_URI_IMAGENES}/img/auxiliares/perfil.png`;
    if (storedUser) {
        const usuario = JSON.parse(storedUser);
        //auth.setIsAuthenticated(true);
        //console.log(foto);
        imageSrc = previewImage
            ? previewImage
            : foto
                ? `${API_URI_IMAGENES}/img/perfilUsuario/${usuario.id}.jpg`
                : `${API_URI_IMAGENES}/img/auxiliares/perfil.png`;
    }

    const eliminarHabilidad = async (index: number) => {
        const habilidad = habilidades[index];

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Estás seguro de que deseas eliminar esta habilidad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        console.log(habilidad);


        if (result.isConfirmed) {
            if (!habilidad.id_usuario) {
                console.log("Eliminando aun no esta en la base de datos");

                // Si la habilidad no tiene _id, elimínala solo de la interfaz
                setHabilidades(habilidades.filter((_, i) => i !== index));
                Swal.fire('Éxito', 'Habilidad eliminada de la lista', 'success');
            } else {
                console.log("Eliminando desde la base de datos");

                // Si la habilidad tiene _id, intenta eliminarla de la base de datos
                const storedUser = localStorage.getItem('usuario');

                if (!storedUser) {
                    Swal.fire('Error', 'No se encontró información del usuario', 'error');
                    return;
                }

            const usuario = JSON.parse(storedUser);

            try {
                const response = await fetch(`${API_URL}/perfilUsuario/eliminarHabilidad/${habilidad._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                    if (response.ok) {
                        // Si la eliminación en la base de datos fue exitosa, elimínala también de la interfaz
                        setHabilidades(habilidades.filter((_, i) => i !== index));
                        Swal.fire('Éxito', 'Habilidad eliminada correctamente', 'success');
                    } else {
                        const errorData = await response.json();
                        Swal.fire('Error', errorData.Error || 'No se pudo eliminar la habilidad', 'error');
                    }
                } catch (error) {
                    console.error('Error al eliminar la habilidad:', error);
                    Swal.fire('Error', 'Error al conectar con el servidor', 'error');
                }
            }
        }
    };


    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Para confirmar que desea actualizar la imagen 
    const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Muestra un diálogo de confirmación antes de subir el archivo
            Swal.fire({
                title: '¿Desea subir este archivo?',
                text: `Archivo: ${file.name}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true // Invierte el orden de los botones
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si se confirma, llama a la función para subir el archivo
                    uploadFile(file);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Si se cancela, limpia el input de archivo
                    event.target.value = ''; // Resetea el valor del input
                    setSelectedFileDoc(null); // Limpia el estado del archivo seleccionado
                }
            });
        }
    };

    // Subir el documento al servidor
    const uploadFile = async (file: File) => {
        // Lee el archivo como base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64File = reader.result?.toString().split(',')[1]; // Elimina el prefijo data URL

            // Obtén el usuario desde el localStorage
            const storedUser = localStorage.getItem('usuario');
            if (storedUser) {
                const usuario = JSON.parse(storedUser);
                const userId = usuario.id;

                try {
                    const response = await fetch(`${API_URI_IMAGENES}/uploadCv`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            src: base64File,
                            id: userId
                        })
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "¡Éxito!",
                            text: "Archivo actualizado exitosamente.",
                            icon: "success"
                        }).then(() => {
                            // Limpia el archivo seleccionado y la previsualización
                            setSelectedFileDoc(null); // Limpia el archivo seleccionado
                        });
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            text: 'Error al cargar el archivo'
                        });
                    }
                } catch (error) {
                    console.error('Error al cargar el archivo:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Ocurrió un error inesperado.",
                        icon: "error"
                    });
                }
            }
        };

        reader.readAsDataURL(file);
    };

    //actualizar la experiencia de perfilUsuario
    const actualizarExp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario

        // Obtén los elementos del formulario
        const empresaInput = document.getElementById('empresa') as HTMLInputElement;
        const puestoInput = document.getElementById('puesto') as HTMLInputElement;
        const descripcionInput = document.getElementById('descripcion') as HTMLTextAreaElement;

        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);

            if (!empresaInput || !puestoInput || !descripcionInput) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Campos incompletos.',
                });
                return;
            }

            // Obtén los valores de los elementos del formulario
            const empresa = empresaInput.value;
            const puesto = puestoInput.value;
            const descripcion = descripcionInput.value;

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
                try {
                    const response = await fetch(`${API_URL}/perfilUsuario/actualizarExperiencia/${usuario.id}`, {
                        method: 'PUT', // O 'POST' si estás creando un nuevo registro
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            empresa,
                            puesto,
                            descripcion,
                        }),
                    });


                    if (response.ok) {
                        // Maneja la respuesta exitosa usando SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Experiencia actualizada correctamente',
                        });
                        // Cierra el modal si es necesario
                        const modal = document.querySelector('#modalExp');
                        if (modal) {
                            M.Modal.getInstance(modal).close();
                        }
                    } else {
                        // Maneja errores usando SweetAlert
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar la experiencia',
                        });
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error de red',
                    });
                }
            }
        }
    };

    //actualizar la experiencia de perfilUsuario
    const actualizarEdu = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario

        // Obtén los elementos del formulario
        const nivelInput = document.getElementById('nivel') as HTMLInputElement;
        const institucionInput = document.getElementById('institucion') as HTMLInputElement;
        const carreraInput = document.getElementById('carrera') as HTMLInputElement;

        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);

            console.log(nivelInput, institucionInput, carreraInput);

            if (!nivelInput || !institucionInput || !carreraInput) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Campos incompletos.',
                });
                return;
            }

            // Obtén los valores de los elementos del formulario
            const nivel = nivelInput.value;
            const institucion = institucionInput.value;
            const carrera = carreraInput.value;

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
                try {
                    const response = await fetch(`${API_URL}/perfilUsuario/actualizarEducacion/${usuario.id}`, {
                        method: 'PUT', // O 'POST' si estás creando un nuevo registro
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            nivel,
                            institucion,
                            carrera,
                        }),
                    });


                    if (response.ok) {
                        // Maneja la respuesta exitosa usando SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Educacion actualizada correctamente',
                        });
                        // Cierra el modal si es necesario
                        const modal = document.querySelector('#modalExp');
                        if (modal) {
                            M.Modal.getInstance(modal).close();
                        }
                    } else {
                        // Maneja errores usando SweetAlert
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar la experiencia',
                        });
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error de red',
                    });
                }
            }
        }
    };


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

                <div className="profile-container2">
                    <div className="profile-picture-container2" onClick={handleImageClick}>
                        <img
                            src={imageSrc} // Convertir a string
                            alt="Foto de perfil"
                            className="profile-picture2"
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
                        disabled={!previewImageBoton} // Desactiva si no hay imagen precargada ni seleccionada
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
                        <input type="text" id="estado" name="estado" value={estado2} readOnly />
                    </div>
                    <label htmlFor="ciudad">Ciudad</label>
                    <div className="input-field1">
                        <input type="text" id="ciudad" name="ciudad" value={ciudad} readOnly />
                    </div>

                    <div className="button-container1">
                        <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Actualizar</a>
                    </div>

                </form>

                {/* Modal para actualizar info de usuario */}
                <div id="modal1" className="modal">
                    <div className="modal-contentperfil">
                        <br /><h4 style={{ textAlign: 'center' }}>Actualizar Información</h4><br />
                        <form className="col s12" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="input-fieldperfil col s12">
                                    <label htmlFor="correo">Correo Electrónico</label>
                                    <i className="material-icons prefix">email</i>
                                    <input
                                        id="correo"
                                        type="email"
                                        className="validate"
                                        value={selectedCorreo}
                                        onChange={(e) => setSelectedCorreo(e.target.value)}
                                    />

                                </div>
                            </div>
                            <div className="row">
                                <div className="input-fieldperfil col s12">
                                    <label htmlFor="nombre">Nombre</label>
                                    <i className="material-icons prefix">person</i>
                                    <input
                                        id="nombre"
                                        type="text"
                                        className="validate"
                                        value={selectedNombre}
                                        onChange={(e) => setSelectedNombre(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-fieldperfil col s12">
                                    <label htmlFor="direccion">Dirección</label>
                                    <i className="material-icons prefix">location_on</i>
                                    <input
                                        id="direccion"
                                        type="text"
                                        className="validate"
                                        value={selectedDireccion}
                                        onChange={(e) => setSelectedDireccion(e.target.value)}
                                    />
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
                            </div><br />
                            <div className="modal-footer">
                                <button type="submit" className="btn" style={{ marginRight: '15px' }}>
                                    Enviar
                                    <i className="material-icons right">send</i>
                                </button>
                                <a className="modal-close btn" style={{ marginRight: '30px' }}>Cerrar</a>
                            </div><br />
                        </form>
                    </div>
                </div>


            </div>


            {/*modal de informacion  */}
            <div id="info" className="containerinfo">
                <h2>Información Adicional</h2><br />
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">CV</span>

                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            accept=".pdf"  // Permitir solo documentos
                            onChange={handleFileChange2}
                        />
                        <button
                            type="button"
                            className="btn waves-effect waves-light right btn-upload"
                            style={{ marginRight: '15px' }}
                            onClick={() => document.getElementById('fileInput')?.click()} >
                            Subir o actualizar CV
                            <i className="material-icons right">add</i>
                        </button>
                        <p>Curriculum Vitae actualizado para sus futuras postulaciones</p><br />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Experiencia laboral reciente</span>
                        <a
                            className=" btn-floating waves-effect waves-light btn-add right modal-trigger  "
                            data-target="modalExp"
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="material-icons">add</i>
                        </a>
                        <p>Experiencia laboral adquirida de su último trabajo.</p><br />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Habilidades</span>
                        <a
                            className=" btn-floating waves-effect waves-light btn-add right modal-trigger  "
                            data-target="modalHab"
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="material-icons">add</i>
                        </a>
                        <p>Habilidades con las que cuenta. Ej: Trabajo en equipo, adaptabilidad, etc.</p><br />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Educación</span>
                        <a
                            className=" btn-floating waves-effect waves-light btn-add right modal-trigger  "
                            data-target="modalEdu"
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="material-icons">add</i>
                        </a>
                        <p>Último nivel de estudios.</p><br />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Idioma</span>
                        <a className="btn-floating btn-medium waves-effect waves-light right btn-add">
                            <i className="material-icons">add</i>
                        </a>

                        <p>Idiomas y nivel de conocimiento</p><br />
                    </div>
                </div> 
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Cursos y certificaciones</span>
                        <a className="btn-floating btn-medium waves-effect waves-light right btn-add">
                            <i className="material-icons">add</i>
                        </a>
                        <p>Cursos adicionales o certificados que respalden sus conocimientos.</p><br />
                    </div>
                </div>


        {/* Modal para experiencia */}
                <div id="modalExp" className="modal">
                    <div className="modal-contentperfil">
                        <br />
                        <h4 style={{ textAlign: 'center' }}>Experiencia profesional</h4><br />
                        <form className="col s12" onSubmit={actualizarExp}>
                            <div className="input-fieldExp col s12">
                                <label htmlFor="empresa" className={experiencia?.empresa ? 'active' : ''}>Empresa</label>
                                <i className="material-icons prefix">business</i>
                                <input
                                    id="empresa"
                                    type="text"
                                    className="validate"
                                    value={experiencia?.empresa || ''}
                                    onChange={(e) => setExperiencia({ ...experiencia, empresa: e.target.value } as Experiencia)}
                                    required
                                />
                            </div>
                            <div className="input-fieldExp col s12">
                                <label htmlFor="puesto" className={experiencia?.puesto ? 'active' : ''}>Puesto</label>
                                <i className="material-icons prefix">work</i>
                                <input
                                    id="puesto"
                                    type="text"
                                    className="validate"
                                    value={experiencia?.puesto || ''}
                                    onChange={(e) => setExperiencia({ ...experiencia, puesto: e.target.value } as Experiencia)}
                                    required
                                />
                            </div>

                            <br /><br />
                            <div className="input-fieldExp col s12">
                                <label htmlFor="descripcion" className={experiencia?.descripcion ? 'active' : ''}>Descripción de actividades</label>
                                <i id= "descrip" className="material-icons prefix">description</i>
                                <textarea
                                    id="descripcion"
                                    className="materialize-textarea validate"
                                    value={experiencia?.descripcion || ''}
                                    onChange={(e) => setExperiencia({ ...experiencia, descripcion: e.target.value } as Experiencia)}
                                    required
                                ></textarea>
                            </div><br />

                            <div className="modal-footer">
                                <button
                                    type="submit"
                                    className="waves-effect waves-light btn"
                                    style={{ marginRight: '15px' }}
                                >
                                    Enviar
                                    <i className="material-icons right">send</i>
                                </button>
                                <a
                                    href="#!"
                                    className="modal-close waves-effect waves-light btn"
                                    style={{ marginRight: '30px' }}
                                >
                                    Cerrar
                                </a>
                            </div>
                        </form>
                    </div>
                </div>



                <div id="modalHab" className="modal">
                    <div className="modal-contentperfil">
                        <h4 style={{ textAlign: 'center' }}>Habilidades</h4>
                        <form className="col s12" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-fieldModal col s12">
                                <i className="material-icons prefix">format_list_bulleted</i>
                                <input
                                    id="habilidad"
                                    type="text"
                                    className="validate"
                                    value={habilidad}
                                    onChange={(e) => setHabilidad(e.target.value)}
                                    required
                                />
                                <label htmlFor="habilidad">Habilidad</label>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ marginRight: '15px' }}
                                    onClick={handleAgregarHabilidad}
                                >
                                    Agregar
                                    <i className="material-icons right">add</i>
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ marginRight: '15px' }}
                                    onClick={handleEnviarHabilidades}
                                >
                                    Enviar
                                    <i className="material-icons right">send</i>
                                </button>
                                <a
                                    href="#!"
                                    className="modal-close btn"
                                    style={{ marginRight: '30px' }}
                                    onClick={handleCloseHab}
                                >
                                    Cerrar
                                </a>
                            </div>
                        </form>

                        {/* Lista de habilidades agregadas con estilo */}
                        <div className="habilidades-list">
                            {habilidades.map((hab, index) => (
                                <div key={index} className="habilidad-item">
                                    {hab.descripcion}  {/* Muestra solo la descripción */}
                                    <i
                                        className="material-icons delete-icon"
                                        onClick={() => eliminarHabilidad(index)}
                                    >
                                        close
                                    </i>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>



                {/* Modal para Educacion */}
                <div id="modalEdu" className="modal">
                    <div className="modal-contentEdu">
                        <br /><h4 style={{ textAlign: 'center' }}>Último nivel de estudios cursado</h4><br />
                        <form className="col s12" onSubmit={actualizarEdu}>
                            <div className="input-fieldEdu col s12">
                                <label htmlFor="nivel" className={educacionUsuario?.nivel ? 'active' : ''}>Nivel</label>
                                <i className="material-icons prefix">school</i>
                                <select
                                    id="nivel"
                                    value={selectedEducacion}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedEducacion(newValue);
                                        setEduUsu((prevState) => ({
                                            ...prevState,
                                            nivel: newValue
                                        }) as EducacionUsuario);
                                    }}
                                >
                                    {educacion.map((edu) => (
                                        <option key={edu.nivel} value={edu.nivel}>
                                            {edu.nivel}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="input-fieldEdu col s12">
                                <br /><label htmlFor="institucion" className={educacionUsuario?.institucion ? 'active' : ''}>Institución</label>
                                <i className="material-icons prefix">location_city</i>
                                <input
                                    id="institucion"
                                    type="text"
                                    className="validate"
                                    value={educacionUsuario?.institucion || ''}
                                    onChange={(e) => setEduUsu({ ...educacionUsuario, institucion: e.target.value } as EducacionUsuario)}
                                    required
                                />
                            </div>
                            <div className="input-fieldEdu col s12">
                                <label htmlFor="carrera" className={educacionUsuario?.carrera ? 'active' : ''}>Título o carrera</label>
                                <i className="material-icons prefix">work</i>
                                <input
                                    id="carrera"
                                    type="text"
                                    className="validate"
                                    value={educacionUsuario?.carrera || ''}
                                    onChange={(e) => setEduUsu({ ...educacionUsuario, carrera: e.target.value } as EducacionUsuario)}
                                    required
                                />
                            </div>


                            <br /><div className="modal-footer">
                                <button
                                    type="submit"
                                    className="waves-effect waves-light btn "
                                    style={{ marginRight: '15px' }}
                                >
                                    Enviar
                                    <i className="material-icons right">send</i>
                                </button>
                                <a
                                    href="#!"
                                    className="modal-close  btn "
                                    style={{ marginRight: '30px' }}
                                >
                                    Cerrar
                                </a>
                            </div><br />
                        </form>
                    </div>
                </div>


            </div>


        </DefaultLayout>
    );
}
