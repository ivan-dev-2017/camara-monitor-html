//WEBSOCKET
var direccion_servidor_ws = "192.168.1.2:8443";
var id_websocket=0;
// Initialize WebSocket connection and event handlers

function setup() {
    ws = new WebSocket("wss://"+direccion_servidor_ws);

    ws.onopen = function(e) {

        sendMessage("monitor-inicio");
    }

    ws.onclose = function(e) {
        console.log("Disconnected: " + e.reason);
    }

    ws.onerror = function(e) {
        console.log("Error: "+e);
        
    }
    // Listen for new messages arriving at the client
    var clientes = [];
    ws.onmessage = function(e) {
        
        //mesaje enviado desde el servidor
        let identificadorMensaje = e.data.split("-");
        if('numeroConexion' === identificadorMensaje[1]){ 
          id_websocket = identificadorMensaje[2];
          console.log("id_websocket cliente:"+id_websocket);
        }
        else{
            console.log("monitor otro mensaje: "+ e.data); 
            //buscar id cliente
            let existeCliente =  clientes.indexOf(identificadorMensaje[1]);

            //no existe el cliente
            if(existeCliente === -1){
                clientes.push(identificadorMensaje[1]);
                console.log(clientes);
                //$( "#row_monitores" ).append( $( '<div class="col-md-4" id="cliente-'+identificadorMensaje[1]+'"><div>' ) );
                //$( "#cliente-"+identificadorMensaje[1] ).text( identificadorMensaje[2] );


                $( "#row_monitores" ).append( $( '<div class="col-md-4"><canvas id="cliente-'+identificadorMensaje[1]+'" ></canvas><div>' ) );
                var canvas = document.getElementById("cliente-"+identificadorMensaje[1])
                var contexto = canvas.getContext('2d');    
                //contexto.drawImage(identificadorMensaje[2], 0, 0, 100, 100);       
                
                
                var image = new Image();
                image.onload = function() {
                    contexto.drawImage(image, 0, 0, 100, 100);
                };
                image.src = identificadorMensaje[2];               
                //$( "#cliente-"+identificadorMensaje[1] ).text( identificadorMensaje[2] );                                

                
                //var idCliente = document.getElementById("cliente-"+identificadorMensaje[1]);
                //idCliente.value = identificadorMensaje[2];
                //console.log("clienteId if: "+idCliente.value);
                
            }
            else{
                var canvas = document.getElementById("cliente-"+identificadorMensaje[1])
                var contexto = canvas.getContext('2d');    
                //contexto.drawImage(identificadorMensaje[2], 0, 0, 100, 100);                
                var image = new Image();
                image.onload = function() {
                    contexto.drawImage(image, 0, 0, 100, 100);
                };
                image.src = identificadorMensaje[2];                 
                //$( "#cliente-"+identificadorMensaje[1] ).text( identificadorMensaje[2] );
                //let idCliente = "cliente-"+identificadorMensaje[1];
                //console.log("clienteId else: "+idCliente);
                //$( "#"+idCliente).val(identificadorMensaje[2]);
            }
                     
        }
        
    }
}
//WEBSOCKET METODO Send a message on the WebSocket.
function sendMessage(msg){
    ws.send(msg);		
}

$( "#id_iniciar_conexion" ).click(function() {
    direccion_servidor_ws = $("#txt_ip_servidor_ws").val();
    console.log("set ip websocket server "+direccion_servidor_ws);
    setup();
    console.log("server test conexion");
    
  });    

  $( "#btn_listar_clientes" ).click(function() {
    sendMessage("monitor-listar");
    
  });  

