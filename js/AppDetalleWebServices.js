/**********
Versión: 1.0.0
Fecha Modificación: 03-09-2018
Creado Por: Sebastian Garcés
Modificado por: Sebastian Garcés
***********/


var _numDias = 0;
var _tituloSeleccionado = "";
var _idServidor = "";
var _nombreServidor = "";
var arregloCategorias = [], arregloTotalesAcumulados = [], arregloTotalesUltHora = [],
arregloTotalesUltCincoMin = [], arregloErroresAcumulados = [], arregloErroresUltHora = [],
arregloErroresUltCincoMin = [];



$(document).ready(function () {
    //$("#myModal").modal('show');
    _tituloSeleccionado = "Monitoreo en Línea - Hoy";
    _idServidor = $.get("idServer");
    _nombreServidor = $.get("nombreServer");
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

        var datos = obtenerDatosBackendWalmart(12,2,_idServidor);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;
                arregloCategorias.push([value.descNodoNivel]);
                arregloTotalesAcumulados.push([,value.totalAcumulado]);
                arregloTotalesUltHora.push([,value.totalUltHora]);
                arregloTotalesUltCincoMin.push([,value.totalUltCincoMin]);
                arregloErroresAcumulados.push([value.totalErrAcumulado]);                
                arregloErroresUltHora.push([value.totalErrUltHora]);                
                arregloErroresUltCincoMin.push([value.totalErrUltCincoMin]);                
            });

        }
        debugger;
        
        $("#contendorDashGrafico1").append(creaHtmlGrafico(1));
        $("#tituloGraficos_1").html("Transacciones totales "+_nombreServidor);
        creaGraficoBarraTotales(1);

        $("#contendorDashGrafico2").append(creaHtmlGrafico(2));
        $("#tituloGraficos_2").html("Errores totales "+_nombreServidor);
        creaGraficoBarraErrores(2);

    } catch (e) {

    }

}

function actualizaNivelBackend(){

    debugger;
    limpiarArreglos();
    try{

        var datos = obtenerDatosBackendWalmart(12,2,_idServidor);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;
                arregloCategorias.push([value.descNodoNivel]);
                arregloTotalesAcumulados.push([,value.totalAcumulado]);
                arregloTotalesUltHora.push([,value.totalUltHora]);
                arregloTotalesUltCincoMin.push([,value.totalUltCincoMin]);
                arregloErroresAcumulados.push([value.totalErrAcumulado]);                
                arregloErroresUltHora.push([value.totalErrUltHora]);                
                arregloErroresUltCincoMin.push([value.totalErrUltCincoMin]);                
            });

        }
        debugger;
        
        creaGraficoBarraTotales(1);
        creaGraficoBarraErrores(2);

    } catch (e) {

    }


}

function creaHtmlGrafico(i) {
    var cadena = "";
    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';
    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="tituloGraficos_' + i + '"></div>';
    //cadena += '<div class="col-xs-12 col-sm-4 col-md-12 col-lg-12 box-macro-total">';
    cadena += '<div class="container_gauge_cont">';
    cadena += '<div class="col-lg-12 col-md-12">';
    cadena += '<div id="container_gauge_' + i + '" class="container_gauge_style">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';

    return cadena;
}




function creaGraficoBarraTotales(i) {

    debugger;

    Highcharts.chart('container_gauge_'+i, {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Transacciones totales'
        },
        xAxis: {
            categories: arregloCategorias,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Numero de transacciones',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total Acumulado',
            data: arregloTotalesAcumulados,
            color: '#1335F3'
        }, {
            name: 'Total Ultima Hora',
            data: arregloTotalesUltHora,
            color: '#13B3F3'
        }, {
            name: 'Total Ultimos 5 Minutos',
            data: arregloTotalesUltCincoMin,
            color: '#0FF0A8'
        }]
    });
}

function creaGraficoBarraErrores(i) {

    debugger;

    Highcharts.chart('container_gauge_'+i, {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Errores totales'
        },
        xAxis: {
            categories: arregloCategorias,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Numero de errores',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Errores Acumulados',
            data: arregloErroresAcumulados,
            color: '#D63614'
        }, {
            name: 'Errores Ultima Hora',
            data: arregloErroresUltHora,
            color: '#EC9321'
        }, {
            name: 'Errores Ultimos 5 Minutos',
            data: arregloErroresUltCincoMin,
            color: '#F2EF1B'
        }]
    });
}

function limpiarArreglos(){

    arregloCategorias = [];
    arregloTotalesAcumulados = [];
    arregloTotalesUltHora = [];
    arregloTotalesUltCincoMin = [];
    arregloErroresAcumulados = [];
    arregloErroresUltHora = [];
    arregloErroresUltCincoMin = [];

}


function verDetalle(servidor) {
    $("#myModal").modal('show');
    var idServer;
    if(servidor==1){
        idServer="D";
    }else{idServer="L";}
    setTimeout(function () { window.location.href = "../WebServices/indexDetalleServidores.htm?servidor=" + idServer; }, 1000);
}

setInterval(function(){
    $("#myModal").modal('show');
    actualizaNivelBackend();
    $("#myModal").modal('hide');
},300000)

