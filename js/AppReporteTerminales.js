/**********
Versión: 2.1.1
Fecha Modificado: 18-10-2017
Creado Por: Juan González
Modificado por: Juan González
***********/

/*var idCliente = 26;*/
var _nivel = 0;
var _idZonaRetail = 0;
var _idOrganizacion = 0;
var _idSucursal = 0;
var _idEstadoTerminal = 0;
var _idFormato = 0;
var _idTipoTerminal = "TODOS";
var _idCondicionMonitoreo = 0;
var _idEquipoSeleccionado = 0;

$(document).ready(function () {
    /**/
    $("#myModal").modal('show');
    _equipo = $.get("equipo");
    _desequipo = $.get("desequipo");
    _idSucursal = $.get("sucursal");
    _idZonaRetail = $.get("zona");
    _idEstadoTerminal = $.get("seleccionado");
    _tituloSeleccionado = decodeURIComponent(escape($.get("titulo")));
    $("#tituloprinc").html("DashBoard Detalle Terminales :" + _tituloSeleccionado);
    if (_idSucursal == null) { _idSucursal = 0; }
    if (_idZonaRetail == null) { _idZonaRetail = 0; }
    if (_tituloSeleccionado == null) { _tituloSeleccionado = ""; }
    /**/

    $('#btnVerDetalle').css("display", "none");
    
    CargaCombos(_nivel, _idFormato, _idZonaRetail, _idSucursal, _idEstadoTerminal, _idCondicionMonitoreo, _idTipoTerminal);
    CargaListadoGeneral(_idZonaRetail, _idOrganizacion, _idSucursal, _idEstadoTerminal, _equipo, _idCondicionMonitoreo);

    //selecciona combos dependiendo preferencias recibidas por parametros
    SelectedEstadoTerminal(_idEstadoTerminal);
    SelectedEstadoZona(_idZonaRetail);
    SelectedEstadoSucursal(_idSucursal);

   //eventos de cambio en selección de algun combo
    $("#stEstadoTerminal").change(function () {
        var idEstadoTerminalSelect = $(this).val();
        //if(idEstadoTerminalSelect == "0"){
            //_idZonaRetail = 0;
            _idOrganizacion = 0;
            _idSucursal = 0;
            _idEstadoTerminal = 0;
            _idTipoTerminal = "TODOS";
            _idCondicionMonitoreo = 0;
        //}
        CargaListadoGeneral(_idZonaRetail, _idOrganizacion, _idSucursal, idEstadoTerminalSelect, _idTipoTerminal, _idCondicionMonitoreo);

        GetFormatoCombo(_nivel, _idZonaRetail, _idSucursal, idEstadoTerminalSelect);
        GetZonasCombo(_nivel, _idZonaRetail, _idSucursal, idEstadoTerminalSelect, _idOrganizacion);
        GetSucursalesCombo(_nivel, _idOrganizacion, _idZonaRetail, _idSucursal, idEstadoTerminalSelect);
        //GetTipoTerminalesCombo(_nivel, _idOrganizacion, _idZonaRetail, _idSucursal, idEstadoTerminalSelect);
        GetCondicionMonitoreoCombo(idEstadoTerminalSelect, _idOrganizacion, _idZonaRetail, _idSucursal, _idTipoTerminal, _idCondicionMonitoreo);

        _idEstadoTerminal = idEstadoTerminalSelect;
    });

   $( "#stFormato" ).change(function() {
        var idFormatoSelect = $(this).val();
        //debugger;
        _idZonaRetail = 0;
        _idSucursal = 0;
        _idTipoTerminal = "TODOS";
        _idCondicionMonitoreo = 0;

        CargaListadoGeneral(_idZonaRetail, idFormatoSelect, _idSucursal, _idEstadoTerminal, _idTipoTerminal, _idCondicionMonitoreo);

        GetZonasCombo(_nivel, _idZonaRetail, _idSucursal, _idEstadoTerminal, idFormatoSelect);
        GetSucursalesCombo(_nivel, idFormatoSelect, _idZonaRetail, _idSucursal, _idEstadoTerminal);
        //GetTipoTerminalesCombo(_nivel, idFormatoSelect, _idZonaRetail, _idSucursal, _idEstadoTerminal);
        GetCondicionMonitoreoCombo(_idEstadoTerminal, idFormatoSelect, _idZonaRetail, _idSucursal, _idTipoTerminal, _idCondicionMonitoreo);

        _idOrganizacion = idFormatoSelect;
    });

    $( "#stZona" ).change(function() {
        var idZonaSelect = $(this).val();
        //debugger;
        _idSucursal = 0;
        _idTipoTerminal = "TODOS";
        _idCondicionMonitoreo = 0;

        CargaListadoGeneral(idZonaSelect, _idOrganizacion, _idSucursal, _idEstadoTerminal, _idTipoTerminal, _idCondicionMonitoreo);
        
        GetSucursalesCombo(_nivel, _idOrganizacion, idZonaSelect, _idSucursal, _idEstadoTerminal);
        //GetTipoTerminalesCombo(_nivel, _idOrganizacion, idZonaSelect, _idSucursal, _idEstadoTerminal);
        GetCondicionMonitoreoCombo(_idEstadoTerminal, _idOrganizacion, idZonaSelect, _idSucursal, _idTipoTerminal, _idCondicionMonitoreo);

        _idZonaRetail = idZonaSelect;
    });

    $( "#stSucursal" ).change(function() {
        var idScursalSelect = $(this).val();
        _idTipoTerminal = "TODOS";
        _idCondicionMonitoreo = 0;
        CargaListadoGeneral(_idZonaRetail, _idOrganizacion, idScursalSelect, _idEstadoTerminal, _idTipoTerminal, _idCondicionMonitoreo);
        //GetTipoTerminalesCombo(_nivel, _idOrganizacion, _idZonaRetail, idScursalSelect, _idEstadoTerminal);
        GetCondicionMonitoreoCombo(_idEstadoTerminal, _idOrganizacion, _idZonaRetail, idScursalSelect, _idTipoTerminal, _idCondicionMonitoreo);
        _idSucursal = idScursalSelect;
    });

    $( "#stTipoTerminal" ).change(function() {
        var idTipoTerminalSelect = $(this).val();
        
        if(idTipoTerminalSelect == 0){
            idTipoTerminalSelect = "TODOS"; 
        }
        _idCondicionMonitoreo = 0;

        CargaListadoGeneral(_idZonaRetail, _idOrganizacion, _idSucursal, _idEstadoTerminal, idTipoTerminalSelect, _idCondicionMonitoreo);
        GetCondicionMonitoreoCombo(_idEstadoTerminal, _idOrganizacion, _idZonaRetail, _idSucursal, idTipoTerminalSelect, _idCondicionMonitoreo);
        
        _idTipoTerminal = idTipoTerminalSelect;
    });

    $( "#stCondicionMonitoreo" ).change(function() {
        var idCondicionMonitoreoSelect = $(this).val();
        _idCondicionMonitoreo = idCondicionMonitoreoSelect;

        CargaListadoGeneral(_idZonaRetail, _idOrganizacion, _idSucursal, _idEstadoTerminal, _idTipoTerminal, idCondicionMonitoreoSelect);
        idCondicionMonitoreoSelect = 0;
        GetCondicionMonitoreoCombo(_idEstadoTerminal, _idOrganizacion, _idZonaRetail, _idSucursal, _idTipoTerminal, idCondicionMonitoreoSelect);

        
        $("#stCondicionMonitoreo").val(_idCondicionMonitoreo);
    });

});

function Volver(){
    $("#myModal").modal();
    setTimeout(function(){history.back();}, 1000);
}

function SelectedEstadoTerminal(idSeleccionado){
    if(idSeleccionado == 0){//TODOS
        $('#stEstadoTerminal option:eq(0)').prop('selected', true);
    }
    else if(idSeleccionado == 1){//OPERATIVOS
        $('#stEstadoTerminal option:eq(1)').prop('selected', true);
    }
    else if(idSeleccionado == 3){//FALLA
        $('#stEstadoTerminal option:eq(2)').prop('selected', true);
    }
    else{
        $('#stEstadoTerminal option:eq(0)').prop('selected', true);
    }
}

function SelectedEstadoZona(zonaSeleccionada){
        var optionZona = $('#stZona option');
        for(var i=0;i<optionZona.length;i++){
            if(optionZona[i].value == zonaSeleccionada){
                $('#stZona option:eq(' + i + ')').prop('selected', true);
                return;
            }
        }
    }

function SelectedEstadoSucursal(sucursalSeleccionada){
        var optionSucursal = $('#stSucursal option');
        for(var i=0;i<optionSucursal.length;i++){
            if(optionSucursal[i].value == sucursalSeleccionada){
                $('#stSucursal option:eq(' + i + ')').prop('selected', true);
                return;
            }
        }
    }

/*Carga TODOS los Combos*/
function CargaCombos(nivel, idFormato, idZonaRetail, idSucursal, estGral, idCondicionMonitoreo, idTipoTerminal){

    GetFormatoCombo(nivel, idZonaRetail, idSucursal, estGral);
    GetZonasCombo(nivel, idZonaRetail, idSucursal, estGral, idFormato);
    GetSucursalesCombo(nivel, idFormato, idZonaRetail, idSucursal, estGral );
    //GetTipoTerminalesCombo(nivel, idFormato, idZonaRetail, idSucursal, estGral);
    GetCondicionMonitoreoCombo(estGral, idFormato, idZonaRetail, idSucursal, idTipoTerminal, idCondicionMonitoreo);
}

/*OK Formato (Organizaciones)*/
function GetFormatoCombo(nivel, idZonaRetail, idSucursal, estGral) {
    var datos = GetOrganizaciones(IDCLIENTE, nivel, idZonaRetail, idSucursal, estGral, _equipo);
    var HTMLDiv = "";
    $("#stFormato").empty();
    HTMLDiv += '<option value="0">Todos</option>';

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<option value="' + datos[i].idOrganizacion + '">' + datos[i].nombreOrganizacion + '</option>';
    }

    $("#stFormato").append(HTMLDiv);
}

/*OK Zonas*/
function GetZonasCombo(nivel, idZonaRetail, idSucursal, estGral, idFormato) {
    var datos = GetZonasRetail(IDCLIENTE, nivel, idZonaRetail, idSucursal, estGral, idFormato, _equipo);
    var HTMLDiv = "";

    $("#stZona").empty();
    HTMLDiv += '<option value="0">Todos</option>';

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<option value="' + datos[i].idZonaComercial + '">' + datos[i].descripcion + '</option>';
    }

    $("#stZona").append(HTMLDiv);
}

/*OK Sucursales*/
function GetSucursalesCombo(nivel, idFormato, idZonaRetail, idSucursal, estGral) {
    var datos = GetSucursales(IDCLIENTE, nivel, idFormato, idZonaRetail, idSucursal, estGral, _equipo);
    var HTMLDiv = "";
    
    $("#stSucursal").empty();

    HTMLDiv += '<option value="0">Todos</option>';

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<option value="' + datos[i].idSucursal + '">' + datos[i].nombreSucursal + '</option>';
    }

    $("#stSucursal").append(HTMLDiv);
}

/*Tipo Terminales*/
/*
function GetTipoTerminalesCombo(nivel, idFormato, idZonaRetail, idSucursal, estGral){

    var datos = GetTipoTerminales(idCliente, nivel, idFormato, idZonaRetail, idSucursal, estGral);
    var HTMLDiv = "";

    $("#stTipoTerminal").empty();

    HTMLDiv += '<option value="0">Todos</option>';

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<option value="' + datos[i].idEquipo + '">' + datos[i].detalleTipoEquipo + '</option>';
    }

    $("#stTipoTerminal").append(HTMLDiv);
}
*/
/*OK- Condición Monitoreo*/
function GetCondicionMonitoreoCombo(estGral, idFormato, idZonaRetail, idSucursal, idTipoTerminal, idCondicionMonitoreo){
    
    var datos = GetCondicionMonitoreo(IDCLIENTE, estGral, idFormato, idZonaRetail, idSucursal, idTipoTerminal, idCondicionMonitoreo);
    var HTMLDiv = "";
    
    $("#stCondicionMonitoreo").empty();

    HTMLDiv += '<option value="0">Todos</option>';

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<option value="' + datos[i].idCondicion + '">' + datos[i].detalleCondicionMonitoreo + '</option>';
    }

    $("#stCondicionMonitoreo").append(HTMLDiv);
}

function CargaListadoGeneral(idZonaRetail, idOrganizacion, idSucursal, idEstadoTerminal, idTipoTerminal, idCondicionMonitoreo) {
    var datos = GetDetalleEquiposXNivel(IDCLIENTE, idZonaRetail, idOrganizacion, idSucursal, idEstadoTerminal, idTipoTerminal, idCondicionMonitoreo);
    var HTMLDiv = "";

    $("#tbListadoGeneral tbody").empty();

    for (var i = 0; i < datos.length; i++) 
    {
        HTMLDiv += '<tr onclick="verDetalles(event)" class="detalle_unsel">';
        HTMLDiv +=      '<td>' + datos[i].detOrganizacion + '</td>';
        HTMLDiv +=      '<td>' + datos[i].detZonaComercial + '</td>';
        HTMLDiv +=      '<td>' + datos[i].detSucursal + '</td>';
        HTMLDiv +=      '<td>' + datos[i].idEquipo + '</td>';
        HTMLDiv +=      '<td>' + datos[i].detTipoEquipo + '</td>';
        HTMLDiv +=      '<td>' + datos[i].detEstadoGral + '</td>';
        HTMLDiv +=      '<td>' + datos[i].detCondMonitoreo + '</td>';
        HTMLDiv += '/<tr>';
    }

    $("#tbListadoGeneral tbody").append(HTMLDiv);
    $("#myModal").modal('hide');
}

//LLama a obtener DETALLE ESTADO TERMINAL, al hacer click en una fila de LISTADO GENERAL
var currentSel;
function verDetalles(evt) { 
    var idEquipoSeleccionado = evt.currentTarget.cells[3].innerHTML;
    var datos = GetDetalleEquipos(idEquipoSeleccionado);
    var HTMLDiv = "";

    _idEquipoSeleccionado = idEquipoSeleccionado;
    $('#btnVerDetalle').css("display", "block");

    try{currentSel.className = "detalle_unsel"}catch(e){};
    currentSel = evt.currentTarget;
    evt.currentTarget.className = "detalle_sel";

    for (var i = 0; i < datos.length; i++) 
    {
        $("#tdDET_Serie").html(datos[i].numSerie);
        $("#tdDET_Ip").html(datos[i].direccionIP);
        $("#tdDET_Ubicacion").html(datos[i].ubicacion);

        $("#tdDET_FechaEvento").html(datos[i].fechaEvento);
        $("#tdDET_UltimaFalla").html(datos[i].fechaUltimaFalla);
        $("#tdDET_Descripcion").html(datos[i].detalle);

        ////debugger;
        if(datos[i].comunicacion == "1") //normal verde
        {
            $("#dvDET_Comunicacion").css("background-color", "#92d283");
            $("#dvDET_Comunicacion").css("color", "#92d283");

        }
        else if(datos[i].comunicacion == "0"){//falla rojo
            $("#dvDET_Comunicacion").css("background-color", "#ea5942");
            $("#dvDET_Comunicacion").css("color", "#ea5942");
        }
        else if(datos[i].comunicacion == "ale"){//alerta amarillo
            $("#dvDET_Comunicacion").css("background-color", "#ffb800");
            $("#dvDET_Comunicacion").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_Comunicacion").css("background-color", "#bbb");
            $("#dvDET_Comunicacion").css("color", "#bbb");
        }        

        if(datos[i].aplicacion == "nor") //normal verde
        {
            $("#dvDET_Aplicación").css("background-color", "#92d283");
            $("#dvDET_Aplicación").css("color", "#92d283");
        }
        else if(datos[i].aplicacion == "fal"){//falla rojo
            $("#dvDET_Aplicación").css("background-color", "#ea5942");
            $("#dvDET_Aplicación").css("color", "#ea5942");
        }
        else if(datos[i].aplicacion == "ale"){//alerta amarillo
            $("#dvDET_Aplicación").css("background-color", "#ffb800");
            $("#dvDET_Aplicación").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_Aplicación").css("background-color", "#bbb");
            $("#dvDET_Aplicación").css("color", "#bbb");
        }  

        if(datos[i].host == "nor") //normal verde
        {
            $("#dvDET_Host").css("background-color", "#92d283");
            $("#dvDET_Host").css("color", "#92d283");

        }
        else if(datos[i].host == "fal"){//falla rojo
            $("#dvDET_Host").css("background-color", "#ea5942");
            $("#dvDET_Host").css("color", "#ea5942");
        }
        else if(datos[i].host == "ale"){//alerta amarillo
            $("#dvDET_Host").css("background-color", "#ffb800");
            $("#dvDET_Host").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_Host").css("background-color", "#bbb");
            $("#dvDET_Host").css("color", "#bbb");
        }  

        if(datos[i].impresora == "nor") //normal verde
        {
            $("#dvDET_Impresora").css("background-color", "#92d283");
            $("#dvDET_Impresora").css("color", "#92d283");

        }
        else if(datos[i].impresora == "fal"){//falla rojo
            $("#dvDET_Impresora").css("background-color", "#ea5942");
            $("#dvDET_Impresora").css("color", "#ea5942");
        }
        else if(datos[i].impresora == "ale"){//alerta amarillo
            $("#dvDET_Impresora").css("background-color", "#ffb800");
            $("#dvDET_Impresora").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_Impresora").css("background-color", "#bbb");
            $("#dvDET_Impresora").css("color", "#bbb");
        }  

        if(datos[i].lbm == "nor") //normal verde
        {
            $("#dvDET_LectorBM").css("background-color", "#92d283");
            $("#dvDET_LectorBM").css("color", "#92d283");

        }
        else if(datos[i].lbm == "fal"){//falla rojo
            $("#dvDET_LectorBM").css("background-color", "#ea5942");
            $("#dvDET_LectorBM").css("color", "#ea5942");
        }
        else if(datos[i].lbm == "ale"){//alerta amarillo
            $("#dvDET_LectorBM").css("background-color", "#ffb800");
            $("#dvDET_LectorBM").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_LectorBM").css("background-color", "#bbb");
            $("#dvDET_LectorBM").css("color", "#bbb");
        }  

        if(datos[i].touch == "nor") //normal verde
        {
            $("#dvDET_EstadoTouch").css("background-color", "#92d283");
            $("#dvDET_EstadoTouch").css("color", "#92d283");

        }
        else if(datos[i].touch == "fal"){//falla rojo
            $("#dvDET_EstadoTouch").css("background-color", "#ea5942");
            $("#dvDET_EstadoTouch").css("color", "#ea5942");
        }
        else if(datos[i].touch == "ale"){//alerta amarillo
            $("#dvDET_EstadoTouch").css("background-color", "#ffb800");
            $("#dvDET_EstadoTouch").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_EstadoTouch").css("background-color", "#bbb");
            $("#dvDET_EstadoTouch").css("color", "#bbb");
        }  

        if(datos[i].tempCPU == "nor") //normal verde
        {
            $("#dvDET_TempCPU").css("background-color", "#92d283");
            $("#dvDET_TempCPU").css("color", "#92d283");
        }
        else if(datos[i].tempCPU == "fal"){//falla rojo
            $("#dvDET_TempCPU").css("background-color", "#ea5942");
            $("#dvDET_TempCPU").css("color", "#ea5942");
        }
        else if(datos[i].tempCPU == "ale"){//alerta amarillo
            $("#dvDET_TempCPU").css("background-color", "#ffb800");
            $("#dvDET_TempCPU").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_TempCPU").css("background-color", "#bbb");
            $("#dvDET_TempCPU").css("color", "#bbb");
        }  

        if(datos[i].usoCPU == "nor") //normal verde
        {
            $("#dvDET_UsoCPU").css("background-color", "#92d283");
            $("#dvDET_UsoCPU").css("color", "#92d283");

        }
        else if(datos[i].usoCPU == "fal"){//falla rojo
            $("#dvDET_UsoCPU").css("background-color", "#ea5942");
            $("#dvDET_UsoCPU").css("color", "#ea5942");
        }
        else if(datos[i].usoCPU == "ale"){//alerta amarillo
            $("#dvDET_UsoCPU").css("background-color", "#ffb800");
            $("#dvDET_UsoCPU").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_UsoCPU").css("background-color", "#bbb");
            $("#dvDET_UsoCPU").css("color", "#bbb");
        }  

        if(datos[i].usoDisco == "nor") //normal verde
        {
            $("#dvDET_UsoDisco").css("background-color", "#92d283");
            $("#dvDET_UsoDisco").css("color", "#92d283");

        }
        else if(datos[i].usoDisco == "fal"){//falla rojo
            $("#dvDET_UsoDisco").css("background-color", "#ea5942");
            $("#dvDET_UsoDisco").css("color", "#ea5942");
        }
        else if(datos[i].usoDisco == "ale"){//alerta amarillo
            $("#dvDET_UsoDisco").css("background-color", "#ffb800");
            $("#dvDET_UsoDisco").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_UsoDisco").css("background-color", "#bbb");
            $("#dvDET_UsoDisco").css("color", "#bbb");
        }  

        if(datos[i].usoMemoria == "nor") //normal verde
        {
            $("#dvDET_UsoMemoria").css("background-color", "#92d283");
            $("#dvDET_UsoMemoria").css("color", "#92d283");

        }
        else if(datos[i].usoMemoria == "fal"){//falla rojo
            $("#dvDET_UsoMemoria").css("background-color", "#ea5942");
            $("#dvDET_UsoMemoria").css("color", "#ea5942");
        }
        else if(datos[i].usoMemoria == "ale"){//alerta amarillo
            $("#dvDET_UsoMemoria").css("background-color", "#ffb800");
            $("#dvDET_UsoMemoria").css("color", "#ffb800");
        }
        else{//blanco
            $("#dvDET_UsoMemoria").css("background-color", "#bbb");
            $("#dvDET_UsoMemoria").css("color", "#bbb");
        }  
        
    }
}

function AbrirDetalle(){
        var vars = "" + _idEquipoSeleccionado;
        window.open("../ReporteDetalle/Detalle/detalle.html?" + vars, "_blank");
        /*window.location.target = "_blank"; 
        window.location.href = "../ReporteDetalle/Detalle/detalle.html";*/
    }