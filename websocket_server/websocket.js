
// Minimal amount of secure websocket server
var fs = require('fs');

// read ssl certificate

var privateKey = fs.readFileSync('C:/Users/Lion/Desktop/Symfony/websocket_server/certificados/key.pem', 'utf8');
var certificate = fs.readFileSync('C:/Users/Lion/Desktop/Symfony/websocket_server/certificados/cert.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var https = require('https');

//pass in your credentials to create an https server
var httpsServer = https.createServer(credentials);
httpsServer.listen(8443);

var clientes=[];
var id_cliente_monitor = 0;
var numero_clientes = 0;

var monitores=[];
var numero_monitores = 0;

var tempArray=[];

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: httpsServer
});

console.log('SERVER STARTED : '+8443);

wss.on('connection', function connection(ws) {
	//clientes.push(ws);
    ws.on('message', function incoming(message) {
        console.log('message : ', message);
		//es un nuevo cliente?
		if(message == 'cliente-inicio'){
			numero_clientes = clientes.push(id_cliente_monitor);
			
			ws.send('servidor-numeroConexion-' + id_cliente_monitor);
			console.log('numero clientes: '+ (numero_clientes));
			++ id_cliente_monitor;
			
		}
		else if(message == 'monitor-inicio'){
			numero_monitores = monitores.push(ws);
			
			ws.send('servidor-numeroConexion-' + id_cliente_monitor);
			console.log('numero monitores: '+ (numero_monitores));			
			++ id_cliente_monitor;
		}
		else if(message == 'monitor-listar'){

			let clientes_conectados = JSON.stringify(clientes);
			ws.send('servidor-clientes-' + clientes_conectados);

		}		
		else{
			//ws.send('otro mensaje: '+message);
			//wss.clients[0].client.send(message);	
			//tempArray[0].send('OK ;)');	
			for(let monitor of monitores){
				monitor.send(message);
			}
			
		}
		
		
        //ws.send('reply from server : ' + message)
    });

    //console.log('clientes temp');
	//console.log(tempArray);
});
