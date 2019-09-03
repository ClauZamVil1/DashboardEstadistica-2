/**********
Versión: 1.0.0
Fecha Modificación: 03-09-2018
Creado Por: Sebastian Garcés
Modificado por: Sebastian Garcés
***********/


var _numDias = 0;
var _tituloSeleccionado = "";
var maximosClientesXMinuto = 0;
var maximasTransaccionesXMinuto = 0;
var chartRpm, chartSpeed;

var estadoDanu = "nor", totAcumuDanu=0, totErrAcumuDanu=0, totUltHoraDanu=0,
totErrUltHoraDanu=0, totUlt5MinDanu=0, totErrUlt5MinDanu=0, totClientesUlt5MinDanu=0,
clientesXMinutoDanu=0, transaccionesXMinutoDanu=0;
var estadoLier = "nor", totAcumuLier=0, totErrAcumuLier=0, totUltHoraLier=0,
totErrUltHoraLier=0, totUlt5MinLier=0, totErrUlt5MinLier=0, totClientesUlt5MinLier=0,
clientesXMinutoLier=0, transaccionesXMinutoLier=0;


$(document).ready(function () {
    //$("#myModal").modal('show');
    _tituloSeleccionado = "Monitoreo en Línea - Hoy";
    cargaNivelBackend();
});

function mostrarMensaje(tipo, mensaje) {
    if (tipo == "OK") alertify.success("<b>OK</b>  " + mensaje);
    else if (tipo == "ERROR") alertify.error("<b>ERROR</b>  " + mensaje);
    else if (tipo == "ADVERTENCIA") alertify.alert("<b>ADVERTENCIA</b>  " + mensaje);
    else if (tipo == "NOTIFICACION") alertify.log("<b>ATENCIÓN</b>  " + mensaje);
}


//Funcion que se encarga de consultar datos de backend en servicio
function cargaNivelBackend(){

    debugger;
    try{

        var datos = obtenerDatosBackendWalmart(12,1,0);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;

                if(value.descNodoNivel.indexOf("Danu")!==-1){
                    if(value.estadoGral=="fal"){
                        estadoDanu="fal";
                    }
                    totAcumuDanu+=parseInt(value.totalAcumulado);
                    totErrAcumuDanu+=parseInt(value.totalErrAcumulado);
                    totUltHoraDanu+=parseInt(value.totalUltHora);
                    totErrUltHoraDanu+=parseInt(value.totalErrUltHora);
                    totUlt5MinDanu+=parseInt(value.totalUltCincoMin);
                    totErrUlt5MinDanu+=parseInt(value.totalErrUltCincoMin);
                    totClientesUlt5MinDanu+=parseInt(value.totalClienteUlt5Min);
                    clientesXMinutoDanu+=parseFloat(value.clientesXMinuto);
                    transaccionesXMinutoDanu+=parseFloat(value.transaccionesXMinuto);
                }

                if(value.descNodoNivel.indexOf("Leir")!==-1){
                    if(value.estadoGral=="fal"){
                        estadoLier="fal";
                    }
                    totAcumuLier+=parseInt(value.totalAcumulado);
                    totErrAcumuLier+=parseInt(value.totalErrAcumulado);
                    totUltHoraLier+=parseInt(value.totalUltHora);
                    totErrUltHoraLier+=parseInt(value.totalErrUltHora);
                    totUlt5MinLier+=parseInt(value.totalUltCincoMin);
                    totErrUlt5MinLier+=parseInt(value.totalErrUltCincoMin);
                    totClientesUlt5MinLier+=parseInt(value.totalClienteUlt5Min);
                    clientesXMinutoLier+=parseFloat(value.clientesXMinuto);
                    transaccionesXMinutoLier+=parseFloat(value.transaccionesXMinuto);
                }
                
            });

            $("#contendorDash").append(creaHtmlDanu(1));
            //$("#contendorDash2").append(creaHtmlDanu2(2));
            $("#contendorDash3").append(creaHtmlLeir(3));
            //$("#contendorDash4").append(creaHtmlLeir2(4));

            //Danu   
            if(estadoDanu=="nor"){
                $("#tdEstadoGeneral_1").html("Normal");   
            }else if(estadoDanu=="ale"){
                $("#tdEstadoGeneral_1").html("Alerta");
            }else{$("#tdEstadoGeneral_1").html("Falla");}
            
            $("#tdTotAcumu_1").html(totAcumuDanu); 
            $("#tdTotErrAcumu_1").html(totErrAcumuDanu); 
            $("#tdTotUltHora_1").html(totUltHoraDanu); 
            $("#tdTotErrUltHora_1").html(totErrUltHoraDanu);
            $("#tdTotUlt5Min_1").html(totUlt5MinDanu);
            $("#tdTotErrUlt5Min_1").html(totErrUlt5MinDanu);
            $("#tdTotClientesUlt5Min_1").html(totClientesUlt5MinDanu);

            //creaGraficoClientes(2,clientesXMinutoDanu);
            //creaGraficoTransacciones(3,transaccionesXMinutoDanu);

            //Leir 
            if(estadoLier=="nor"){
                $("#tdEstadoGeneralL_3").html("Normal");   
            }else if(estadoLier=="ale"){
                $("#tdEstadoGeneralL_3").html("Alerta");
            }else{$("#tdEstadoGeneralL_3").html("Falla");}
            
            $("#tdTotAcumuL_3").html(totAcumuLier); 
            $("#tdTotErrAcumuL_3").html(totErrAcumuLier); 
            $("#tdTotUltHoraL_3").html(totUltHoraLier); 
            $("#tdTotErrUltHoraL_3").html(totErrUltHoraLier);
            $("#tdTotUlt5MinL_3").html(totUlt5MinLier);
            $("#tdTotErrUlt5MinL_3").html(totErrUlt5MinLier);
            $("#tdTotClientesUlt5MinL_3").html(totClientesUlt5MinLier);

        }

    } catch (e) {

    }

}

function actualizaNivelBackend(){

    debugger;
    try{

        limpiarVariables();
        var datos = obtenerDatosBackendWalmart(12,1,0);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;

                if(value.descNodoNivel.indexOf("Danu")!==-1){
                    if(value.estadoGral=="fal"){
                        estadoDanu="fal";
                    }
                    totAcumuDanu+=parseInt(value.totalAcumulado);
                    totErrAcumuDanu+=parseInt(value.totalErrAcumulado);
                    totUltHoraDanu+=parseInt(value.totalUltHora);
                    totErrUltHoraDanu+=parseInt(value.totalErrUltHora);
                    totUlt5MinDanu+=parseInt(value.totalUltCincoMin);
                    totErrUlt5MinDanu+=parseInt(value.totalErrUltCincoMin);
                    totClientesUlt5MinDanu+=parseInt(value.totalClienteUlt5Min);
                    clientesXMinutoDanu+=parseFloat(value.clientesXMinuto);
                    transaccionesXMinutoDanu+=parseFloat(value.transaccionesXMinuto);
                }

                if(value.descNodoNivel.indexOf("Leir")!==-1){
                    if(value.estadoGral=="fal"){
                        estadoLier="fal";
                    }
                    totAcumuLier+=parseInt(value.totalAcumulado);
                    totErrAcumuLier+=parseInt(value.totalErrAcumulado);
                    totUltHoraLier+=parseInt(value.totalUltHora);
                    totErrUltHoraLier+=parseInt(value.totalErrUltHora);
                    totUlt5MinLier+=parseInt(value.totalUltCincoMin);
                    totErrUlt5MinLier+=parseInt(value.totalErrUltCincoMin);
                    totClientesUlt5MinLier+=parseInt(value.totalClienteUlt5Min);
                    clientesXMinutoLier+=parseFloat(value.clientesXMinuto);
                    transaccionesXMinutoLier+=parseFloat(value.transaccionesXMinuto);
                }
                
            });

            //Danu   
            if(estadoDanu=="nor"){
                $("#tdEstadoGeneral_1").html("Normal");   
            }else if(estadoDanu=="ale"){
                $("#tdEstadoGeneral_1").html("Alerta");
            }else{$("#tdEstadoGeneral_1").html("Falla");}
            
            $("#tdTotAcumu_1").html(totAcumuDanu); 
            $("#tdTotErrAcumu_1").html(totErrAcumuDanu); 
            $("#tdTotUltHora_1").html(totUltHoraDanu); 
            $("#tdTotErrUltHora_1").html(totErrUltHoraDanu);
            $("#tdTotUlt5Min_1").html(totUlt5MinDanu);
            $("#tdTotErrUlt5Min_1").html(totErrUlt5MinDanu);
            $("#tdTotClientesUlt5Min_1").html(totClientesUlt5MinDanu);

            //creaGraficoClientes(2,clientesXMinutoDanu);
            //creaGraficoTransacciones(3,transaccionesXMinutoDanu);

            //Leir 
            if(estadoLier=="nor"){
                $("#tdEstadoGeneralL_3").html("Normal");   
            }else if(estadoLier=="ale"){
                $("#tdEstadoGeneralL_3").html("Alerta");
            }else{$("#tdEstadoGeneralL_3").html("Falla");}
            
            $("#tdTotAcumuL_3").html(totAcumuLier); 
            $("#tdTotErrAcumuL_3").html(totErrAcumuLier); 
            $("#tdTotUltHoraL_3").html(totUltHoraLier); 
            $("#tdTotErrUltHoraL_3").html(totErrUltHoraLier);
            $("#tdTotUlt5MinL_3").html(totUlt5MinLier);
            $("#tdTotErrUlt5MinL_3").html(totErrUlt5MinLier);
            $("#tdTotClientesUlt5MinL_3").html(totClientesUlt5MinLier);
        }

    } catch (e) {

    }

}

function creaHtmlDanu(i) {
    var cadena = "";

    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';

    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Indicadores de Danu</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-check"></span> Estado General';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdEstadoGeneral_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-plus"></span> Total Acumulado';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotAcumu_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-remove"></span> Total Error Acumulado';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotErrAcumu_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-time"></span> Total Ultima Hora';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotUltHora_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-remove-circle"></span> Total Error Ultima Hora';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotErrUltHora_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-screenshot"></span> Total Ultimos Cinco Minutos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotUlt5Min_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-remove-sign"></span> Total Errores Ultimos Cinco Minutos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotErrUlt5Min_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-user"></span> Total Clientes Ultimos Cinco Minutos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotClientesUlt5Min_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="ver-detalle-boton">';
    cadena += '<button type="button" class="btn" onclick="verDetalle(1);">Ver Danu</button>';
    cadena += '</div></div>';

    cadena += '</div>';
    cadena += '</div>';



   
    return cadena;
}

function creaHtmlDanu2(i) {
    var cadena = "";
    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';
    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Graficos de Danu</div>';
    //cadena += '<div class="col-xs-12 col-sm-4 col-md-12 col-lg-12 box-macro-total">';
    cadena += '<div class="container_gauge_cont">';
    cadena += '<div class="col-lg-6">';
    cadena += '<div id="container_gauge_' + i + '" class="container_gauge_style">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '<div class="col-lg-6">';
    cadena += '<div id="container_gauge_' + (i+1) + '" class="container_gauge_style_r">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    //cadena += '</div>';

    return cadena;
}


function creaHtmlLeir(i) {
    var cadena = "";

    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';

    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Indicadores de Leir</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-check"></span> Estado General';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdEstadoGeneralL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-plus"></span> Total Acumulado';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotAcumuL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-remove"></span> Total Error Acumulado';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotErrAcumuL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-time"></span> Total Ultima Hora';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotUltHoraL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-remove-circle"></span> Total Error Ultima Hora';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotErrUltHoraL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-screenshot"></span> Total Ultimos Cinco Minutos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotUlt5MinL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-remove-sign"></span> Total Errores Ultimos Cinco Minutos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotErrUlt5MinL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-user"></span> Total Clientes Ultimos Cinco Minutos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotClientesUlt5MinL_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';

    cadena += '<div class="ver-detalle-boton">';
    cadena += '<button type="button" class="btn" onclick="verDetalle(2);">Ver Lier</button>';
    cadena += '</div></div>';

    cadena += '</div>';
    cadena += '</div>';

    return cadena;
}

function creaHtmlLeir2(i) {
    var cadena = "";
    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';
    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Graficos de Leir</div>';
    //cadena += '<div class="col-xs-12 col-sm-4 col-md-12 col-lg-12 box-macro-total">';
    cadena += '<div class="container_gauge_cont">';
    cadena += '<div class="col-lg-6">';
    cadena += '<div id="container_gaugeL_' + i + '" class="container_gauge_style">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '<div class="col-lg-6">';
    cadena += '<div id="container_gaugeL_' + (i+1) + '" class="container_gauge_style_r">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    //cadena += '</div>';

    return cadena;
}

function verDetalle(servidor) {
    $("#myModal").modal('show');
    var idServer;
    if(servidor==1){
        idServer="D";
    }else{idServer="L";}
    setTimeout(function () { window.location.href = "../WebServices/indexDetalleServidores.htm?servidor=" + idServer; }, 1000);
}
function VerDetalleTerminales(seleccionado,i) {
    var filtroSeleccionado = 0;
    var idtipoequipo = $("#validTipoEquipo_" + i).html();
    var equidescrip = $("#valEquipoDescripcion_" + i).html();
    if (seleccionado == "TOTAL") {
        filtroSeleccionado = 0;
    }
    else if (seleccionado == "OPERATIVOS") {
        filtroSeleccionado = 1;
    }
    else if (seleccionado == "FALLAS") {
        filtroSeleccionado = 3;
    }
    vars = "equipo=" + idtipoequipo + '&desequipo=' + equidescrip + '&seleccionado=' + filtroSeleccionado + '&titulo=' + equidescrip ;
    window.location.href = "../ReporteDetalle/DetalleTerminalesInformes.html?" + vars;
}

function limpiarVariables(){

    debugger;

    estadoDanu = "nor";
    totAcumuDanu=0;
    totErrAcumuDanu=0;
    totUltHoraDanu=0;
    totErrUltHoraDanu=0;
    totUlt5MinDanu=0;
    totErrUlt5MinDanu=0;
    totClientesUlt5MinDanu=0;
    clientesXMinutoDanu=0;
    transaccionesXMinutoDanu=0;
    estadoLier = "nor";
    totAcumuLier=0;
    totErrAcumuLier=0;
    totUltHoraLier=0;
    totErrUltHoraLier=0;
    totUlt5MinLier=0;
    totErrUlt5MinLier=0;
    totClientesUlt5MinLier=0;
    clientesXMinutoLier=0;
    transaccionesXMinutoLier=0;

}


setInterval(function(){
    $("#myModal").modal('show');
    actualizaNivelBackend();
    $("#myModal").modal('hide');
},300000)

