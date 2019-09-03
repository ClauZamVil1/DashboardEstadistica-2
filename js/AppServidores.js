/**********
Versión: 2.1.1
Fecha Modificación: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
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

