document.addEventListener('DOMContentLoaded', () => {

    // Funcionamiento del menú lateral de la página principal
    const botonAbrirMenu = document.getElementById('abrirMenu');
    const botonCerrarMenu = document.getElementById('cerrarMenu');
    const menuLateral = document.getElementById('menuLateral');
    const fondoMenu = document.getElementById('fondoMenu');

    function abrirMenu() {
        menuLateral.classList.add('activo');
        fondoMenu.classList.add('activo');
        botonAbrirMenu.setAttribute('aria-expanded', 'true');
    }

    function cerrarMenu() {
        menuLateral.classList.remove('activo');
        fondoMenu.classList.remove('activo');
        botonAbrirMenu.setAttribute('aria-expanded', 'false');
    }

    botonAbrirMenu.addEventListener('click', abrirMenu);
    botonCerrarMenu.addEventListener('click', cerrarMenu);
    fondoMenu.addEventListener('click', cerrarMenu);

    menuLateral.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarMenu();
    });


    const form = document.getElementById('formulario');
    const mensajeExito = document.getElementById('mensaje-exito');
    const modalExito = document.getElementById('modalExito');
    const botonCerrarModal = document.getElementById('btnCerrarModal');

    function cerrarModalYLimpiar() {
        modalExito.style.display = 'none';
        form.reset();
        mensajeExito.textContent = '';
        document.querySelectorAll('#formulario input, #formulario select').forEach(campo => {
            campo.classList.remove('valido', 'invalido');
        });
        document.querySelectorAll('#formulario .error').forEach(error => {
            error.textContent = '';
        });
    }

    botonCerrarModal.addEventListener('click', cerrarModalYLimpiar);
    modalExito.addEventListener('click', (e) => {
        if (e.target === modalExito) cerrarModalYLimpiar();
    });

    // Opciones para los tres selectores de fecha
    const selectorDia = document.getElementById('dia');
    const selectorMes = document.getElementById('mes');
    const selectorAnio = document.getElementById('anio');
    const campoEdad = document.getElementById('edad');
    const errorFecha = document.getElementById('error-fecha');

    for (let dia = 1; dia <= 31; dia++) {
        const opcion = document.createElement('option');
        opcion.value = String(dia).padStart(2, '0');
        opcion.textContent = dia;
        selectorDia.appendChild(opcion);
    }

    const anioActual = new Date().getFullYear();
    for (let anio = anioActual; anio >= 1900; anio--) {
        const opcion = document.createElement('option');
        opcion.value = anio;
        opcion.textContent = anio;
        selectorAnio.appendChild(opcion);
    }

    // Expresiones regulares de validación
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$/;
    const regexEdad = /^[0-9]{1,3}$/; // 1 a 3 números, sin espacios
    const regexTelefono = /^[0-9]{16}$/; // Exactamente 16 números, sin espacios
    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    function mostrarError(campoId, mensaje) {
        const input = document.getElementById(campoId);
        const errorSpan = document.getElementById('error-' + campoId);
        errorSpan.textContent = mensaje;
        input.classList.remove('valido');
        if (mensaje) {
            input.classList.add('invalido');
            return false;
        } else {
            input.classList.remove('invalido');
            if (input.value.trim() !== '') {
                input.classList.add('valido');
            }
            return true;
        }
    }

    function soloPermitirLetras(input) {
        input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g, '');
    }

    function validarSoloLetras(campoId, nombreCampo) {
        const valor = document.getElementById(campoId).value;
        if (valor.trim() === '') return mostrarError(campoId, `${nombreCampo} es obligatorio.`);
        if (valor.startsWith(' ') || valor.endsWith(' ')) return mostrarError(campoId, 'No debe iniciar ni terminar con espacios.');
        if (!regexSoloLetras.test(valor)) return mostrarError(campoId, 'Solo se permiten letras y espacios.');
        return mostrarError(campoId, '');
    }

    function soloPermitirNumeros(input) {
        input.value = input.value.replace(/[^0-9]/g, '');
    }

    function obtenerFechaNacimiento() {
        const dia = Number(selectorDia.value);
        const mes = Number(selectorMes.value);
        const anio = Number(selectorAnio.value);
        if (!dia || !mes || !anio) return null;

        const fecha = new Date(anio, mes - 1, dia);
        // Evita fechas inexistentes, por ejemplo 31 de febrero.
        if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) return null;
        if (fecha > new Date()) return null;
        return fecha;
    }

    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const aunNoCumple = hoy.getMonth() < fechaNacimiento.getMonth() ||
            (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate());
        if (aunNoCumple) edad--;
        return edad;
    }

    function validarFecha() {
        const completa = selectorDia.value && selectorMes.value && selectorAnio.value;
        if (!completa) {
            errorFecha.textContent = 'La fecha de nacimiento es obligatoria.';
            [selectorDia, selectorMes, selectorAnio].forEach(campo => campo.classList.add('invalido'));
            return false;
        }

        if (!obtenerFechaNacimiento()) {
            errorFecha.textContent = 'Selecciona una fecha de nacimiento válida y que no sea futura.';
            [selectorDia, selectorMes, selectorAnio].forEach(campo => campo.classList.add('invalido'));
            return false;
        }

        errorFecha.textContent = '';
        [selectorDia, selectorMes, selectorAnio].forEach(campo => {
            campo.classList.remove('invalido');
            campo.classList.add('valido');
        });
        return true;
    }

    function validarEdad() {
        const valor = campoEdad.value;
        if (valor.trim() === '') return mostrarError('edad', 'La edad es obligatoria.');
        if (valor.includes(' ')) return mostrarError('edad', 'No se permiten espacios.');

        if (/^[0-9]+$/.test(valor) && valor.length > 3) {
            return mostrarError('edad', 'La edad no puede tener más de 3 dígitos.');
        }

        if (!regexEdad.test(valor)) return mostrarError('edad', 'Solo se permiten números.');

        const fechaNacimiento = obtenerFechaNacimiento();
        if (fechaNacimiento) {
            const edadCorrecta = calcularEdad(fechaNacimiento);
            if (Number(valor) !== edadCorrecta) {
                return mostrarError('edad', `La edad no coincide con tu fecha de nacimiento. Debes tener ${edadCorrecta} años.`);
            }
        }
        return mostrarError('edad', '');
    }

    function validarTelefono() {
        const valor = document.getElementById('telefono').value;
        if (valor.trim() === '') return mostrarError('telefono', 'El código de suscripción es obligatorio.');
        if (valor.includes(' ')) return mostrarError('telefono', 'No se permiten espacios.');
        if (!regexTelefono.test(valor)) return mostrarError('telefono', 'El código debe contener 16 dígitos.');
        return mostrarError('telefono', '');
    }

    function validarEmail() {
        const valor = document.getElementById('email').value;
        if (valor.trim() === '') return mostrarError('email', 'El email es obligatorio.');
        if (valor.includes(' ')) return mostrarError('email', 'No se permiten espacios en blanco.');
        if (!regexEmail.test(valor)) return mostrarError('email', 'Ingresa un correo válido. Ej. correo@ejemplo.');
        return mostrarError('email', '');
    }

    // Validación y filtrado en tiempo real mientras escribe.
    // Se fuerza también en 'change' y 'blur' para cubrir pegado/autocompletado.
    const camposDeNombre = [
        ['nombre', 'El nombre'],
        ['apellidoPaterno', 'El apellido paterno'],
        ['apellidoMaterno', 'El apellido materno']
    ];

    camposDeNombre.forEach(([id, etiqueta]) => {
        const campo = document.getElementById(id);
        const normalizar = () => {
            soloPermitirLetras(campo);
            campo.value = campo.value.toLocaleUpperCase('es-MX');
            validarSoloLetras(id, etiqueta);
        };
        campo.addEventListener('input', normalizar);
        campo.addEventListener('change', normalizar);
        campo.addEventListener('blur', normalizar);
    });

    // Edad y código: únicamente dígitos, incluso al pegar texto.
    campoEdad.addEventListener('input', (e) => {
        soloPermitirNumeros(e.target);
        validarEdad();
    });
    campoEdad.addEventListener('change', (e) => {
        soloPermitirNumeros(e.target);
        validarEdad();
    });

    [selectorDia, selectorMes, selectorAnio].forEach(selector => {
        selector.addEventListener('change', () => {
            validarFecha();
            if (campoEdad.value.trim() !== '') validarEdad();
        });
    });

    const campoTelefono = document.getElementById('telefono');
    campoTelefono.addEventListener('input', (e) => {
        soloPermitirNumeros(e.target);
        validarTelefono();
    });
    campoTelefono.addEventListener('change', (e) => {
        soloPermitirNumeros(e.target);
        validarTelefono();
    });

    document.getElementById('email').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z0-9._%+@-]/g, '');
        validarEmail();
    });

    // Validación al enviar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        mensajeExito.textContent = '';

        const v1 = validarSoloLetras('nombre', 'El nombre');
        const v2 = validarSoloLetras('apellidoPaterno', 'El apellido paterno');
        const v3 = validarSoloLetras('apellidoMaterno', 'El apellido materno');
        const v4 = validarFecha();
        const v5 = validarEdad();
        const v6 = validarTelefono();
        const v7 = validarEmail();

        if (v1 && v2 && v3 && v4 && v5 && v6 && v7) {
            modalExito.style.display = 'flex';
            botonCerrarModal.focus();
        } else {
            mensajeExito.textContent = '';
        }
    });
});
