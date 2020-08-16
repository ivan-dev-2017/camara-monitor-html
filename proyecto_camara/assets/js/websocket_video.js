//WEBSOCKET
var direccion_servidor_ws = "192.168.1.2:8443";
var id_websocket=0;
// Initialize WebSocket connection and event handlers


function setup() {
    ws = new WebSocket("wss://"+direccion_servidor_ws);
    

    ws.onopen = function(e) {
        sendMessage("cliente-inicio");
    }

    ws.onclose = function(e) {
        console.log("Disconnected: " + e.reason);
    }

    ws.onerror = function(e) {
        console.log("Error: "+e);
        
    }
    // Listen for new messages arriving at the client
    ws.onmessage = function(e) {
        //console.log(e.data);
        //mesaje enviado desde el servidor
        let identificadorMensaje = e.data.split("-");
        if('numeroConexion' === identificadorMensaje[1]){ 
          id_websocket = identificadorMensaje[2];
          console.log("id_websocket cliente:"+id_websocket);

        }
        else{
          console.log("otro mensaje: "+e.data);
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

//Inicio de camara
$( "#id_iniciar_camara" ).click(function() {
    var promisifiedOldGUM = function(constraints, successCallback, errorCallback) {

        // First get ahold of getUserMedia, if present
        var getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia);
      
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if(!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
      
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(successCallback, errorCallback) {
          getUserMedia.call(navigator, constraints, successCallback, errorCallback);
        });
              
      }
      
      // Older browsers might not implement mediaDevices at all, so we set an empty object first
      if(navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      
      // Some browsers partially implement mediaDevices. We can't just assign an object
      // with getUserMedia as it would overwrite existing properties.
      // Here, we will just add the getUserMedia property if it's missing.
      if(navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
      }
      
      
      // Prefer camera resolution nearest to 1280x720.
      var constraints = { audio: true, video: true };
      
      navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        var video = document.querySelector('video');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
          ws.send(stream);
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
    
  });  

  //diagnostico camara

  $( "#id_listar" ).click(function() {
    let constraintList = document.getElementById("constraintList");
    let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    
    for (let constraint in supportedConstraints) {
      if (supportedConstraints.hasOwnProperty(constraint)) {
        let elem = document.createElement("li");
        
        elem.innerHTML = "<code>" + constraint + "</code>";
        constraintList.appendChild(elem);
      }
    }
  });
  var diagnostico ="";
  
  $( "#id_iniciar" ).click(function() {
    video.play();
  
  });
  
  $( "#btn_pausa" ).click(function() {
    video.pause();
  });
  
  $( "#btn_diagnostico" ).click(function() {
    var listaDispositivos = "";
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      listaDispositivos = listaDispositivos+"enumerateDevices() not supported.";
      console.log("enumerateDevices() not supported.");
      $("#txtArea_diagnostico").val(listaDispositivos);
      return;
    }
    
    // List cameras and microphones.
    
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        listaDispositivos = listaDispositivos +" -- "+ device.kind + ": " + device.label +" id = " + device.deviceId;
        $("#txtArea_diagnostico").val(listaDispositivos);
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
      listaDispositivos = listaDispositivos + " -- "+err.name + ": " + err.message;
      $("#txtArea_diagnostico").val(listaDispositivos);
    });  
  
    
    
    //alert(listaDispositivos);
  });  

//generar numeros al azar y enviar al servidor websocket
var estadoTimer = false;
$( "#btn_enviar_numeros_azar" ).click(function() {  

  if(!estadoTimer){
    myTimer = setInterval(myClock, 3000);
    estadoTimer = true;
  }
  else{
    clearInterval(myTimer);
    estadoTimer = false;
  }

});

//transmitir
var estadoTimerTransmitir = false;
var estadoInicioCamara = false;
$( "#btn_transmitir" ).click(function() {  

  //conectar servidor ws
  direccion_servidor_ws = $("#txt_ip_servidor_ws").val();
  console.log("ip websocket server "+direccion_servidor_ws);
  var promise = new Promise(function(resolve, reject) {
    // do a thing, possibly async, then…
    let controlConexion=false;

    ws = new WebSocket("wss://"+direccion_servidor_ws);
    ws.onopen = function(e) {
        sendMessage("cliente-inicio");
    }
    ws.onclose = function(e) {
        console.log("Disconnected: " + e.reason);
    }
    ws.onerror = function(e) {
        console.log("Error: "+e);   
        reject(Error("Error de conexion Ws"));
    }
    // Listen for new messages arriving at the client
    ws.onmessage = function(e) {
        //console.log(e.data);
        //mesaje enviado desde el servidor
        let identificadorMensaje = e.data.split("-");
        if('numeroConexion' === identificadorMensaje[1]){ 
          id_websocket = identificadorMensaje[2];
          console.log("id_websocket cliente:"+id_websocket);
          
          resolve("Conexión Ok");
        }
        else{
          console.log("otro mensaje: "+e.data);
        }
        
    }

  });

  promise.then(function(result) {
    inicioCamara();

    timerTransmitir = setInterval(relogTransmitir, 4000);
    estadoTimerTransmitir = true;

    console.log(result);
  }, function(err) {
    console.log(err);
  });  

});

function myClock() {
  let numeroAleatorio = Math.random() * (100 - 1) + 1;
  sendMessage('cliente-'+id_websocket+'-'+numeroAleatorio);
  console.log(numeroAleatorio);
}

function relogTransmitir() {
  //let numeroAleatorio = Math.random() * (100 - 1) + 1;
  //sendMessage('cliente-'+id_websocket+'-'+numeroAleatorio);

  drawCanvas();
  
  sendMessage('cliente-'+id_websocket+'-'+readCanvas());
  console.log('cliente-'+id_websocket+'-'+readCanvas());
  //console.log(numeroAleatorio);
}

//
var video = document.getElementById("video_uno")
var canvas = document.getElementById("canvas_uno")
var contexto = canvas.getContext('2d');  

function inicioCamara(){

  var promisifiedOldGUM = function(constraints, successCallback, errorCallback) {

    // First get ahold of getUserMedia, if present
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
  
    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if(!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
  
    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(successCallback, errorCallback) {
      getUserMedia.call(navigator, constraints, successCallback, errorCallback);
    });          
  }
  
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if(navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if(navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
  }
  
  
  // Prefer camera resolution nearest to 1280x720.
  var constraints = { audio: true, video: true }
  
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
       
    };
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });  
  
}

function drawCanvas(){
  contexto.drawImage(video, 0, 0, 100, 100);
}
function readCanvas(){
  var canvasData = canvas.toDataURL('image/jpeg',1);
  console.log("ini: "+canvasData);
  return canvasData;
  //return canvasData.split(',')[1];  
  //console.log("atob: "+ atob(canvasData.split(',')[1]));
  //console.log("btoa: "+ btoa(canvasData.split(',')[1]));
}