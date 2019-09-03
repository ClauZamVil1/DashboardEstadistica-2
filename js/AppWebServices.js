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

        var datos = obtenerDatosBackendWalmart(12,0,0);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;

                $("#contendorDash").append(creaHtml(1));
                $("#contendorDash2").append(creaHtml2(2));

                if(value.estadoGral=="nor"){
                    $("#tdEstadoGeneral_1").html("Normal");   
                }else if(value.estadoGral=="ale"){
                    $("#tdEstadoGeneral_1").html("Alerta");
                }else{$("#tdEstadoGeneral_1").html("Falla");}
                
                $("#tdTotAcumu_1").html(value.totalAcumulado); 
                $("#tdTotErrAcumu_1").html(value.totalErrAcumulado); 
                $("#tdTotUltHora_1").html(value.totalUltHora); 
                $("#tdTotErrUltHora_1").html(value.totalErrUltHora);
                $("#tdTotUlt5Min_1").html(value.totalUltCincoMin);
                $("#tdTotErrUlt5Min_1").html(value.totalErrUltCincoMin);
                $("#tdTotClientesUlt5Min_1").html(value.totalClienteUlt5Min);

                creaGraficoClientes(2,value.clientesXMinuto);
                creaGraficoTransacciones(3,value.transaccionesXMinuto);
            });
        }

    } catch (e) {

    }

}

function actualizaNivelBackend(){

    debugger;
    try{

        var datos = obtenerDatosBackendWalmart(12,0,0);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;

                if(value.estadoGral=="nor"){
                    $("#tdEstadoGeneral_1").html("Normal");   
                }else if(value.estadoGral=="ale"){
                    $("#tdEstadoGeneral_1").html("Alerta");
                }else{$("#tdEstadoGeneral_1").html("Falla");}
                
                $("#tdTotAcumu_1").html(value.totalAcumulado); 
                $("#tdTotErrAcumu_1").html(value.totalErrAcumulado); 
                $("#tdTotUltHora_1").html(value.totalUltHora); 
                $("#tdTotErrUltHora_1").html(value.totalErrUltHora);
                $("#tdTotUlt5Min_1").html(value.totalUltCincoMin);
                $("#tdTotErrUlt5Min_1").html(value.totalErrUltCincoMin);
                $("#tdTotClientesUlt5Min_1").html(value.totalClienteUlt5Min);

                if(parseInt(value.clientesXMinuto)>parseInt(maximosClientesXMinuto)){
                    creaGraficoClientes(2,value.clientesXMinuto);
                    creaGraficoTransacciones(3,value.transaccionesXMinuto);
                }else{
                    var puntoClientes, puntoTransacciones;
                    if(chartRpm){
                        puntoClientes = chartRpm.series[0].points[0];
                        puntoClientes.update(value.transaccionesXMinuto);
                    }

                    if(chartSpeed){
                        puntoTransacciones = chartSpeed.series[0].points[0];  
                        puntoTransacciones.update(value.clientesXMinuto);
                    }
                    
                    
                }

                
            });
        }

    } catch (e) {

    }

}

function creaHtml(i) {
    var cadena = "";

    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';

    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Indicadores del Back End</div>';
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

    cadena += '</div>';
    cadena += '</div>';



   
    return cadena;
}

function creaHtml2(i) {
    var cadena = "";
    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';
    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Graficos Back End</div>';
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


function creaGraficoClientes(i, clientesXMinuto) {

    debugger;

    if(parseInt(clientesXMinuto)>parseInt(maximosClientesXMinuto)){
        maximosClientesXMinuto=clientesXMinuto;
    }

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: false,

        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    }

    // The speed gauge
    chartSpeed = Highcharts.chart('container_gauge_'+i, Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: [maximosClientesXMinuto],
            title: {
                text: ''
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'clientesxminuto',
            data: [clientesXMinuto],
            dataLabels: {
                format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:25px">{y}</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4">Clientes/Min</span>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: ' Clientes/Minuto'
            }
        }]

    }));
}

function creaGraficoTransacciones(i, transaccionesXMinuto) {

    debugger;

    if(parseInt(transaccionesXMinuto)>parseInt(maximasTransaccionesXMinuto)){
        maximasTransaccionesXMinuto=transaccionesXMinuto;
    }

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: false,

        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    }

    // The speed gauge
    chartRpm = Highcharts.chart('container_gauge_'+i, Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: [maximasTransaccionesXMinuto],
            title: {
                text: ''
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'transaccionestesxminuto',
            data: [transaccionesXMinuto],
            dataLabels: {
                format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:25px">{y}</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4">Transacciones/Min</span>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: ' Transacciones/Minuto'
            }
        }]

    }));
}



function verDetalle(i) {
    $("#myModal").modal('show');
    var idtipoequipo = $("#validTipoEquipo_" + i).html();
    var equidescrip = $("#valEquipoDescripcion_" + i).html();
    //vars = _idtipoequipo + '&' + idzona + "&" + _tituloSeleccionado + '&' + valdesczona;
    vars = "equipo=" + idtipoequipo + '&desequipo=' + equidescrip;
    setTimeout(function () { window.location.href = "../Zonas/indexZonas.htm?" + vars; }, 1000);
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

function irServidores(){
    setTimeout(function () {window.location.href = "../WebServices/indexServidores.htm";}, 1000);
}


setInterval(function(){
    $("#myModal").modal('show');
    actualizaNivelBackend();
    $("#myModal").modal('hide');
},300000)

