/*---
Función para procesar los parámetros recibidos en el URL
*/
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

/*---
Extrae del URL el id de cliente ya validado, su nombre, contacto y la última fecha de login, actualiza el banner de seguridad
*/

console.log("Comienza listarTicket.js");

var query = getQueryParams(document.location.search);
console.log("id:"+query.id);
console.log("contacto:"+query.contacto);
console.log("nombre:"+query.nombre);
console.log("ultima_fecha:"+query.fecha_ultimo_ingreso);

// Actualiza el HTML con la información del cliente obtenida desde el URL
document.getElementById("lastlogin").innerHTML = `
<table>
    <tr><td>Cliente ID</td><td>${query.id}</td></tr>
    <tr><td>Contacto</td><td>${query.contacto}</td></tr>
    <tr><td>Nombre</td><td>${query.nombre}</td></tr>
    <tr><td>Último ingreso</td><td>${query.fecha_ultimo_ingreso}</td></tr>
</table>`;


/*---
Accede a la REST API para obtener los tickets
*/

const HTMLResponse = document.querySelector("#app");

const RESTAPI = {
    listarTicket: "http://localhost:8080/api/listarTicket",
};

// Parámetros para la API, que ahora incluyen el clienteID
const clienteID = query.id;

const ticket = {
    "clienteID": clienteID,
};

const options = {
    method: 'POST',  // Asumiendo que listar tickets sigue siendo POST
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
};

console.log("API_listarTicket:" + RESTAPI.listarTicket);    
console.log("ticket  :" + JSON.stringify(ticket));
console.log("options :" + JSON.stringify(options));

fetch(`${RESTAPI.listarTicket}`, options)
.then(res => res.json())
.then(ticketData => {
    console.log(ticketData);
    let hasTickets = false;
    let table = document.createElement("table");
    table.style.border = "1px solid";
    table.style.backgroundColor = "#FFFFFF";

    // Si el cliente tiene tickets, crea una tabla con los detalles
    ticketData.data.forEach(t => {
        if (t.clienteID == query.id) {
            if (!hasTickets) {
                hasTickets = true;
                const headers = ["Cliente", "ID", "Motivo", "Estado", "Fecha"];
                let headerRow = document.createElement("tr");
                headerRow.style.border = "1px solid";
                headers.forEach(header => {
                    let th = document.createElement("th");
                    th.style.border = "1px solid";
                    th.innerText = header;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);                   
            }

            const body = [t.clienteID, t.id, t.solucion, t.estado_solucion, t.ultimo_contacto];
            let row = document.createElement("tr");
            body.forEach(cell => {
                let td = document.createElement("td");
                td.style.border = "1px solid";
                td.innerText = cell;
                row.appendChild(td);
            });
            table.appendChild(row);                   
        }
    });

    if (hasTickets) {
        console.log(table);
        HTMLResponse.appendChild(table);
    } else {
        console.log("No tiene tickets");
        document.getElementById('mensajes').style.textAlign = "center";
        document.getElementById('mensajes').style.color = "RED";
        document.getElementById("mensajes").innerHTML = "No hay tickets pendientes";
    }
})
.catch(error => {
    console.error("Error fetching tickets:", error);
    document.getElementById("mensajes").innerHTML = "Error al cargar los tickets, intente más tarde.";
});
