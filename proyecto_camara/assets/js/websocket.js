//WEBSOCKET
    var direccion_servidor_ws = "192.168.1.2:8443";
	// Initialize WebSocket connection and event handlers
	
	function setup() {
		ws = new WebSocket("wss://"+direccion_servidor_ws);
		
		//cuatro WEBSOCKET EVENTOS open, close, error, message
		// Listen for the connection open event then call the sendMessage function
		ws.onopen = function(e) {
			//console.log("Connectado");
			//log(ws.protocol);
			//log("readyState: "+ws.readyState);
			//sendMessage("Hello WebSocket!")
			sendMessage("Hola - cliente proyecto camara");
		}
		// Listen for the close connection event
		ws.onclose = function(e) {
			//log("Disconnected: " + e.reason);
			//console.log("Desconectado"+e.data);

			//ocurre cuando el dispositivo no tiene soporte para html5 o el servidor websocket esta desconectado
		}
		// Listen for connection errors
		ws.onerror = function(e) {
			//log("Error ");
			//console.log("Error"+e);
			
		}
		// Listen for new messages arriving at the client
		ws.onmessage = function(e) {
			
			var datosRecibidos = "";
			datosRecibidos = e.data;
			console.log(e.data);
			
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