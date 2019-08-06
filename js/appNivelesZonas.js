/**********
Versión: 2.1.1
Fecha Modificado: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
***********/
var vars = "";
var _numDias = 0;
var _idNodoDetalle = "";
var _countData = 0;
var _tituloSeleccionado = "";
var _idtipoequipo = "";
var _idCliente = "";
var _idNodoNivel = "";

$(document).ready(function () {
    //getVariables();
    $("#myModal").modal('show');
    //_tituloSeleccionado = decodeURIComponent(escape($.get("desequipo")));
    //_idtipoequipo = $.get("equipo");
    //Variables nuevas para walmart
    _idCliente = $.get("idCliente");
    _idNodoNivel = $.get("idNodoNivel");

    $("#tituloprinc").html("DashBoard Status por Zona : " + _tituloSeleccionado);
    EquipoClientes(_idCliente,_idNodoNivel);
});

function Volver() {
    $("#myModal").modal();
    setTimeout(function () { history.back(); }, 1000);
}

function VerDetalleTerminales(seleccionado, idZonaSeleccionada) {
    var filtroSeleccionado = 0;

    if (seleccionado == "TOTAL") {
        filtroSeleccionado = 0;
    }
    else if (seleccionado == "OPERATIVOS") {
        filtroSeleccionado = 1;
    }
    else if (seleccionado == "FALLAS") {
        filtroSeleccionado = 3;
    }

    window.location.href = "../ReporteDetalle/DetalleTerminalesInformes.html?" + filtroSeleccionado + "&" + idZonaSeleccionada;
}

function EquipoClientes(idCliente,idNodoNivel) {
    debugger;
    try {
        var datos = obtenerDatosDashboard(idCliente, idNodoNivel, 1, 0);
        debugger;
        if (datos.length > 0) {
            var i = 0;
            $(datos).each(function (key, value) {
                i = i + 1;
                $("#ulPaginacion").append(creaHtml(i,value.idNodoNivel));
                creaGraficoBarra(i, value.porcUpTime, value.porcDwTime);

                $("#validzona_" + i).html(value.idZona);
                if (parseInt(value.aplicaImp) != 1) {
                    $("#capaImpresora_" + i).hide();
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
                
                $("#descripcionZona_" + i).html(value.descripcionZona);
                $("#valdesczona_" + i).html(value.descripcionZona);
                $("#container_gauge_fallos1_" + i).html(value.porcDwTime.toFixed(1) + ' %');
                $("#tdOperativosEquipos_" + i).html(totalOperativos);
                $("#tdSinComunicacionEquipos_" + i).html(value.cantEqFueraLinea);
                /*escribe contadores*/
                if (parseInt(value.totalContadores) > 0) {
                    cadcont = "";
                    $(value.listaDashboardTipoEquipoClienteContador.Lista).each(function (key2, value2) {
                       // cadcont += '<div class="detalleUso_item">';
                        // cadcont += '<div class="detalleUso_item_nombre">' + value2.nombContador + '</div>';
                        // cadcont += '<div class="detalleUso_item_valor" id="liConsImpresion">' + value2.totalContador + '</div>';
                        // cadcont += '</div>';
                        // cadcont += '<div class="detalleUso_separador"></div>';
                    });
                    // $("#detalle_contador_" + i).html(cadcont);
                }
                $("#tdErrorPerifericosEquipos_" + i).html(vAtr5);
                $("#tdTotalEPPPDCL_" + i).html(value.cantEqFueraLineaPend);
                if (value.aplicaImp != 0) {
                    $("#tdImpSinPapel_" + i).html(vAtr1); // Impresora sin papel
                    var sumaerre = vAtr3 + vAtr4;
                    $("#tdImpIrre_" + i).html(sumaerre); // Impresora Atascada
                }
                /*TOTALES*/
                $("#detalleTotal_item_nombre_terminales_" + i).html("Total terminales:" + value.totalEq);
                $("#detalleTotal_item_nombre_operativo_" + i).html("Operativos:" + totalOperativos);
                $("#detalleTotal_item_nombre_totalfallas_" + i).html("En Fallo: " + sumaNoOperativo);
                
            });
        }
        $("#myModal").modal('hide');
    } catch (e) {

    }

}

function OldcreaHtml(i) {
    // Nuevo estilo -------------------------------------------------
    var idNodoDetalle = 0;
    var div = '<div class="row contenedorCmr" >';
    div += '<div id="valdesczona_' + i + '" style="display:none"></div>';
    div += '<div id="validzona_' + i + '" style="display:none"></div>';
    div += '<div class="header" id="descripcionZona_' + i + '"></div>';

    div += '<div class="col-xs-12 col-sm-4 col-md-5 col-lg-4 box-macro-total">';
    div += '    <div class="container_gauge_cont">';

    div += '        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    div += '            <div id="container_' + i + '" class="container_gauge_style">';
    div += '            </div>';
    div += '        </div>';

    div += '        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="visibility:hidden; height:0px; width:0px;">';
    div += '            <div id="leyenda">';
    div += '                <ul>';
    div += '                    <li>';
    div += '                        <div style="background-color:#36ae57; width:20px; height:20px; border-radius: 50%; float:left; margin-top:14px; margin-left:10px;">  ';
    div += '                        </div>';
    div += '                        <div id="dvTituloOperativos">Operativos</div>';
    div += '                    </li>';
    div += '                    <li>';
    div += '                        <div id="dvTituloFallas"></div>No Operativos';
    div += '                    </li>';
    div += '                </ul>';
    div += '            </div>';
    div += '        </div>  ';

    div += '        <div id="container_gauge_fallos">';
    div += '            <div class="container_gauge_fallos1" id="container_gauge_fallos1_' + i + '"></div>';
    div += '            <div id="container_gauge_fallos2">Terminales fuera de línea</div>';
    div += '        </div>';
    div += '   </div>';
    div += '</div>';

    div += '<div class="col-xs-12 col-sm-7 col-md-6 col-lg-8" id="dvDetalleTerminales">';
    div += '    <div class="row">';
    div += '         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    div += '            <h2 id="DB_titulo_principal" class="titulo-principal">Detalle Terminales</h2>';
    div += '            <div class="ver-detalle-boton">';
    div += '                 <div></div>';
    div += '                 <button id="btnVerDetalle' + i + '" type="button" value ="' + idNodoDetalle + '" class="btn btnVerDetalle" onclick="javascript:verDetalle(' + i + ')">Ver detalle</button>';

    div += '            </div>';
    div += '        </div>';

    div += '        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    div += '            <div id="dvContentDetalleTerminales">';
    div += '                            <div class="dvContentDetalleTerminales_item_l">Operativos';
    div += '                                <div class="dvDetalleTerminales_datoNum" id="tdOperativosEquipos_' + i + '"></div>';
    div += '                                <div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    div += '                            </div>';

    div += '                            <div class="dvContentDetalleTerminales_item_r">Sin Comunicación';
    div += '                                <div class="dvDetalleTerminales_datoNum" id="tdSinComunicacionEquipos_' + i + '"></div>';
    div += '                                <div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje"></div>';
    div += '                            </div>';
    div += '                            <div id="capaImpresora_' + i + '">';
    div += '                                <div class="dvContentDetalleTerminales_item_l">Impresora Atascada ';
    div += '                                    <div class="dvDetalleTerminales_datoNum" id="tdImpIrre_' + i + '"></div>';
    div += '                                    <div class="dvDetalleTerminales_datoPor" id="tdImpIrre80MMPorcentaje"></div>';
    div += '                                </div>';

    div += '                                <div class="dvContentDetalleTerminales_item_r">Impresora sin Papel';
    div += '                                    <div class="dvDetalleTerminales_datoNum" id="tdImpSinPapel_' + i + '"></div>';
    div += '                                    <div class="dvDetalleTerminales_datoPor" id="tdImpSinPapel80MMPorcentaje"></div>';
    div += '                                </div>';
    div += '                            </div>';

    div += '                            <div class="dvContentDetalleTerminales_item_l">Error Periféricos';
    div += '                                <div class="dvDetalleTerminales_datoNum" id="tdErrorPerifericosEquipos_' + i + '"></div>';
    div += '                                <div class="dvDetalleTerminales_datoPor" id="tdErrorPerifericosPorcentaje"></div>';
    div += '                            </div>';

    div += '                            <div class="dvContentDetalleTerminales_item_r">Term. Pendientes';
    div += '                                <div class="dvDetalleTerminales_datoNum" id="tdTotalEPPPDCL_' + i + '"></div>';
    div += '                            </div>';

    div += '                </table> ';
    div += '            </div>';
    div += '        </div>';

    div += '    </div><!--END ROW-->';
    div += '</div>';

    div += '<div class="" >';


    /*contadores*/
    div += '<div class="">';
    div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="detalle_contador_' + i + '"></div">';
    div += '</div>';
    /*fin contadores*/

    div += '    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont" >';
    div += '        <div id="detalle_total">';

    div += '            <div class="detalleTotal_item" onclick="VerDetalleTerminal(\'TOTAL\',' + i + ');">';
    div += '                <div class="detalleTotal_item_nombre" id="detalleTotal_item_nombre_terminales_' + i + '"></div>';//total terminales
    div += '                <div class="detalleTotal_item_icon"></div>';
    div += '            </div>';
    div += '            <div class="detalleTotal_separador"></div>';

    div += '            <div class="detalleTotal_item" onclick="VerDetalleTerminal(\'OPERATIVOS\',' + i + ');">';
    div += '                <div class="detalleTotal_item_nombre" id="detalleTotal_item_nombre_operativo_' + i + '"></div>';//Operativos
    div += '                <div class="detalleTotal_item_icon" ></div>';
    div += '            </div>';
    div += '            <div class="detalleTotal_separador"></div>';

    div += '            <div class="detalleTotal_item2" onclick="VerDetalleTerminal(\'FALLAS\',' + i + ');">';
    div += '                <div class="detalleTotal_item_nombre" id="detalleTotal_item_nombre_totalfallas_' + i + '"></div>';
    div += '                <div  class="detalleTotal_item_icon2" ></div>';
    div += '            </div>';

    div += '        </div>';
    div += '    </div>';
    //<!--END COL-->
    div += '</div>';
    //<!--END ROW-->
    //<!--END COL-->
    div += '</div>';
    return div;
}

function creaHtml(i, idNodoNivel) {
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
    cadena += '<button id="btnVerDetalle_' + i + '" type="button" class="btn" onclick="javascript:verDetalle('+i+','+idNodoNivel+')">Ver detalle</button>';
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
    //cadena += '<div class="dvContentDetalleTerminales_item_r"><span class="glyphicon glyphicon-list-alt"></span> Total';
    //cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotalEquipos_' + i + '"></div></div>';
    cadena += '<div class="dvContentDetalleTerminales_item_r"><span class="glyphicon glyphicon-user"></span> Terminales Pendientes Cliente';
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

function creaGraficoBarra(i, Porcentaje_terminales, Porcentaje_fallas) {
    Highcharts.chart('container_' + i + '', {
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
        plotOptions: {
            column: {
                stacking: 'percent',
                stickyTracking: false
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true,
            enabled: false
        },
        series: [{
            name: 'Operativos',
            color: '#92d283',
            data: [Porcentaje_terminales]
        }, {
            name: 'Falla',
            color: '#ea5942',
            data: [Porcentaje_fallas]
        }]
    },
            function callback() {
            });
}
function verDetalle(i) {
    $("#myModal").modal('show');
    var idzona = $("#validzona_" + i).html();
    var valdesczona = $("#valdesczona_" + i).html();
    //vars = _idtipoequipo + '&' + idzona + "&" + _tituloSeleccionado + '&' + valdesczona;
    vars = "zona=" + idzona + '&deszona=' + valdesczona + '&dessucursal=' + _tituloSeleccionado + '&equipo=' + _idtipoequipo;
    setTimeout(function () { window.location.href = "../Sucursales/IndexSucursales.html?" + vars; }, 1000);
    
}
function VerDetalleTerminal(seleccionado, i) {
    var filtroSeleccionado = 0;
    var idzona = $("#validzona_" + i).html();
    var valdesczona = $("#valdesczona_" + i).html();
    if (seleccionado == "TOTAL") {
        filtroSeleccionado = 0;
    }
    else if (seleccionado == "OPERATIVOS") {
        filtroSeleccionado = 1;
    }
    else if (seleccionado == "FALLAS") {
        filtroSeleccionado = 3;
    }
    vars = "zona=" + idzona + '&deszona=' + valdesczona + "&equipo=" + _idtipoequipo + '&desequipo=' + _tituloSeleccionado + '&seleccionado=' + filtroSeleccionado + '&titulo=' + _tituloSeleccionado + ' <br> Zona ' + valdesczona;
    window.location.href = "../ReporteDetalle/DetalleTerminalesInformes.html?" + vars;
}
