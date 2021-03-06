const WebSocket = require('ws');

//conexiones tipo emision de video
var clientes=[];
var id_cliente_monitor = 0;
var numero_clientes = 0;

//conexiones tipo monitor
var monitores=[];
var numero_monitores = 0;
 
const wss = new WebSocket.Server({ port: 8080 });

//mesaje inicial
console.log('SERVER WSS STARTED : '+8080); 

wss.on('connection', function connection(ws) {
	//todas las conexiones 
    ws.on('message', function incoming(message) {
        console.log('message : ', message);
		//es un nuevo cliente? del tipo camara
		if(message == 'cliente-inicio'){
			numero_clientes = clientes.push(id_cliente_monitor);			
			ws.send('servidor-numeroConexion-' + id_cliente_monitor);
			console.log('numero clientes: '+ (numero_clientes));
			++ id_cliente_monitor;
			
		}//es un cliente del tipo monitor
		else if(message == 'monitor-inicio'){
			numero_monitores = monitores.push(ws);			
			ws.send('servidor-numeroConexion-' + id_cliente_monitor);
			console.log('numero monitores: '+ (numero_monitores));			
			++ id_cliente_monitor;
		}//en ambiente de pruebas lista todos los clientes: camara y monitor conectados
		else if(message == 'monitor-listar'){
			let clientes_conectados = JSON.stringify(clientes);
			ws.send('servidor-clientes-' + clientes_conectados);
		}//broadcast a todos los clientes tipo monitor conectados(el mensaje es dividido y gestionado en el cliente tipo monitor	
		else{	
			for(let monitor of monitores){
				monitor.send(message);
			}			
		}
		
    });

});
