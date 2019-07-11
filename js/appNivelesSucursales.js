/**********
Versión: 2.1.1
Fecha Modificado: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
***********/
var vars = "";
var _numDias = 0;
var _tituloSeleccionado = "";
var _idNodoDetalle = "";
var _countData = 0;
var _tituloZona = "";
var _idzona = 0;
var _idtipoequipo = "";
$(document).ready(function () {
    //getVariables();
    $("#myModal").modal('show');
    _tituloSeleccionado = decodeURIComponent(escape($.get("dessucursal")));
    _tituloZona = $.get("deszona");
    _idzona = parseInt($.get("zona"));
    _idtipoequipo = $.get("equipo");
    
    $("#tituloprinc").html("DashBoard Status por Sucursal :" + _tituloSeleccionado + "<br>Zona " + _tituloZona);
    EquipoClientes();
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
    try {
        var datos = obtenerDatosDashboardEquiposClienteZona(IDCLIENTE, 1, _idzona, _idtipoequipo);
        if (datos.length > 0) {
            var i = 0;
            if (datos.length < 7) {//oculta paginación en caso de no necesitar
                $('.holder').css('display', 'none');
            } else {
                $('.holder').css('display', 'block');
            }
            $(datos).each(function (key, value) {
                
                i = i + 1;
                $("#ulPaginacion").append(creaHtml(i));
                creaGraficoBarra(i, value.porcUpTime, value.porcDwTime);
                
                $("#validsucursal_" + i).html(value.idZona);
                $("#valdescsucursal_" + i).html(value.descripcionZona);
                $("#titulo_" + i).html(value.descripcionZona);
                $("#container_gauge_fallos1_" + i).html(value.porcDwTime.toFixed(1) + ' %');

                /*contadores*/
                if (parseInt(value.totalContadores) > 0) {
                    cadcont = "";
                    $(value.listaDashboardTipoEquipoClienteContador.Lista).each(function (key2, value2) {
                       // cadcont += '<div class="detalleUso_item">';
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
                //var totalOperativos = parseInt(value.totalEq) - parseInt(sumaNoOperativo);
                /*TOTALES*/
                $("#detalleTotal_item_nombre_terminales_" + i).html("Total terminales:" + value.totalEq);
                $("#detalleTotal_item_nombre_operativo_" + i).html("En Línea:" + value.cantEqEnLinea);
                
                $("#detalleTotal_item_nombre_totalfallas_" + i).html("En Fallo: " + sumaNoOperativo);
                
            });
        }
        $("#myModal").modal('hide');
    } catch (e) {

    }

}

function creaHtml(i) {
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