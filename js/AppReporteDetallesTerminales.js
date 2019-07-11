/**********
Versión: 2.2
Fecha Modificado: 19-03-2018
Creado Por: Juan González
Modificado por: Juan González
***********/
var _idEquipoSeleccionado = 0;

$(document).ready(function () {
    debugger;
    GetDataURL();
    _idEquipoSeleccionado = _jsonNiveles.tipo;
    CargaListadoGeneral(_idEquipoSeleccionado);
});

function CargaListadoGeneral(idEquipoSeleccionado){
    var datos = GetDetalleTerminalesInforme(idEquipoSeleccionado);
    var HTMLDiv = "";

    $("#tbDestalle tbody").empty();

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<tr class="detalle_unsel">';
        HTMLDiv +=      '<td>' + datos[i].idUsuario + '</td>';
        HTMLDiv +=      '<td>' + datos[i].fechaHora + '</td>';
        HTMLDiv +=      '<td>' + datos[i].tipoEvento + '</td>';
        HTMLDiv +=      '<td>' + datos[i].estado + '</td>';
        HTMLDiv +=      '<td>' + datos[i].descripcion + '</td>';
        HTMLDiv += '/<tr>';
    }

    $("#tbDestalle tbody").append(HTMLDiv);
}