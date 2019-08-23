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
var idCliente = "12"; //ID DE WALMART
var _idNodoNivel = "";
var _idGrupo = "";


$(document).ready(function () {
    //getVariables();
    $("#myModal").modal('show');
    //_tituloSeleccionado = decodeURIComponent(escape($.get("dessucursal")));
    //_tituloZona = $.get("deszona");
    //_idzona = parseInt($.get("zona"));
    //_idtipoequipo = $.get("equipo");

    _idNegocio = $.get("idNegocio");
    _idCliente = $.get("idCliente");
    _idGrupo = $.get("idGrupo");

    //$("#tituloprinc").html("DashBoard Status por Sucursal :" + _tituloSeleccionado + "<br>Zona " + _tituloZona);
    EquipoClientes(_idCliente,_idNegocio,_idGrupo);

    $(".holder").jPages({
        containerID: "ulPaginacion",
        perPage: 6,
        previous: "Anterior",
        next: "Siguiente"
    });
});

function Volver(){
    $("#myModal").modal();
    setTimeout(function(){history.back();}, 1000);
}

function VerDetalleTerminales(seleccionado, idZonaSeleccionada, idSucursalSeleccionada) {
    var filtroSeleccionado = 0;
    
    if(seleccionado=="TOTAL"){
        filtroSeleccionado = 0;
    }
    else if(seleccionado=="OPERATIVOS"){
        filtroSeleccionado = 1;
    }
    else if(seleccionado=="FALLAS"){
        filtroSeleccionado = 3;
    }

    window.location.href = "../ReporteDetalle/DetalleTerminalesInformes.html?" + filtroSeleccionado + "&" + idZonaSeleccionada + "&" + idSucursalSeleccionada;
}

function EquipoClientes() {
    debugger;    
    try {
        var datos = obtenerDatosDashboard(_idCliente, _idNegocio, 2, _idGrupo);
        if (datos.length > 0) {
            var i = 0;
            if (datos.length < 7) {//oculta paginación en caso de no necesitar
                $('.holder').css('display', 'none');
            } else {
                $('.holder').css('display', 'block');
            }
            $(datos).each(function (key, value) {
                debugger;  
                i = i + 1;
                $("#ulPaginacion").append(creaHtml(i,_idNodoNivel,value.idNodoNivel));
                creaGraficoBarra(i, value.porcUpTime, value.porcDWTime);

                $("#titulo_" + i).html("Resumen Sucursal " + value.descNodoNivel);
                //$("#valEquipoDescripcion_" + i).html(value.desTipoEquipo);

                $("#container_gauge_fallos1_" + i).html(value.porcDWTime + " %");
                $("#container_gauge_fallos2_" + i).html("Terminales fuera de línea");
                creaGraficoBarra(i, value.porcUpTime, value.porcDWTime);
                
                
                
                var sumaNoOperativo = parseInt(value.totalEqFueraLinea) + parseInt(value.totalEqImpAtascada) + parseInt(value.totalEqImpSinPapel) + parseInt(value.totalEqPerifericoErr);
                var totalOperativos = parseInt(value.totalEqEnLinea) + parseInt(sumaNoOperativo);

                $("#tdPorOperativosEquipos_" + i).html(value.porcUpTime+"%"); //% Operativos
                $("#tdPorNoOperativosEquipos_" + i).html(value.porcDWTime+"%"); //% No Operativos
                $("#tdOperativosEquipos_" + i).html(value.totalEqEnLinea); //Operativos
                $("#tdSinComunicacionEquipos_" + i).html(value.totalEqFueraLinea); //Sin Comunicación                   
                $("#tdImpSinPapel_" + i).html(value.totalEqImpSinPapel); // Impresora sin papel
                $("#tdImpIrre_" + i).html(value.totalEqImpAtascada); // Impresora Atascada
                $("#tdErrorPerifericosEquipos_" + i).html(value.totalEqPerifericoErr); //Error Periféricos
                $("#tdTotalEquipos_" + i).html(totalOperativos); //Total
                $("#tdTotalEPPPDCL_" + i).html(value.totalEqNoAplica); //Terminales Pendientes Cliente 
                $("#tdTotalTerminales_" + i).html(totalOperativos); //Total Terminales
                $("#lblEquiposOK_" + i).html(value.totalEqEnLinea);//Operativos
                $("#lblEquiposFalla_" + i).html(sumaNoOperativo);//No Operativo
                
            });
        }
        $("#myModal").modal('hide');
    } catch (e) {

    }

}

function Old_creaHtml(i) {
    // Nuevo estilo -------------------------------------------------
    var idNodoDetalle = 0;

    var div = '<div class="row contenedorCmr" >';
    div += '<div id="valdescsucursal_' + i + '" style="display:none"></div>';
    div += '<div id="validsucursal_' + i + '" style="display:none"></div>';
    div += '<div class="header" id="titulo_' + i + '"></div>';

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
    div += '                        <div id="dvTituloOperativos">';
    div += '                            Operativos';
    div += '                        </div>';
    div += '                    </li>';
    div += '                    <li>';
    div += '                        <div id="dvTituloFallas"> ';
    div += '                        </div>No Operativos';
    div += '                    </li>';
    div += '                </ul>';
    div += '            </div>';
    div += '        </div>  ';

    div += '        <div id="container_gauge_fallos">';
    div += '            <div class="container_gauge_fallos1" id="container_gauge_fallos1_' + i + '"> 0 %</div>';
    div += '            <div id="container_gauge_fallos2">Terminales fuera de línea</div>';
    div += '        </div>';
    div += '   </div>';
    div += '</div>';

    div += '<div class="col-xs-12 col-sm-7 col-md-6 col-lg-8" id="dvDetalleTerminales">';
    div += '    <div class="row">';
    div += '         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    div += '            <h2 id="DB_titulo_principal" class="titulo-principal"></h2>';
    div += '            <div class="ver-detalle-boton">';
    div += '                 <div></div>';
    div += '                 <button id="btnVerDetalle' + i + '" type="button" class="btn btnVerDetalle" onclick="javascript:verDetalle(' + i + ')">Ver detalle</button>';
    div += '            </div>';
    div += '        </div>';

    div += '        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding: 0px; bottom: 0px; position: relative;">';
    div += '            <div id="dvContentDetalleTerminales">';

    div += '               <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    
    /*contadores*/
    div += '<div class="">';
    div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="detalle_contador_' + i + '"></div">';
    div += '</div>';
    /*fin contadores*/

    div += '             </div>';

    div += '             <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont" >';
    div += '                 <div id="detalle_total">';

    div += '                     <div class="detalleTotal_item" onclick="VerDetalleTerminal(\'TOTAL\',' + i + ');">';
    div += '                         <div class="detalleTotal_item_nombre" id="detalleTotal_item_nombre_terminales_' + i + '">Total term: 0 </div>';
    //div += '                         <div class="detalleTotal_item_icon"></div>';
    div += '                     </div>';
    div += '                     <div class="detalleTotal_separador"></div>';

    div += '                     <div class="detalleTotal_item" onclick="VerDetalleTerminal(\'OPERATIVOS\',' + i + ');">';
    div += '                         <div class="detalleTotal_item_nombre" id="detalleTotal_item_nombre_operativo_' + i + '">Operativos: 0 </div>';
    //div += '                         <div class="detalleTotal_item_icon"></div>';
    div += '                     </div>';
    div += '                     <div class="detalleTotal_separador"></div>';

    div += '                     <div class="detalleTotal_item2" onclick="VerDetalleTerminal(\'FALLAS\',' + i + ');">';
    div += '                         <div class="detalleTotal_item_nombre" id="detalleTotal_item_nombre_totalfallas_' + i + '">En Fallo:  0</div>';
    //div += '                         <div  class="detalleTotal_item_icon2"></div>';
    div += '                     </div>';
    div += '                     <div class="detalleTotal_separador"></div>';
    div += '                 </div>';
    div += '             </div>';

    div += '            </div>';
    div += '        </div>';



    div += '    </div><!--END ROW-->';
    div += '</div>';
    //<!--END ROW-->
    //<!--END COL-->
    div += '</div>';
    return div;
}

function creaHtml(i, idNodoNivel, idGrupo) {
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
    cadena += '<button id="btnVerDetalle_' + i + '" type="button" class="btn" onclick="javascript:verDetalle('+i+','+idNodoNivel+','+idGrupo+')">Ver detalle</button>';
    cadena += '</div>';
    cadena += '</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    cadena += '<div id="dvContentDetalleTerminales">';
    // % up
    cadena += '<div class="dvContentDetalleTerminales_item_OP">';
    cadena += '<span class="glyphicon glyphicon-upload"></span> Operativos ';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdPorOperativosEquipos_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdOperativosPorcentaje"></div>';
    cadena += '</div>';
    // % up
    // % down
    cadena += '<div class="dvContentDetalleTerminales_item_NOP">';
    cadena += '<span class="glyphicon glyphicon-download"></span> No Operativos ';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdPorNoOperativosEquipos_' + i + '"></div>';
    cadena += '<div class="dvDetalleTerminales_datoPor" id="tdSinComunicacionPorcentaje">';
    cadena += '</div></div>';
    // %down
    cadena += '<div class="dvContentDetalleTerminales_item_l">';
    cadena += '<span class="glyphicon glyphicon-ok"></span> En linea';
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
    cadena += '<div class="dvContentDetalleTerminales_item_r"><span class="glyphicon glyphicon-user"></span> Pendientes Cliente';
    cadena += '<div class="dvDetalleTerminales_datoNum" id="tdTotalEPPPDCL_' + i + '"></div></div>';
    cadena += '</table></div></div></div></div>';
    cadena += '<div class="">';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="detalle_contador_' + i + '"></div">';
    cadena += '</div>';
    cadena += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 detalle_impresion_cont">';
    cadena += '<div id="detalle_total">';
    cadena += '<div class="detalleTotal_item" onclick="VerDetalleTerminales(\'TOTAL\','+i+');">';
    cadena += '<div class="detalleTotal_item_nombre">Total:<div id="tdTotalTerminales_' + i + '"></div></div>';
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

function creaGraficoBarra(i, porcentajeEquiposUpTime, porcentajeFallaGrafico) {
    Highcharts.chart('container_gauge_' + i, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            height: 250,
            width: 170
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        colors:['#2ebf44','#e34f4f'],
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
            shared: false,
            enabled: true
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
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
                name: 'Operativo',
                y: porcentajeEquiposUpTime,
                sliced: false,
                selected: false
            }, {
                name: 'No Operativo',
                y: porcentajeFallaGrafico
            }]
        }]
    },
    function callback() {
    });
}
function verDetalle(i) {
    $("#myModal").modal('show');
    var idsucursales = $("#validsucursal_" + i).html();
    var sucursaleldescrip = $("#valdescsucursal_" + i).html();
    vars = "sucursal=" + idsucursales + '&zona=' + _idzona + '&dessucursal=' + sucursaleldescrip;
    setTimeout(function () { window.location.href = "../Terminales/indexTerminales.htm?" + vars; }, 1000);
}
function VerDetalleTerminal(seleccionado, i) {
    var filtroSeleccionado = 0;
    var idsucursales = $("#validsucursal_" + i).html();
    var sucursaleldescrip = $("#valdescsucursal_" + i).html();
    if (seleccionado == "TOTAL") {
        filtroSeleccionado = 0;
    }
    else if (seleccionado == "OPERATIVOS") {
        filtroSeleccionado = 1;
    }
    else if (seleccionado == "FALLAS") {
        filtroSeleccionado = 3;
    }
    vars = "sucursal=" + idsucursales + '&dessucursal=' + sucursaleldescrip + '&zona=' + _idzona + "&equipo=" + _idtipoequipo + '&seleccionado=' + filtroSeleccionado + '&titulo=' + _tituloSeleccionado +' - '+ _tituloZona +' <br> Equipo ' + sucursaleldescrip;;
    window.location.href = "../ReporteDetalle/DetalleTerminalesInformes.html?" + vars;
}