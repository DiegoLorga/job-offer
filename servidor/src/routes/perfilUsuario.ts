import { Router } from 'express';
import { perfilUsuarioController } from '../controllers/perfilUsuarioController';


class perfilUsuarioRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.put("/actualizarExperiencia/:id_usuario", perfilUsuarioController.actualizarExperiencia);
        this.router.get("/buscarExperiencia/:id_usuario", perfilUsuarioController.buscarExperiencia);
        this.router.put("/actualizarHabilidades/:id_usuario", perfilUsuarioController.actualizarHabilidades);
        this.router.get("/buscarHabilidades/:id_usuario", perfilUsuarioController.buscarHabilidades);
        this.router.post("/crearHabilidades/:id_usuario", perfilUsuarioController.crearHabilidades);
        this.router.delete('/eliminarHabilidad/:id_habilidad', perfilUsuarioController.eliminarHabilidad);
        this.router.put("/actualizarEducacion/:id_usuario", perfilUsuarioController.actualizarEducacion);
        this.router.get("/buscarEducacionUsuario/:id_usuario", perfilUsuarioController.buscarEduUsu);
        this.router.post("/crearIdioma", perfilUsuarioController.createIdioma);
        this.router.get("/listIdiomas", perfilUsuarioController.listIdiomas);
        this.router.post("/crearNivelIdioma", perfilUsuarioController.createNivelIdioma);
        this.router.get("/listNivelIdiomas", perfilUsuarioController.listNivelIdiomas);
        this.router.post("/agregarIdiomasNiveles/:id_usuario",perfilUsuarioController.agregarIdiomasNiveles)
        this.router.get("/idiomas/:id_usuario",perfilUsuarioController.obtenerIdiomasDelUsuario);
        this.router.delete("/eliminarUsuarioIdioma/:_id",perfilUsuarioController.eliminarUsuarioIdioma)
        this.router.post("/",)
        this.router.post("/crearCertificado/:id_usuario", perfilUsuarioController.agregarCertificacion);
        this.router.delete('/eliminarCertificado/:id_certificado', perfilUsuarioController.eliminarCertificado);
        this.router.get("/buscarCertificaciones/:id_usuario", perfilUsuarioController.buscarCertificaciones);
        this.router.get("/buscarCertificacion/:id_usuario", perfilUsuarioController.buscarCertificacion);
        this.router.put("/actualizarCertificado/:id_usuario", perfilUsuarioController.actualizarCertificado);

    }


}
const administradorRoutes = new perfilUsuarioRoutes();
export default administradorRoutes.router;