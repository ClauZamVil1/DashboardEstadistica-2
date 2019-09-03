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
var _idServidor = "", _servidor = "";
var datosGraficoTotAcumu = [], datosGraficoUltHora = [], datosGraficoUlt5Min = [];
var chartTotAcumu, chartUltHora;

$(document).ready(function () {
    //$("#myModal").modal('show');
    _tituloSeleccionado = "Monitoreo en Línea - Hoy";
    _idServidor = $.get("servidor");

    if(_idServidor=="D"){
        $("#tituloprinc").html("<strong>DashBoard Status Danu</strong>");
        _servidor = "Danu";
    }else{
        $("#tituloprinc").html("<strong>DashBoard Status Leir</strong>");
        _servidor = "Leir";
    }
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
    var i=0;
    try{

        $("#contendorDashG1").append(creaHtmlGrafico(1));
        $("#contendorDashG2").append(creaHtmlGrafico(2));
        $("#contendorDashG3").append(creaHtmlGrafico(3));
        $("#tituloGraficos_1").html("Carga Total Acumulada "+_servidor);
        $("#tituloGraficos_2").html("Carga Ultima Hora "+_servidor);
        $("#tituloGraficos_3").html("Carga Ultimos 5 minutos "+_servidor);

        var datos = obtenerDatosBackendWalmart(12,1,0);
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                debugger;
                var splitNombre = value.descNodoNivel.split("_");
                var nombreBox = "Indicadores "+splitNombre[2];

                if(_servidor.indexOf("Danu")!==-1 && value.descNodoNivel.indexOf("Danu")!==-1){
                    i++;
                    $("#contendorDash"+i).append(creaHtml(i));

                    if(value.estadoGral=="nor"){
                        $("#tdEstadoGeneral_"+i).html("Normal");   
                    }else if(value.estadoGral=="ale"){
                        $("#tdEstadoGeneral_"+i).html("Alerta");
                    }else{$("#tdEstadoGeneral_"+i).html("Falla");}
                    
                    $("#tdTotAcumu_"+i).html(value.totalAcumulado); 
                    $("#tdTotErrAcumu_"+i).html(value.totalErrAcumulado); 
                    $("#tdTotUltHora_"+i).html(value.totalUltHora); 
                    $("#tdTotErrUltHora_"+i).html(value.totalErrUltHora);
                    $("#tdTotUlt5Min_"+i).html(value.totalUltCincoMin);
                    $("#tdTotErrUlt5Min_"+i).html(value.totalErrUltCincoMin);
                    $("#tdTotClientesUlt5Min_"+i).html(value.totalClienteUlt5Min);
                    $("#titulo_"+i).html(nombreBox);
                    $("#btnDetalle_"+i).html("Ver "+splitNombre[2]);
                    document.getElementById('btnDetalle_'+i).setAttribute('onclick','verDetalle('+value.idNodoNivel+')');

                    datosGraficoTotAcumu.push([splitNombre[2],value.totalAcumulado,value.idNodoNivel]);
                    datosGraficoUltHora.push([splitNombre[2],value.totalUltHora,value.idNodoNivel]);
                    datosGraficoUlt5Min.push([splitNombre[2],value.totalUltCincoMin],value.idNodoNivel);
                }else if(_servidor.indexOf("Leir")!==-1 && value.descNodoNivel.indexOf("Leir")!==-1){
                    i++;
                    $("#contendorDash"+i).append(creaHtml(i));

                    if(value.estadoGral=="nor"){
                        $("#tdEstadoGeneral_"+i).html("Normal");   
                    }else if(value.estadoGral=="ale"){
                        $("#tdEstadoGeneral_"+i).html("Alerta");
                    }else{$("#tdEstadoGeneral_"+i).html("Falla");}
                    
                    $("#tdTotAcumu_"+i).html(value.totalAcumulado); 
                    $("#tdTotErrAcumu_"+i).html(value.totalErrAcumulado); 
                    $("#tdTotUltHora_"+i).html(value.totalUltHora); 
                    $("#tdTotErrUltHora_"+i).html(value.totalErrUltHora);
                    $("#tdTotUlt5Min_"+i).html(value.totalUltCincoMin);
                    $("#tdTotErrUlt5Min_"+i).html(value.totalErrUltCincoMin);
                    $("#tdTotClientesUlt5Min_"+i).html(value.totalClienteUlt5Min);
                    $("#titulo_"+i).html(nombreBox);
                    $("#btnDetalle_"+i).html("Ver "+splitNombre[2]);
                    document.getElementById('btnDetalle_'+i).setAttribute('onclick','verDetalle('+value.idNodoNivel+')');

                    datosGraficoTotAcumu.push([splitNombre[2],value.totalAcumulado,value.idNodoNivel]);
                    datosGraficoUltHora.push([splitNombre[2],value.totalUltHora,value.idNodoNivel]);
                    datosGraficoUlt5Min.push([splitNombre[2],value.totalUltCincoMin,value.idNodoNivel]);
                }

                
            });            
            creaGraficoTotAcumu(1);
            creaGraficoTotUltHora(2);
            creaGraficoTotUlt5Min(3);
        }

    } catch (e) {

    }

}

function actualizaNivelBackend(){

    debugger;
    limpiarArreglos();
    try{

        var datos = obtenerDatosBackendWalmart(12,1,0);
                if (datos.length > 0) {
                    $(datos).each(function (key, value) {
                        debugger;
                        var splitNombre = value.descNodoNivel.split("_");
                        var nombreBox = "Indicadores "+splitNombre[2];

                        if(_servidor.indexOf("Danu")!==-1 && value.descNodoNivel.indexOf("Danu")!==-1){
                            i++;
                            //$("#contendorDash"+i).append(creaHtml(i));

                            if(value.estadoGral=="nor"){
                                $("#tdEstadoGeneral_"+i).html("Normal");   
                            }else if(value.estadoGral=="ale"){
                                $("#tdEstadoGeneral_"+i).html("Alerta");
                            }else{$("#tdEstadoGeneral_"+i).html("Falla");}
                            
                            $("#tdTotAcumu_"+i).html(value.totalAcumulado); 
                            $("#tdTotErrAcumu_"+i).html(value.totalErrAcumulado); 
                            $("#tdTotUltHora_"+i).html(value.totalUltHora); 
                            $("#tdTotErrUltHora_"+i).html(value.totalErrUltHora);
                            $("#tdTotUlt5Min_"+i).html(value.totalUltCincoMin);
                            $("#tdTotErrUlt5Min_"+i).html(value.totalErrUltCincoMin);
                            $("#tdTotClientesUlt5Min_"+i).html(value.totalClienteUlt5Min);
                            $("#titulo_"+i).html(nombreBox);
                            $("#btnDetalle_"+i).html("Ver "+splitNombre[2]);
                            document.getElementById('btnDetalle_'+i).setAttribute('onclick','verDetalle('+value.idNodoNivel+','+splitNombre[2]+')');

                            datosGraficoTotAcumu.push([splitNombre[2],value.totalAcumulado,value.idNodoNivel]);
                            datosGraficoUltHora.push([splitNombre[2],value.totalUltHora,value.idNodoNivel]);
                            datosGraficoUlt5Min.push([splitNombre[2],value.totalUltCincoMin],value.idNodoNivel);
                        }else if(_servidor.indexOf("Leir")!==-1 && value.descNodoNivel.indexOf("Leir")!==-1){
                            i++;
                            //$("#contendorDash"+i).append(creaHtml(i));

                            if(value.estadoGral=="nor"){
                                $("#tdEstadoGeneral_"+i).html("Normal");   
                            }else if(value.estadoGral=="ale"){
                                $("#tdEstadoGeneral_"+i).html("Alerta");
                            }else{$("#tdEstadoGeneral_"+i).html("Falla");}
                            
                            $("#tdTotAcumu_"+i).html(value.totalAcumulado); 
                            $("#tdTotErrAcumu_"+i).html(value.totalErrAcumulado); 
                            $("#tdTotUltHora_"+i).html(value.totalUltHora); 
                            $("#tdTotErrUltHora_"+i).html(value.totalErrUltHora);
                            $("#tdTotUlt5Min_"+i).html(value.totalUltCincoMin);
                            $("#tdTotErrUlt5Min_"+i).html(value.totalErrUltCincoMin);
                            $("#tdTotClientesUlt5Min_"+i).html(value.totalClienteUlt5Min);
                            $("#titulo_"+i).html(nombreBox);
                            $("#btnDetalle_"+i).html("Ver "+splitNombre[2]);
                            document.getElementById('btnDetalle_'+i).setAttribute('onclick','verDetalle('+value.idNodoNivel+')');

                            datosGraficoTotAcumu.push([splitNombre[2],value.totalAcumulado,value.idNodoNivel]);
                            datosGraficoUltHora.push([splitNombre[2],value.totalUltHora,value.idNodoNivel]);
                            datosGraficoUlt5Min.push([splitNombre[2],value.totalUltCincoMin,value.idNodoNivel]);
                        }

                        
                    });

                    creaGraficoTotAcumu(1);
                    creaGraficoTotUltHora(2);
                    creaGraficoTotUlt5Min(3);
        }

    } catch (e) {

    }

}

function creaHtml(i) {
    var cadena = "";

    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';

    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '"></div>';
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
    cadena += '<button type="button" id="btnDetalle_' + i + '" class="btn" onclick="verDetalle(1);">Ver Danu</button>';
    cadena += '</div></div>';

    cadena += '</div>';
    cadena += '</div>';

    return cadena;
}

function creaHtmlGrafico(i) {
    var cadena = "";
    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';
    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="tituloGraficos_' + i + '"></div>';
    //cadena += '<div class="col-xs-12 col-sm-4 col-md-12 col-lg-12 box-macro-total">';
    cadena += '<div class="container_gauge_cont">';
    cadena += '<div class="col-lg-6 col-md-6">';
    cadena += '<div id="container_gauge_' + i + '" class="container_gauge_style">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';

    return cadena;
}

function creaGraficoTotAcumu(i) {

    debugger;
    Highcharts.setOptions({
        colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        })
    });

    // Build the chart
    chartTotAcumu = Highcharts.chart('container_gauge_'+i, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    connectorColor: 'silver'
                },
                point: {
                    events: {
                        click: function () {
                            location.href = 'indexDetalleWebServices.htm?idServer=' +  this.options.key;;
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Porcentaje',
            data: [
                { name: datosGraficoTotAcumu[0][0], y: datosGraficoTotAcumu[0][1], key: datosGraficoTotAcumu[0][2]+"&nombreServer="+datosGraficoTotAcumu[0][0]},
                { name: datosGraficoTotAcumu[1][0], y: datosGraficoTotAcumu[1][1], key: datosGraficoTotAcumu[1][2]+"&nombreServer="+datosGraficoTotAcumu[1][0]},
                { name: datosGraficoTotAcumu[2][0], y: datosGraficoTotAcumu[2][1], key: datosGraficoTotAcumu[2][2]+"&nombreServer="+datosGraficoTotAcumu[2][0]},
                { name: datosGraficoTotAcumu[3][0], y: datosGraficoTotAcumu[3][1], key: datosGraficoTotAcumu[3][2]+"&nombreServer="+datosGraficoTotAcumu[3][0]}
            ]
        }]
    });
}


function creaGraficoTotUltHora(i) {

    debugger;
    Highcharts.chart('container_gauge_'+i, {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            point: {
                events: {
                    click: function () {
                        location.href = 'indexDetalleWebServices.htm?idServer=' +  this.options.key;;
                    }
                }
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
            { name: datosGraficoUltHora[0][0], y: datosGraficoUltHora[0][1], key: datosGraficoUltHora[0][2]+"&nombreServer="+datosGraficoUltHora[0][0] },
            { name: datosGraficoUltHora[1][0], y: datosGraficoUltHora[1][1], key: datosGraficoUltHora[1][2]+"&nombreServer="+datosGraficoUltHora[1][0] },
            { name: datosGraficoUltHora[2][0], y: datosGraficoUltHora[2][1], key: datosGraficoUltHora[2][2]+"&nombreServer="+datosGraficoUltHora[2][0] },
            { name: datosGraficoUltHora[3][0], y: datosGraficoUltHora[3][1], key: datosGraficoUltHora[3][2]+"&nombreServer="+datosGraficoUltHora[3][0] }
        ]
    }]
});
}

function creaGraficoTotUlt5Min(i) {

    debugger;
    Highcharts.chart('container_gauge_'+i, {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            point: {
                events: {
                    click: function () {
                        location.href = 'indexDetalleWebServices.htm?idServer=' +  this.options.key;;
                    }
                }
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
            { name: datosGraficoUlt5Min[0][0], y: datosGraficoUlt5Min[0][1], key: datosGraficoUlt5Min[0][2]+"&nombreServer="+datosGraficoUlt5Min[0][0] },
            { name: datosGraficoUlt5Min[1][0], y: datosGraficoUlt5Min[1][1], key: datosGraficoUlt5Min[1][2]+"&nombreServer="+datosGraficoUlt5Min[1][0] },
            { name: datosGraficoUlt5Min[2][0], y: datosGraficoUlt5Min[2][1], key: datosGraficoUlt5Min[2][2]+"&nombreServer="+datosGraficoUlt5Min[2][0] },
            { name: datosGraficoUlt5Min[3][0], y: datosGraficoUlt5Min[3][1], key: datosGraficoUlt5Min[3][2]+"&nombreServer="+datosGraficoUlt5Min[3][0] }
        ]
    }]
});
}

function limpiarArreglos(){

    datosGraficoTotAcumu = [];
    datosGraficoUltHora = [];
    datosGraficoUlt5Min = [];

}



function verDetalle(servidor,nombre) {
    $("#myModal").modal('show');
    setTimeout(function () { window.location.href = "../WebServices/indexDetalleWebServices.htm?idServer=" + servidor +"&nombreServer=" + nombre; }, 1000);
}

setInterval(function(){
    $("#myModal").modal('show');
    actualizaNivelBackend();
    $("#myModal").modal('hide');
},300000)
