
var Usuario = require('./modelUsuarios.js') //Asignarle a la variable USUARIO el modelo del usuario
module.exports.crearUsuarioDemo = function(callback){ //Función para crear usuarios
  var arr = [{ email: 'daniel@mail.com', user: "Daniel", password: "12"}, { email: 'daniel@mail.com', user: "Daniel", password: "12"}]; //array con la información de los usuarios a insertar
  
  Usuario.insertMany(arr, function(error, docs) { //Utilizar la función insertMany para insertar varios registros en una sola consulta
    if (error){ //Acciones si existe un error
      if (error.code == 11000){ //Verificar si el nombre de usuario (PrimaryKey) del existe
        callback("Utilice los siguientes datos: </br>usuario: daniel || password:12 </br>usuario: caqui | password:12") //Mostrar mensaje
      }else{
        callback(error.message) //Mostrar mensaje de error
      }
    }else{
      callback(null, "El usuario 'Daniel' y 'Noel' se ha registrado correctamente. </br>usuario: Daniel | password:12 </br >usuario: Noel | password:12") //Mostrar mensaje del usuario guardado con exito
    }
  });
}
