/**********
Versión: 2.1.1
Fecha Modificación: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
***********/
var _numDias = 0;
var _tituloSeleccionado = "";
var _idServidor = "";
var _nombreServidor = "";
var maximosClientesXMinuto = 0;
var maximasTransaccionesXMinuto = 0;
var chartRpm, chartSpeed;
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
        
        //$("#contendorDashGrafico1").append(creaHtmlGrafico(1));
        //$("#tituloGraficos_1").html("Transacciones totales "+_nombreServidor);
        creaGraficoBarraTotales(1);

        //$("#contendorDashGrafico2").append(creaHtmlGrafico(2));
        //$("#tituloGraficos_2").html("Errores totales "+_nombreServidor);
        creaGraficoBarraErrores(2);

    } catch (e) {

    }


}

function EquipoClientes() {
    debugger;
    try {
        var datos = obtenerDatosDashboardEquiposCliente(IDCLIENTE, 0, 0, 'todos');
        if (datos.length > 0) {
            $(datos).each(function (key, value) {
                if (value.desTipoEquipo != "Totem-T22 Paleta Inalámbrico Sin Modem Datos") {
                    i = key + 1;
                    $("#contendorDash").append(creaHtml(i));
                    $("#validTipoEquipo_" + i).html(value.idTipoEquipo);
                    $("#titulo_" + i).html("Resumen General " + value.desTipoEquipo);
                    $("#valEquipoDescripcion_" + i).html(value.desTipoEquipo);

                    $("#container_gauge_fallos1_" + i).html(value.porcDwTime + " %");
                    $("#container_gauge_fallos2_" + i).html("Terminales fuera de línea");
                    creaGraficoBarra(i, value.porcUpTime, value.porcDwTime);
                    /*Escribe contadores*/
                    if (parseInt(value.totalContadores) > 0) {
                        cadcont = "";
                        $(value.listaDashboardTipoEquipoClienteContador.Lista).each(function (key2, value2) {
                            //cadcont += '<div class="detalleUso_item">';
                            //cadcont += '<div class="detalleUso_item_nombre">' + value2.nombContador + '</div>';
                            //cadcont += '<div class="detalleUso_item_valor" id="liConsImpresion">' + value2.totalContador + '</div>';
                            //cadcont += '</div>';
                            //cadcont += '<div class="detalleUso_separador"></div>';
                        });
                        //$("#detalle_contador_" + i).html(cadcont);
                    }
                    /*valores para sumar los no operativos*/
                    if (value.aplicaImp == 1) {
                        vAtr1 = ObtenerValorAtributo(value.listaComponente.Lista, 'IMP', 'SinPapel');
                        vAtr1 = (parseInt(vAtr1) == -99) ? 0 : parseInt(vAtr1);
                        vAtr3 = ObtenerValorAtributo(value.listaComponente.Lista, 'IMP', 'Irrecuperable');
                        vAtr3 = (parseInt(vAtr3) == -99) ? 0 : parseInt(vAtr3);
                        vAtr4 = ObtenerValorAtributo(value.listaComponente.Lista, 'IMP', 'TapaAbierta');
                        vAtr4 = (parseInt(vAtr4) == -99) ? 0 : parseInt(vAtr4);
                    } else {
                        vAtr1 = 0;
                        vAtr3 = 0;
                        vAtr4 = 0;
                    }
                    vAtr2 = parseInt(value.cantEqFueraLinea);
                    vAtr5 = (parseInt(value.totalPerifericoError) == -99) ? 0 : parseInt(value.totalPerifericoError);
                    var sumaNoOperativo = parseInt(vAtr1 + vAtr2 + vAtr3 + vAtr4 + vAtr5);
                    var totalOperativos = parseInt(value.totalEq) - parseInt(sumaNoOperativo);

                    $("#tdOperativosEquipos_" + i).html(totalOperativos); //Operativos
                    $("#tdSinComunicacionEquipos_" + i).html(value.cantEqFueraLinea); //Sin Comunicación

                    /*Aplica impresora*/
                    if (value.aplicaImp == 0) { $("#capaImpresora_" + i).hide(); }
                    if (value.totalPerifericoError == "-99") { $("#errorPeriferico_" + i).hide(); }

                    if (value.aplicaImp != 0) {
                        $("#tdImpSinPapel_" + i).html(vAtr1); // Impresora sin papel
                        var sumaerre = vAtr3 + vAtr4;
                        $("#tdImpIrre_" + i).html(sumaerre); // Impresora Atascada
                    }
                    

                    $("#tdErrorPerifericosEquipos_" + i).html(value.totalPerifericoError); //Error Periféricos
                    $("#tdTotalEquipos_" + i).html(value.totalEq); //Total
                    $("#tdTotalEPPPDCL_" + i).html(value.cantEqFueraLineaPend); //Terminales Pendientes Cliente 
                    $("#tdTotalTerminales_" + i).html(value.totalEq); //Total Terminales
                    $("#lblEquiposOK_" + i).html(totalOperativos);//Operativos
                    $("#lblEquiposFalla_" + i).html(sumaNoOperativo);//No Operativo
                    
                }
            });
        }
        $("#myModal").modal('hide');
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


function creaGraficoBarra(i, porcentajeEquiposUpTime, porcentajeFallaGrafico) {
    Highcharts.chart('container_gauge_' + i, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            height: 250,
            width: 250
        },
        credits: {
            enabled: true
        },
        title: {
            text: ''
        },
        colors:['green','red'],
        xAxis: {
            categories: [''],
            lineColor: '#fff',
            tickWidth: 0,
        },
        yAxis: {
            min: 0,
            max: 100,
            gridLineColor: '#fff',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#fff'
                }
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}"></span><b>{point.percentage:.0f}%</b><br/>',
            shared: true,
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Estado',
            colorByPoint: true,
            data: [{
                name: 'En linea',
                y: porcentajeEquiposUpTime,
                sliced: true,
                selected: true
            }, {
                name: 'Falla',
                y: porcentajeFallaGrafico
            }]
        }]
    },
    function callback() {
    });
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



setInterval(function(){
    $("#myModal").modal('show');
    actualizaNivelBackend();
    $("#myModal").modal('hide');
},300000)

