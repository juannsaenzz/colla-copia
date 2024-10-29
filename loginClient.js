const formE1 = document.querySelector('.form');

/*---Intercepta el submit del formulario---*/
formE1.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(formE1);
    const data = Object.fromEntries(formData);
    console.log('Revisa el valor del form');
    console.log(data);

    /*--- Realiza validaciones en los datos del formulario antes de procesar ---*/
    if (data.email == '' || data.password == '') {
        console.log('Debe indicar correo y password');
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').style.textAlign = "center";
        document.getElementById('resultado').textContent = 'Debe informar correo y password para completar el acceso';
        return;
    }

    if (data.email == 'pec') {
        console.log('pec no es bienvenido en este sistema');
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').style.textAlign = "center";
        document.getElementById('resultado').textContent = 'El usuario <pec> no es bienvenido en este sistema';
        return;
    }

    if (data.termscondition != 'on') {
        console.log('No aceptó los T&C, no se puede loggear');
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').style.textAlign = "center";
        document.getElementById('resultado').textContent = 'Debe aceptar los T&C para poder usar el sistema';
        return;
    }

    /*--- Configura la URL de la API para el login por correo electrónico ---*/
    const RESTAPI = {
        loginClienteEmail: "http://localhost:8080/api/loginClienteEmail",
        loginCliente    : "http://127.0.0.1:8080/api/loginCliente",
            listarTicket    : "http://localhost:8080/api/listarTicket",
            addCliente      : "http://localhost:8080/api/addCliente",
            getTicket       : "http://localhost:8080/api/getTicket",
            updateTicket    : "http://localhost:8080/api/updateTicket",
            getCliente      : "http://localhost:8080/api/getCliente",
            updateCliente   : "http://localhost:8080/api/updateCliente"
    };

    // Construye la URL con los parámetros para el método GET
    const queryParams = new URLSearchParams({
        contacto: data.email,
        password: data.password
    });
    const API = `${RESTAPI.loginClienteEmail}?${queryParams.toString()}`;

    console.log("API REST:", API);

    /*--- Realiza el acceso al API REST utilizando gestión de sincronización mediante promesas ---*/
    fetch(API, { method: 'GET' })
    .then(res => res.json())
    .then(users => {
        console.log("Datos enviados por NodeJS local server=" + JSON.stringify(users));
        if (users.response == 'OK') {
            console.log('La password es correcta');
            document.getElementById('resultado').style.color = "BLACK";
            document.getElementById('resultado').textContent = `Bienvenido al sistema ${users.nombre}, último ingreso ${users.fecha_ultimo_ingreso}`;
            const redirectURL = `${systemURL.listarTicket}?id=${users.id}&contacto=${users.contacto}&nombre=${users.nombre}&fecha_ultimo_ingreso=${users.fecha_ultimo_ingreso}`;
            window.location.href = redirectURL;
        } else {
            console.log('La password no es correcta');
            document.getElementById('resultado').style.color = "RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent = 'Error de login, intente nuevamente';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').textContent = 'Error de sistema, intente más tarde';
    });
});

/* Define systemURL en algún lugar antes de su uso */
const systemURL={ 
    listarTicket: "http://127.0.0.1:5500/listarTicket.html",
    listarTicket    : "http://127.0.0.1:5500/listarTicket.html",
    addTicket       : "http://127.0.0.1:5500/addTicket.html",
    updateTicket    : "http://127.0.0.1:5500/updateTicket.html",
    loginCliente    : "http://127.0.0.1:5500/loginClient.html",
    updateCliente   : "http://127.0.0.1:5500/updateCliente.html",
    addCliente      : "http://127.0.0.1:5500/addCliente.html",
    resetCliente    : "http://127.0.0.1:5500/resetCliente.html"
};


