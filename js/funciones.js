/**********
Versión: 2.1.1
Fecha Modificado: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
***********/
//var url = "http://200.75.29.43:8080/serviciodashboardCoopeuch/";//producción 
//var url = "http://192.168.10.24:8080/serviciodashboardCoopeuch/";//producción interno
//var url = "http://172.29.114.95/ServicioDashBoardCMR_Test/";//Equipo Juan
//var url = "http://localhost:54682/";
//var url = "http://localhost/ServicioDashBoard/";
var url = "http://localhost:54682/";
//var IDCLIENTE = 46; //coopeuch
var IDCLIENTE = 12;

var _jsonNiveles = {
    "nivel": 1,
    "idGrupo": 1,
    "cantDiasHistorial": 30
};

var _jsonSeleccionado = {
    "tipo": 0
};

//**********************
var _tipoInfo = 1;
var _tipoGrafico = 1; //en línea
var _fechaInicio = '1900-01-01';
var _fechaTermino = '1900-01-01';
var _tipoUptime = "com";
var _tipoPer = "tcs";
var _tituloSeleccionado = "";
var _tituloZona = "";

(function ($) {
    $.get = function (key) {
        key = key.replace(/[\[]/, '\\[');
        key = key.replace(/[\]]/, '\\]');
        var pattern = "[\\?&]" + key + "=([^&#]*)";
        var regex = new RegExp(pattern);
        var url = unescape(window.location.href);
        var results = regex.exec(url);
        if (results === null) {
            return null;
        } else {
            return results[1];
        }
    }
})(jQuery);

function getVariables() {
    var regex = /(%20|%3c|%3E|script)/gi
    var query = window.location.search.substring(1);
    query = query.replace(regex, ' ');
    var vars = query.split('&');
    _idtipoequipo = vars[0];
    _idzona = vars[1];
    _tituloSeleccionado = vars[2];
    _tituloZona = vars[3];
}
/*
function getVariables() {
    //[0] = tipo información grafico: 0 cantidad de dias - 1 entre fechas

    var query = window.location.search.substring(1);

    var vars = query.split('&');

    _jsonNiveles = {
        "nivel": vars[2],
        "idGrupo": vars[3],
        "NivelZona": vars[8],
        "NivelSucursal": vars[8],
        "idAgrupadorPadre": vars[5],
        "DescripcionSucursal": vars[9]
    };
    _tipoInfo = vars[0];
    _tipoGrafico = vars[1];
    _fechaInicio = vars[6].toString();
    _fechaTermino = vars[7].toString();
    //_tipoUptime = vars[8].toString();
    //_tipoPer = vars[9].toString();
    _tituloSeleccionado = decodeURIComponent(vars[10].toString());
}
*/
function GetDataURL() {
    var query = window.location.search.substring(1);

    var vars = query.split('&');

    _jsonNiveles = {
        "tipo": vars[0],
        "Zona": vars[1],
        "Sucursal": vars[2]
    };
}

function enviaDetalle(tipoInfo, tipoGrafico, nivel, idGrupo, cantDiasHistorial, idAgrupadorPadre, fechaInicio, fechaTermino, tipoUptime, tipoPer) {
    if (nivel == 0) {
        window.location.href = "../index.htm" + "?" + tipoInfo + "&" + tipoGrafico + "&" + nivel + "&" + idGrupo + "&" + cantDiasHistorial + "&" + idAgrupadorPadre + "&" + fechaInicio + "&" + fechaTermino + "&" + tipoUptime + "&" + tipoPer + "&" + _tituloSeleccionado;
    }
    else if (nivel == 6) {

    }
    else {
        var pag = "";
        var arrPagActual = location.pathname.split("/");
        if (arrPagActual[arrPagActual.length - 2] == "niveles") {
            pag = "index.htm";
        }
        else {
            pag = "niveles/index.htm";
        }
        _jsonNiveles = {
            "nivel": nivel,
            "idGrupo": idGrupo,
            "cantDiasHistorial": cantDiasHistorial,
            "idAgrupadorPadre": idAgrupadorPadre
        };
        window.location.href = pag + "?" + tipoInfo + "&" + tipoGrafico + "&" + nivel + "&" + idGrupo + "&" + cantDiasHistorial + "&" + idAgrupadorPadre + "&" + fechaInicio + "&" + fechaTermino + "&" + tipoUptime + "&" + tipoPer + "&" + _tituloSeleccionado;
    }
}

function formatoMiles(entrada) {
    var num = entrada.toString().replace(/\./g, "");
    if (!isNaN(num)) {
        num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        num = num.split("").reverse().join("").replace(/^[\.]/, "");
        entrada = num;
    }
    else {
        entrada = input.value.replace(/[^\d\.]*/g, "");
    }

    return entrada;
}

function RetornaAJAX(iPagina, iFuncion, iDATA, iEjecucion) {
    debugger;
    var options = {
        async: false,
        crossDomain: true,
        type: 'POST',
        url: iPagina + '/' + iFuncion,
        data: iDATA,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) { },
        error: function (result) {
            alert(result.statusText + ' - ' + result.status);
        }
    }
    return options;
}

function obtenerDatosDashboard(idCliente, idNegocio, nivel, idGrupo) {
    debugger;
    resultado = null;
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "ObtenerInformacionDashBoardWalmart", '{"idCliente": ' + idCliente + ',"idNegocio": ' + idNegocio + ',"nivel": ' + nivel + ',"idGrupo": ' + idGrupo + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        debugger;
        if (result.obtenerInformacionDashBoardWalmartResult != null) {

            oJSON = result.obtenerInformacionDashBoardWalmartResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                ///////if($(this)[0].cantEqEnLinea > 0){//está dejando afuera los equipos que no se encuentran en linea. Hay que validar por tamaño Length
                item = {
                    'cantFichas': $(this)[0].cantFichas,
                    'idcliente': $(this)[0].idcliente,
                    'idNegocio': $(this)[0].idNegocio,
                    'idGrupo': $(this)[0].idGrupo,
                    'idNodoNivel': $(this)[0].idNodoNivel,
                    'descNodoNivel': $(this)[0].descNodoNivel,
                    'totalEqEnLinea': $(this)[0].totalEqEnLinea,
                    'totalEqFueraLinea': $(this)[0].totalEqFueraLinea,
                    'totalEqNoAplica': $(this)[0].totalEqNoAplica,
                    'totalEqAplica': $(this)[0].totalEqAplica,
                    'porcUpTime': $(this)[0].porcUpTime,
                    'porcDWTime': $(this)[0].porcDWTime,
                    'totalEqImpSinPapel': $(this)[0].totalEqImpSinPapel,
                    'totalEqImpAtascada': $(this)[0].totalEqImpAtascada,
                    'totalEqPerifericoErr': $(this)[0].totalEqPerifericoErr
                }
                resultado.push(item);
                ///////}
            });
        }
    });
    return resultado;
}

function obtenerDatosDashboardServiciosEnLinea(idCliente, nivel, idGrupo) {
    resultado = null;
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "obtenerInfoDashBoarServiciosdEnLinea_V2", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idGrupo": ' + idGrupo + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.obtenerInfoDashBoarServiciosdEnLinea_V2Result != null) {
            oJSON = result.obtenerInfoDashBoarServiciosdEnLinea_V2Result;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                if ($(this)[0].totalEquipo > 0) {
                    item = {
                        'totalEquipo': $(this)[0].totalEquipo,
                        'cantEquiposEnLinea': $(this)[0].cantEquiposEnLinea,
                        'cantEquiposFueraDeLinea': $(this)[0].cantEquiposFueraDeLinea,
                        'cantEquiposPendientes': $(this)[0].cantEquiposPendientes,
                        'porcentajeEquiposUpTime': $(this)[0].porcentajeEquiposUpTime,
                        'porcentajeEquiposDownTime': $(this)[0].porcentajeEquiposDownTime,
                        'consImp': $(this)[0].consImp,
                        'consUser': $(this)[0].consUser,
                        'totalLlamadas': $(this)[0].totalLlamadas,
                        'llamadasExitosas': $(this)[0].llamadasExitosas,
                        'fallaIntVideo': $(this)[0].fallaIntVideo,
                        'fallaSinVideo': $(this)[0].fallaSinVideo,
                        'fallaConSIP': $(this)[0].fallaConSIP,
                        'upTimeServicios': $(this)[0].upTimeServicios,
                        'cantImpOK': $(this)[0].cantImpOK,
                        'cantimpirrecuperable': $(this)[0].cantimpirrecuperable,
                        'cantimpTapaAbierta': $(this)[0].cantimpTapaAbierta,
                        'cantimpSinPapel': $(this)[0].cantimpSinPapel,
                        'cantLBMError': $(this)[0].cantLBMError,
                        'cantTouchError': $(this)[0].cantTouchError,
                        'cantCamaraError': $(this)[0].cantCamaraError,
                        'cantLectorPDFError': $(this)[0].cantLectorPDFError,
                        'cantCamaraError': $(this)[0].cantCamaraError,
                        'cantHosError': $(this)[0].cantHosError,
                        'porcDwTimeHOS': $(this)[0].porcDwTimeHOS,
                        'porcimpTapaAbierta': $(this)[0].porcimpTapaAbierta,
                        'porcimpirrecuperable': $(this)[0].porcimpirrecuperable,
                        'porcimpSinPapel': $(this)[0].porcimpSinPapel,
                        'porcDwTimeLBM': $(this)[0].porcDwTimeLBM,
                        'porcDwTimeTouch': $(this)[0].porcDwTimeTouch,
                        'porcDwTimeCamara': $(this)[0].porcDwTimeCamara,
                        'porcEqFueraLineaPend': $(this)[0].porcEqFueraLineaPend,
                        'totales': $(this)[0].totales
                    }
                    resultado.push(item);
                }
            });
        }
    });
    return resultado;
}
/*DETALLE EQUIPOS - MACHVK */
function ObtenerDetalleEquiposXSucursal(idCliente, idSucursal) {
    resultado = null;

    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetDetEquiposXSucursal", '{"idCliente": ' + idCliente + ', "idSucursal": ' + idSucursal + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetDetEquiposXSucursalResult != null) {
            oJSON = result.GetDetEquiposXSucursalResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                resultado.push($(this)[0]);
            });
        }
    });
    return resultado;
}

function GetOrganizaciones(idCliente, nivel, idZonaRetail, idSucursal, estGral, idTipoEquipo) {
    resultado = null;

    if(idTipoEquipo==""){
        idTipoEquipo="T";
    }

    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetOrganizaciones", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idZonaRetail": ' + idZonaRetail + ', "idSucursal": ' + idSucursal + ', "estGral": ' + estGral + ',"idTipoEquipo":"' + idTipoEquipo + '"}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetOrganizacionesResult != null) {
            oJSON = result.GetOrganizacionesResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'idOrganizacion': $(this)[0].idOrganizacion,
                    'nombreOrganizacion': $(this)[0].nombreOrganizacion
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetZonasRetail(idCliente, nivel, idZonaRetail, idSucursal, estGral, idFormato, idTipoEquipo) {
    resultado = null;

    if(idTipoEquipo==""){
        idTipoEquipo="T";
    }

    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetZonasRetail", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idZonaRetail": ' + idZonaRetail + ', "idSucursal": ' + idSucursal + ', "estGral": ' + estGral + ', "idFormato": ' + idFormato + ',"idTipoEquipo":"' + idTipoEquipo + '"}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetZonasRetailResult != null) {
            oJSON = result.GetZonasRetailResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'idZonaComercial': $(this)[0].idZonaComercial,
                    'descripcion': $(this)[0].descripcion
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetSucursales(idCliente, nivel, idFormato, idZonaRetail, idSucursal, estGral,idTipoEquipo) {
    resultado = null;

    if(idTipoEquipo==""){
        idTipoEquipo="T";
    }

    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetSucursales", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idFormato": ' + idFormato + ', "idZonaRetail": ' + idZonaRetail + ', "idSucursal": ' + idSucursal + ', "estGral": ' + estGral + ',"idTipoEquipo":"' + idTipoEquipo + '"}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetSucursalesResult != null) {
            oJSON = result.GetSucursalesResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'idOrganizacion': $(this)[0].idOrganizacion,
                    'idZonaComercial': $(this)[0].idZonaComercial,
                    'idSucursal': $(this)[0].idSucursal,
                    'nombreSucursal': $(this)[0].nombreSucursal
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetTipoTerminales(idCliente, nivel, idFormato, idZonaRetail, idSucursal, estGral) {
    resultado = null;

    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetTipoTerminales", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idFormato": ' + idFormato + ', "idZonaRetail": ' + idZonaRetail + ', "idSucursal": ' + idSucursal + ', "estGral": ' + estGral + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetTipoTerminalesResult != null) {
            oJSON = result.GetTipoTerminalesResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'idEquipo': $(this)[0].idEquipo,
                    'detalleTipoEquipo': $(this)[0].detalleTipoEquipo
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetCondicionMonitoreo(idCliente, estGral, idFormato, idZonaRetail, idSucursal, idTipoTerminal, idCondicionMonitoreo) {
    resultado = null;

    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetCondicionMonitoreo", '{"idCliente": ' + idCliente + ', "estGral": ' + estGral + ', "idFormato": ' + idFormato + ', "idZonaRetail": ' + idZonaRetail + ', "idSucursal": ' + idSucursal + ', "idTipoTerminal": "' + idTipoTerminal + '", "idCondicionMonitoreo": ' + idCondicionMonitoreo + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetCondicionMonitoreoResult != null) {
            oJSON = result.GetCondicionMonitoreoResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'idCondicion': $(this)[0].idCondicion,
                    'detalleCondicionMonitoreo': $(this)[0].detalleCondicionMonitoreo
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetDetalleEquiposXNivel(idCliente, idZonaRetail, idOrganizacion, idSucursal, idEstadoTerminal, idTipoTerminal, idCondicionMonitoreo) {
    debugger;
    resultado = null;
    if(idTipoTerminal==""){
        idTipoTerminal="TODOS";
    }
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetDetalleEquiposXNivel", '{"idCliente": ' + idCliente + ', "idZonaRetail": ' + idZonaRetail + ', "idOrganizacion": ' + idOrganizacion + ', "idSucursal": ' + idSucursal + ', "idEstadoTerminal": ' + idEstadoTerminal + ', "idTipoTerminal": "' + idTipoTerminal + '", "idCondicionMonitoreo": ' + idCondicionMonitoreo + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetDetalleEquiposXNivelResult != null) {
            oJSON = result.GetDetalleEquiposXNivelResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'detOrganizacion': $(this)[0].detOrganizacion,
                    'detZonaComercial': $(this)[0].detZonaComercial,
                    'detSucursal': $(this)[0].detSucursal,
                    'idEquipo': $(this)[0].idEquipo,
                    'detTipoEquipo': $(this)[0].detTipoEquipo,
                    'detEstadoGral': $(this)[0].detEstadoGral,
                    'detCondMonitoreo': $(this)[0].detCondMonitoreo
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetDetalleEquipos(idEquipo) {
    resultado = null;
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetDetalleEquipos", '{"idEquipo": ' + idEquipo + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetDetalleEquiposResult != null) {
            oJSON = result.GetDetalleEquiposResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'direccionIP': $(this)[0].direccionIP,
                    'ubicacion': $(this)[0].ubicacion,
                    'numSerie': $(this)[0].numSerie,
                    'fechaUltimaFalla': $(this)[0].fechaUltimaFalla,
                    'detalle': $(this)[0].detalle,
                    'fechaEvento': $(this)[0].fechaEvento,
                    'comunicacion': $(this)[0].comunicacion,
                    'aplicacion': $(this)[0].aplicacion,
                    'host': $(this)[0].host,
                    'impresora': $(this)[0].impresora,
                    'lbm': $(this)[0].lbm,
                    'touch': $(this)[0].touch,
                    'camara': $(this)[0].camara,
                    'tempCPU': $(this)[0].tempCPU,
                    'usoCPU': $(this)[0].usoCPU,
                    'usoDisco': $(this)[0].usoDisco,
                    'usoMemoria': $(this)[0].usoMemoria
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function GetDetalleTerminalesInforme(idEquipoSeleccionado) {
    resultado = null;
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetDetalleTerminalesInforme", '{"idEquipoSeleccionado": ' + idEquipoSeleccionado + '}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetDetalleTerminalesInformeResult != null) {
            oJSON = result.GetDetalleTerminalesInformeResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                item = {
                    'idUsuario': $(this)[0].idUsuario,
                    'fechaHora': $(this)[0].fechaHora,
                    'tipoEvento': $(this)[0].tipoEvento,
                    'estado': $(this)[0].estado,
                    'descripcion': $(this)[0].descripcion
                }
                resultado.push(item);
            });
        }
    });
    return resultado;
}

function obtenerDatosDashboardEquiposCliente(idCliente, nivel, idGrupo, idTipoEquipo) {
    resultado = null;
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetTipoEquipoCliente", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idGrupo": ' + idGrupo + ',"idTipoEquipo":"' + idTipoEquipo + '"}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetTipoEquipoClienteResult != null) {
            oJSON = result.GetTipoEquipoClienteResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                resultado.push($(this)[0]);
            });
        }
    });
    return resultado;
}
function obtenerDatosDashboardEquiposClienteZona(idCliente, nivel, idGrupo, idTipoEquipo) {
    resultado = null;
    var parametro = RetornaAJAX(url + "obtenerDatos.svc", "GetTipoEquipoClienteZona", '{"idCliente": ' + idCliente + ', "nivel": ' + nivel + ', "idGrupo": ' + idGrupo + ',"idTipoEquipo":"' + idTipoEquipo + '"}', null);
    $.when($.ajax(parametro)).done(function (result) {
        if (result.GetTipoEquipoClienteZonaResult != null) {
            oJSON = result.GetTipoEquipoClienteZonaResult;
            var item;
            resultado = [];
            $(oJSON).each(function () {
                resultado.push($(this)[0]);
            });
        }
    });
    return resultado;
}
function ObtenerValorAtributo(listaComponente, vcomponente, vatributo) {
    var retorno = "";
    $(listaComponente).each(function (key, value) {
        if (value.nombreComponente == vcomponente) {
            $(value.listaAtributo.Lista).each(function (key1, value1) {
                if ($.trim(value1.descTxt) == vatributo) {
                    retorno = value1.valorAtributo
                }

            })
        }
    });
    return retorno;
}