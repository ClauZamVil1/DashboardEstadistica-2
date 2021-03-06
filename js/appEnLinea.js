/**********
Versión: 2.1.1
Fecha Modificación: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
***********/
var _numDias = 0;
var _tituloSeleccionado = "";


$(document).ready(function () {
    //$("#myModal").modal('show');
    _tituloSeleccionado = "Monitoreo en Línea - Hoy";
    EquipoClientes();
});

function mostrarMensaje(tipo, mensaje) {
    if (tipo == "OK") alertify.success("<b>OK</b>  " + mensaje);
    else if (tipo == "ERROR") alertify.error("<b>ERROR</b>  " + mensaje);
    else if (tipo == "ADVERTENCIA") alertify.alert("<b>ADVERTENCIA</b>  " + mensaje);
    else if (tipo == "NOTIFICACION") alertify.log("<b>ATENCIÓN</b>  " + mensaje);
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

function creaHtml(i) {
    var cadena = "";
    cadena += '<div id="valEquipoDescripcion_'+i+'" style="display:none"></div>';
    cadena += '<div id="validTipoEquipo_' + i + '" style="display:none"></div>';
    cadena += '<div class="row contenedorCmr">';
    cadena += '<div class="header" id="titulo_' + i + '">Resumen General</div>';
    cadena += '<div class="col-xs-12 col-sm-4 col-md-5 col-lg-4 box-macro-total">';
    cadena += '<div class="container_gauge_cont">';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    cadena += '<div id="container_gauge_' + i + '" class="container_gauge_style">';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="visibility:hidden; height:0px; width:0px;">';
    cadena += '<div id="leyenda">';
    cadena += '<ul><li>';
    cadena += '<div style="background-color:#36ae57; width:20px; height:20px; border-radius: 50%; float:left; margin-top:14px; margin-left:10px;"></div>';
    cadena += '<div id="dvTituloOperativos">Operativos</div>';
    cadena += '</li><li><div id="dvTituloFallas"></div>No Operativos</li>';
    cadena += '</ul>';
    cadena += '</div>';
    cadena += '</div>';
    //cadena += '<div id="container_gauge_fallos">';
    //cadena += '<div class="container_gauge_fallos1" id="container_gauge_fallos1_' + i + '">0%</div>';
    //cadena += '<div class="container_gauge_fallos2" id="container_gauge_fallos2_' + i + '"></div>';
    //cadena += '</div>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '<div class="col-xs-12 col-sm-7 col-md-6 col-lg-8" id="dvDetalleTerminales">';
    cadena += '<div class="row">';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    //cadena += '<h2 id="DB_titulo_principal" class="titulo-principal">Detalle Terminales</h2>';
    cadena += '<div class="ver-detalle-boton">';
    cadena += '<div></div>';
    cadena += '<button id="btnVerDetalle_' + i + '" type="button" class="btn" onclick="javascript:verDetalle('+i+')">Ver detalle</button>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    cadena += '<div id="dvContentDetalleTerminales">';
    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-ok"></span> Operativos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdOperativosEquipos_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r">';
    cadena += '<span class="glyphicon glyphicon-phone-alt"></span> Sin Comunicación';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdSinComunicacionEquipos_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';
    cadena += '<div id="capaImpresora_' + i + '">';
    cadena += '<div class="dvContentDetalleTerminales_item_l"><span class="glyphicon glyphicon-time"></span> Impresora Atascada';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdImpIrre_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdImpIrre80MMPorcentaje"></div></div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r"><span class="glyphicon glyphicon-duplicate"></span> Impresora sin Papel';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdImpSinPapel_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdImpSinPapelPorcentaje"></div>';
    cadena += '</div>';
    cadena += '</div>';//capaImpresora
    cadena += '<div id="errorPeriferico_' + i + '">';
    cadena += '<div class="dvContentDetalleTerminales_item_l"><span class="glyphicon glyphicon-warning-sign"></span> Error Periféricos';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdErrorPerifericosEquipos_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdErrorPerifericosPorcentaje"></div></div>';
    cadena += '</div>'
    cadena += '<div class="dvContentDetalleTerminales_item_r"><span class="glyphicon glyphicon-list-alt"></span> Total';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotalEquipos_' + i + '"></div></div>';
    cadena += '<div class="dvContentDetalleTerminales_item_l"><span class="glyphicon glyphicon-user"></span> Terminales Pendientes Cliente';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotalEPPPDCL_' + i + '"></div></div>';
    cadena += '</table></div></div></div></div>';
    cadena += '<div class="">';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="detalle_contador_' + i + '"></div">';
    cadena += '</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    cadena += '<div id="detalle_total">';
    cadena += '<div class="detalleTotal_item" onclick="VerDetalleTerminales(\'TOTAL\','+i+');">';
    cadena += '<div class="detalleTotal_item_nombre">Total terminales: <div id="tdTotalTerminales_' + i + '"></div></div>';
    cadena += '<div class="detalleTotal_item_icon"></div>';
    cadena += '</div>';
    cadena += '<div class="detalleTotal_separador"></div>';
    cadena += '<div class="detalleTotal_item" onclick="VerDetalleTerminales(\'OPERATIVOS\','+i+');">';
    cadena += '<div class="detalleTotal_item_nombre">Operativos: <div id="lblEquiposOK_' + i + '"></div></div>';
    cadena += '<div class="detalleTotal_item_icon"></div>';
    cadena += '</div>';
    cadena += '<div class="detalleTotal_separador"></div>';
    cadena += '<div class="detalleTotal_item2" onclick="VerDetalleTerminales(\'FALLAS\','+i+');">';
    cadena += '<div class="detalleTotal_item_nombre">En Fallo:  <div id="lblEquiposFalla_' + i + '"></div></div>';
    cadena += '<div class="detalleTotal_item_icon2"></div>';
    cadena += '</div>';
    cadena += '</div></div></div></div>';
    return cadena;
}
/*function creaGraficoBarra(i, porcentajeEquiposUpTime, porcentajeFallaGrafico) {
    Highcharts.chart('container_gauge_' + i, {
        chart: {
            type: 'column',
            height: 255,
            width: 180
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
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
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true,
            enabled: false
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                stickyTracking: false
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Operativos',
            color: '#92d283',
            data: [porcentajeEquiposUpTime]
        }, {
            name: 'Falla',
            color: '#ea5942',
            data: [porcentajeFallaGrafico]
        }]
    },
	function callback() {
	});
}*/

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

