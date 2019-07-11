/**********
Versión: 3.0.0
Fecha Modificación: 04-10-2018
Creado Por: Juan González
Modificado por: Guillermo Pérez
***********/
var _tituloSeleccionado = "";
var _idzona = "";
var _idsucursal = "";
$(document).ready(function () {
   
    /*getVariables();*/
    
    _tituloSeleccionado = decodeURIComponent(escape($.get("dessucursal")));
    _idzona = parseInt($.get("zona"));
    _idsucursal = $.get("sucursal");
    creaGraficosEnLinea();
    $("#tituloprinc").html("DashBoard Status por Terminal <br>" + _tituloSeleccionado);
    $(".holder").jPages({
        containerID: "ulPaginacion",
        perPage: 4,
        previous: "Anterior",
        next: "Siguiente"
    });
});

function Volver(){
    $("#myModal").modal();
    setTimeout(function(){history.back();}, 1000);
}

/*Detalle Sucursal*/

function creaGraficosEnLinea() {
    var CVERDE = "#92d283";
    var CROJO = "#ea5942";
    var CAMARILLO = "#FBBC05";
    var CGRIS = "#bbb";
    var datos = ObtenerDetalleEquiposXSucursal(IDCLIENTE, _idsucursal);//Llamado a método que se comunica con el servicio REST para obtener la data
    if (datos.length > 0) {
        for (var i = 0; i < datos.length; i++) {
            estadoColorComunicacion = (datos[i].comunicacion == "1") ? CVERDE : CROJO;
            console.log(datos[i]);

            var div = '<div class="row contenedorCmr' + (datos.length == 1 ? " itemUnico" : "") + '">';
            div += '<div class="header">ID ' + datos[i].idEquipo + '</div>';

            div += '<div class="terminal_leds">';

            div += '  <div class="col semaforo semaforo_' + datos[i].detEstadoGral + '"></div>'; 

            div += '  <div class="col terminal_leds_col">';
            div += '  <div class="row">';
            div += '  <div class="col-md-6">';
            div += '     <div class="terminal_led_item">Comunicación';
            div += '         <div class="terminal_led_sem" style="background-color:' + estadoColorComunicacion + '"></div>';
            div += '     </div>';
            div += '   </div>';//coldmd6
         
            for (var j = 0; j < datos[i].listaComponente.Lista.length; j++) {
                etiqueta = datos[i].listaComponente.Lista[j].listaAtributo.Lista[2].valorAtributo
                valor = datos[i].listaComponente.Lista[j].listaAtributo.Lista[0].valorAtributo;
                valcolor = "";
                if (valor == "nor") {
                    valcolor = CVERDE
                } else if(valor=="ale") {
                    valcolor = CAMARILLO;
                } else if (valor == "fal") {
                    valcolor = CROJO;
                } else {
                    valcolor = CGRIS;
                }
                div += '  <div class="col-md-6">';
                div += '     <div class="terminal_led_item">' + etiqueta;
                div += '         <div class="terminal_led_sem" style="background-color:' + valcolor + '"></div>';
                div += '     </div>';
                div += '     </div>';
            }
            div += '</div>'; // fin  div row
            div += '</div>'; // terminal_leds row

            div += '<div class="terminal_detalles">';

            div += '<div  class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
            div += '<table class="table table-bordered" style="1px solid #ccc; background-color:white; margin-top:10px;">';
            div += '<thead>';
            div += '</thead>';
            div += '<tbody>';
            div += '<tr class="">';
            div += '<td class="terminal_detalles_titulo" valign="middle">Estado General</td>';
            div += '<td id="tdEstadoGeneral" class="terminal_detalles_valor">' + datos[i].detEstadoGral + '</td>';
            div += '</tr>';
            div += '<tr class="terminal_detalles_spacer"></tr>';
            div += '<tr class="">';
            div += '<td class="terminal_detalles_titulo">Condición Monitoreo</td>';
            div += '<td id="tdCondicionMonitoreo" class="terminal_detalles_valor">' + datos[i].detCondMonitoreo + '</td>';
            div += '</tr>';
            div += '<tr class="terminal_detalles_spacer"></tr>';
            div += '<tr class="">';
            div += '<td class="terminal_detalles_titulo">Tipo Equipo</td>';
            div += '<td id="tdTipoEquipo" class="terminal_detalles_valor">' + datos[i].detTipoEquipo + '</td>';
            div += '</tr>';
            div += '</tbody>';
            div += '</table>';
            div += '</div>';

            div += '<div  class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
            div += '<table class="table table-bordered" style="1px solid #ccc; background-color:white; margin-top:10px;">';
            div += '<thead>';
            div += '</thead>';
            div += '<tbody>';
            div += '<tr class="">';
            div += '<td class="terminal_detalles_titulo">Dirección IP</td>';
            div += '<td id="tdDireccionIP" class="terminal_detalles_valor">' + datos[i].direccionIP;
            div += '</td>';
            div += '</tr>';
            div += '<tr class="terminal_detalles_spacer"></tr>';
            div += '<tr class="">';
            div += '<td class="terminal_detalles_titulo">Ubicación</td>';
            div += '<td id="tdUbicacion" class="terminal_detalles_valor">' + datos[i].ubicacion;
            div += '</td>';
            div += '</tr>';
            div += '<tr class="terminal_detalles_spacer"></tr>';
            div += '<tr class="">';
            div += '<td class="terminal_detalles_titulo">Serie</td>';
            div += '<td id="tdSerie" class="terminal_detalles_valor">' + datos[i].numSerie;
            div += '</td>';
            div += '</tr>';
            div += '</tbody>';
            div += '</table>';
            div += '</div>';

            div += '</div>'; // terminal_detalles row

            div += '<div class="terminal_parrafo">';
            div += '<div id="dvFallaAlerta" >';
            div += '<table class="table table-bordered" style="background-color:white;">';
            div += '<thead>';
            div += '</thead>';
            div += '<tbody>';
            div += '<tr>';
            div += '<td class="terminal_parrafo_header" id="tdTituloFechaFallaAlerta" >' + 'Fecha Falla / Alerta' + '</td>';
            div += '<td class="terminal_parrafo_titulo" id="tdFechaFallaAlerta" >' + datos[i].fechaUltimaFalla + '</td>';
            div += '</tr>';
            div += '<tr>';
            div += '<td class="terminal_parrafo_cuerpo" id="tdTituloFechaFallaAlerta" colspan="2">';
            div += datos[i].detalle
            div += '</td>';
            div += '</tr>';
            div += '</tbody>';
            div += '</table>';
            div += '</div>';
            div += '</div>'; // terminal_parrafo row
            
            // -------------------------------------------------   
            $("#ulPaginacion").append(div);
        };
    }
}
function creaGraficosEnLineaold(){
    
    var datos = ObtenerDetalleEquiposXSucursal(IDCLIENTE, _idsucursal);//Llamado a método que se comunica con el servicio REST para obtener la data

    var nombreBtn = "";
    var totEquEnLinea = "";
    var totEquFueraLinea = "";
    var totEqFueraLineaPend = "";
    var nombreBtnPer = "";
    var div = "";
    var semaforoColor = "";

    $("#ulPaginacion").empty();
    
    $("#DescripcionSucursal").html(unescape(_tituloSeleccionado));

    if(datos.length < 5){
        $('.holder').css('display','none');
    }else{
        $('.holder').css('display','block');
    }


    for (var i = 0; i < datos.length; i++) 
    {

        if(datos[i].detEstadoGral == "Normal")
        {
            semaforoColor = 'semaforoVerde.jpg';
        }else if(datos[i].detEstadoGral == "Alerta")
        {
            semaforoColor = 'semaforoAmarillo.jpg';
        }else if(datos[i].detEstadoGral == "Falla")
        {
            semaforoColor = 'semaforoRojo.jpg';
        }


        // Nuevo estilo -------------------------------------------------

        /** Variables y validación de color según estados **/
        var estadoColorComunicacion = "";
        var estadoColorAplicacion = "";
        var estadoColorCamara = "";
        var estadoColorHost = "";
        var estadoColorImpresora = "";
        var estadoColorLBM = "";
        var estadoColorTouch = "";
        var estadoColorTempCPU = "";
        var estadoColorUtilizacionCPU= "";
        var estadoColorUtilizacionDisco = "";
        var estadoColorUtilizacionMemoria = "";

        if(datos[i].comunicacion == "1"){
            estadoColorComunicacion = "#92d283";
        }else{
            estadoColorComunicacion = "#ea5942";
        }

        if(datos[i].aplicacion == "nor"){
            estadoColorAplicacion = "#92d283";
        }
        else if(datos[i].aplicacion == "ale"){
            estadoColorAplicacion = "#FBBC05";
        }
        else if(datos[i].aplicacion == "fal"){
            estadoColorAplicacion = "#ea5942";
        }else{
            estadoColorAplicacion = "#bbb";
        }

        if(datos[i].host == "nor"){
            estadoColorHost = "#92d283";
        }
        else if(datos[i].host == "ale"){
            estadoColorHost = "#FBBC05";
        }
        else if(datos[i].host == "fal"){
            estadoColorHost = "#ea5942";
        }else{
            estadoColorHost = "#bbb";
        }

        if(datos[i].impresora == "nor"){
            estadoColorImpresora = "#92d283";
        }
        else if(datos[i].impresora == "ale"){
            estadoColorImpresora = "#FBBC05";
        }
        else if(datos[i].impresora == "fal"){
            estadoColorImpresora = "#ea5942";
        }else{
            estadoColorImpresora = "#bbb";
        }

        if(datos[i].lbm == "nor"){
            estadoColorLBM = "#92d283";
        }
        else if(datos[i].lbm == "ale"){
            estadoColorLBM = "#FBBC05";
        }
        else if(datos[i].lbm == "fal"){
            estadoColorLBM = "#ea5942";
        }else{
            estadoColorLBM = "#bbb";
        }

        if(datos[i].touch == "nor"){
            estadoColorTouch = "#92d283";
        }
        else if(datos[i].touch == "ale"){
            estadoColorTouch = "#FBBC05";
        }
        else if(datos[i].touch == "fal"){
            estadoColorTouch = "#ea5942";
        }else{
            estadoColorTouch = "#bbb";
        }

        if(datos[i].tempCPU == "nor"){
            estadoColorTempCPU = "#92d283";
        }
        else if(datos[i].tempCPU == "ale"){
            estadoColorTempCPU = "#FBBC05";
        }
        else if(datos[i].tempCPU == "fal"){
            estadoColorTempCPU = "#ea5942";
        }else{
            estadoColorTempCPU = "#bbb";
        }

        if(datos[i].usoCPU == "nor"){
            estadoColorUtilizacionCPU = "#92d283";
        }
        else if(datos[i].usoCPU == "ale"){
            estadoColorUtilizacionCPU = "#FBBC05";
        }
        else if(datos[i].usoCPU == "fal"){
            estadoColorUtilizacionCPU = "#ea5942";
        }else{
            estadoColorUtilizacionCPU = "#bbb";
        }

        if(datos[i].usoDisco == "nor"){
            estadoColorUtilizacionDisco = "#92d283";
        }
        else if(datos[i].usoDisco == "ale"){
            estadoColorUtilizacionDisco = "#FBBC05";
        }
        else if(datos[i].usoDisco == "fal"){
            estadoColorUtilizacionDisco = "#ea5942";
        }else{
            estadoColorUtilizacionDisco = "#bbb";
        }

        if(datos[i].usoMemoria == "nor"){
            estadoColorUtilizacionMemoria = "#92d283";
        }
        else if(datos[i].usoMemoria == "ale"){
            estadoColorUtilizacionMemoria = "#FBBC05";
        }
        else if(datos[i].usoMemoria == "fal"){
            estadoColorUtilizacionMemoria = "#ea5942";
        }else{
            estadoColorUtilizacionMemoria = "#bbb";
        }


        var div = '<div class="row contenedorCmr' + (datos.length == 1 ? " itemUnico" : "") + '" >';
        div+= '<div class="headerVerde">ID ' + datos[i].idEquipo + '</div>';   

        div+= '<div class="terminal_leds">';
    
        div+= '  <div class="col semaforo semaforo_' + datos[i].detEstadoGral + '"></div>';
        
        div+= '  <div class="col terminal_leds_col">';  
        div+= '     <div class="terminal_led_item">Comunicación';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorComunicacion +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Aplicación';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorAplicacion +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Host';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorHost +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Impresora';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorImpresora +'"></div>';
        div+= '     </div>';
        div+= '  </div>';

        div+= '  <div class="col terminal_leds_col">';  
        div+= '     <div class="terminal_led_item">Lector BM';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorLBM +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Temp. Cpu';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorTempCPU +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Estado Touch';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorTouch +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Uso CPU';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorUtilizacionCPU +'"></div>';
        div+= '     </div>';
        div+= '  </div>';

        div+= '  <div class="col terminal_leds_col">';  
        div+= '     <div class="terminal_led_item">Uso Disco';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorUtilizacionDisco +'"></div>';
        div+= '     </div>';
        div+= '     <div class="terminal_led_item">Uso Memoria';  
        div+= '         <div class="terminal_led_sem" style="background-color:'+ estadoColorUtilizacionMemoria +'"></div>';
        div+= '     </div>';
        div+= '  </div>';

        div+= '</div>'; // terminal_leds row

        div += '<div class="terminal_detalles">';

        div +=                  '<div  class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
        div +=                      '<table class="table table-bordered" style="1px solid #ccc; background-color:white; margin-top:10px;">';
        div +=                          '<thead>';                 
        div +=                          '</thead>';                            
        div +=                          '<tbody>';
        div +=                              '<tr class="">';
        div +=                                  '<td class="terminal_detalles_titulo" valign="middle">Estado General</td>';                  
        div +=                                  '<td id="tdEstadoGeneral" class="terminal_detalles_valor">' + datos[i].detEstadoGral + '</td>';     
        div +=                              '</tr>';                              
        div +=                              '<tr class="terminal_detalles_spacer"></tr>';
        div +=                              '<tr class="">';
        div +=                                  '<td class="terminal_detalles_titulo">Condición Monitoreo</td>';                  
        div +=                                  '<td id="tdCondicionMonitoreo" class="terminal_detalles_valor">' + datos[i].detCondMonitoreo  + '</td>';     
        div +=                              '</tr>';                   
        div +=                              '<tr class="terminal_detalles_spacer"></tr>';
        div +=                              '<tr class="">';                       
        div +=                                  '<td class="terminal_detalles_titulo">Tipo Equipo</td>';                       
        div +=                                  '<td id="tdTipoEquipo" class="terminal_detalles_valor">' + datos[i].detTipoEquipo + '</td>';                                              
        div +=                              '</tr>';
        div +=                          '</tbody>';                       
        div +=                      '</table>';                       
        div +=                  '</div>';

        div +=                  '<div  class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
        div +=                      '<table class="table table-bordered" style="1px solid #ccc; background-color:white; margin-top:10px;">';
        div +=                          '<thead>';                 
        div +=                          '</thead>';                            
        div +=                          '<tbody>';                     
        div +=                              '<tr class="">';                        
        div +=                                  '<td class="terminal_detalles_titulo">Dirección IP</td>';                    
        div +=                                  '<td id="tdDireccionIP" class="terminal_detalles_valor">' + datos[i].direccionIP;                        
        div +=                                  '</td>';                            
        div +=                              '</tr>';                        
        div +=                              '<tr class="terminal_detalles_spacer"></tr>';
        div +=                              '<tr class="">';                        
        div +=                                  '<td class="terminal_detalles_titulo">Ubicación</td>';                          
        div +=                                  '<td id="tdUbicacion" class="terminal_detalles_valor">' + datos[i].ubicacion;                            
        div +=                                  '</td>';                       
        div +=                              '</tr>';                       
        div +=                              '<tr class="terminal_detalles_spacer"></tr>';
        div +=                              '<tr class="">';                    
        div +=                                  '<td class="terminal_detalles_titulo">Serie</td>';                           
        div +=                                  '<td id="tdSerie" class="terminal_detalles_valor">' + datos[i].numSerie;                            
        div +=                                  '</td>';                        
        div +=                              '</tr>';
        div +=                          '</tbody>';                       
        div +=                      '</table>';                       
        div +=                  '</div>';

        div += '</div>'; // terminal_detalles row

        div+= '<div class="terminal_parrafo">';
        div +=                  '<div id="dvFallaAlerta" >';              
        div +=                      '<table class="table table-bordered" style="background-color:white;">';         
        div +=                          '<thead>';                             
        div +=                          '</thead>';                     
        div +=                          '<tbody>';                      
        div +=                              '<tr>';
        div +=                                  '<td class="terminal_parrafo_header" id="tdTituloFechaFallaAlerta" >' + 'Fecha Falla / Alerta' + '</td>';                  
        div +=                                  '<td class="terminal_parrafo_titulo" id="tdFechaFallaAlerta" >' + datos[i].fechaUltimaFalla + '</td>';
        div +=                              '</tr>';
        div +=                              '<tr>';
        div +=                                  '<td class="terminal_parrafo_cuerpo" id="tdTituloFechaFallaAlerta" colspan="2">';
        div +=                                      datos[i].detalle
        div +=                                  '</td>';                
        div +=                              '</tr>';        
        div +=                          '</tbody>';                 
        div +=                      '</table>';                        
        div +=                  '</div>';
        div+= '</div>'; // terminal_parrafo row

        // -------------------------------------------------   
        $("#ulPaginacion").append(div);	
    }

}