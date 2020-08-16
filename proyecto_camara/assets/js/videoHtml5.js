
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
    
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});