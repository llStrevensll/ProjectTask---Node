import proyectos from './modulos/proyectos.js';
import tareas from './modulos/tareas.js';
import { actualizarAvance } from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})