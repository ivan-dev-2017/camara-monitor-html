//WEBSOCKET cliente camara
var direccion_servidor_ws = "192.168.1.2:8080";
//identificador asignado por el servidor ws
var id_websocket=0;

 
//boton transmitir
var estadoTimerTransmitir = false;
var estadoInicioCamara = false;



$( "#btn_transmitir" ).click(function() {  

  //conectar servidor ws
  direccion_servidor_ws = $("#txt_ip_servidor_ws").val();
  console.log("ip websocket server "+direccion_servidor_ws);
  var promise = new Promise(function(resolve, reject) {

    let controlConexion=false;
    ws = new WebSocket("ws://"+direccion_servidor_ws);

    ws.onopen = function(e) {
        sendMessage("cliente-inicio");
    }
    ws.onclose = function(e) {
        console.log("Disconnected: " + e.reason);
    }
    ws.onerror = function(e) {
        console.log("Error: "+e);   
        //error en la conexión con el servidor ws
        reject(Error("Error de conexion Ws"));
    }
    //mensajes desde el servidor ws
    ws.onmessage = function(e) {
        //console.log(e.data);
        //mesaje enviado desde el servidor
        let identificadorMensaje = e.data.split("-");
        if('numeroConexion' === identificadorMensaje[1]){ 
          id_websocket = identificadorMensaje[2];
          console.log("id_websocket cliente:"+id_websocket);
          //si la conexión fue exitosa          
          resolve("Conexión Ok");
        }
        else{
          console.log("otro mensaje: "+e.data);
        }        
    }

  });

  
  promise.then(function(result) {
    inicioCamara();
    
    
    //intervalo para enviar imagenes al servidor ws
    timerTransmitir = setInterval(relogTransmitir, 2000);
    estadoTimerTransmitir = true;

    console.log(result);
  }, function(err) {
        console.log(err);
      });  

});

//metodo para enviar mesajes hacia el servidor ws
function sendMessage(msg){
  ws.send(msg);		
}

// se ejecuta según el intervalo 
function relogTransmitir() {

  drawCanvas();  
  //envia con el id del cliente camara para que en el cliente monitor pueda mostrarse
  //dependiendo del id+img del cliente camara porque puede haber mas de uno
  sendMessage('cliente-'+id_websocket+'-'+readCanvas());
  console.log('cliente-'+id_websocket+'-'+readCanvas());

}

var video = document.getElementById("video_uno")
var canvas = document.getElementById("canvas_uno")
var contexto = canvas.getContext('2d');  

//se obtiene la camara y microfono del dispositovo
function inicioCamara(){

  var promisifiedOldGUM = function(constraints, successCallback, errorCallback) {

    // se obtiene getUserMedia segun el tipo de navegador
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
  
    //si el navegador no implementa getUserMedia error
    if(!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
  
    // se setorna la llamada como promesa si el navegador es antiguo
    return new Promise(function(successCallback, errorCallback) {
      getUserMedia.call(navigator, constraints, successCallback, errorCallback);
    });          
  }
  
  // navegadores antiguos no implementan mediaDevices es necesario crear un array vacío
  if(navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  //si el navegador no tiene definido getUserMedia retorna la promesa
  if(navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
  }
  
  
  // preferencia de audio y video de la camara.
  var constraints = { audio: true, video: true }
  
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    //se asigna el stream a la etiqueta video 
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      //inicio automático
      video.play();       
    };
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });  
  
}

//toma la imagen de la etiqueta video y la grafíca en la etiqueta canvas
function drawCanvas(){  
  let anchoVideo = $( "#video_uno" ).width();
  let altoVideo = $( "#video_uno" ).height();

  //$( "#canvas_uno" ).width(640);
  //$( "#canvas_uno" ).height(480);
  console.log(anchoVideo+"---video_uno--"+altoVideo);
  console.log(video.videoWidth+"---video.videoWidth--"+video.videoHeight);

  //var video_dimencion = document.getElementById("video_uno");
  //contexto.drawImage(video, 0, 0, video_dimencion.videoWidth, video_dimencion.videoHeight);
  //contexto.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,0, 0, anchoVideo*0.8, altoVideo*0.8);
  contexto.drawImage(video, 0, 0, 300,150);
  
}

//obtiene la imagen en base64 de canvas
function readCanvas(){
  var canvasData = canvas.toDataURL('image/jpeg',1);
  console.log("ini: "+canvasData);
  return canvasData;
  //return canvasData.split(',')[1];  
  //console.log("atob: "+ atob(canvasData.split(',')[1]));
  //console.log("btoa: "+ btoa(canvasData.split(',')[1]));
}