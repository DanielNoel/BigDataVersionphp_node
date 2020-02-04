const Router = require('express').Router();
const Usuarios = require('./modelUsuarios.js')
const Eventos = require('./modelEventos.js')
const Operaciones = require('./crud.js')
//Verificar si existe el usuario DEMO
Router.get('/ciber', function (req, res) {
  Usuarios.find({ user: req.session.user }).count({}, function (err, count) { //Verificar si exste el usuario DEMO
    if (count > 0) { //Si el registro es mayor a 0
      res.send("Suferencia: </br>usuario: daniel ||| password:12 ");
    } else {
      res.send("Utilice los siguientes datos: </br>usuario: daniel ||| password:12 </br>usuario: caqui | password:12");
    }
  })
})

//Validar formulario de inicio de sesion
Router.post('/login', function (req, res) {
  let user = req.body.user //Obtener la informacion del nombre de usuario enviada desde el formulario
  let password = req.body.pass, //Obtener la informacion de la conrtaseña de usuario enviada desde el formulario
    sess = req.session; //iniciar el manejador de sesiones.
  Usuarios.find({ user: user }).count({}, function (err, count) { //Verificar que el usuario está registrado
    if (err) {
      res.status(500)
      res.json(err) //Devolver mensaje de error
    } else {
      if (count == 1) { //Si el usuario existe
        Usuarios.find({ user: user, password: password }).count({}, function (err, count) { //Verificar su contraseña
          if (err) {
            res.status(500) //Devolver status de error
            res.json(err) //Devolver devolver el error en formato json
          } else {
            if (count == 1) { //Si ambos campos coinciden con el registro de la base de datos, enviar mensaje Validado
              sess.user = req.body.user; //Guardar el nombre del usuario en la variable de manejo de sesiones
              res.send("Validado") //Devolver mensaje
            } else { //Si la contraseña no coincide, enviar mensaje de error de contraseña
              res.send("Contraseña incorrecta") //Devolver mensaje
            }
          }
        })
      } else {
        res.send("Usuario no registrado") //Mostrar mensaje Usuario o registrado
      }
    }

  })
})

//Validar formulario de inicio de sesion
Router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err); //Mostrar mensaje de error en cónsola
      res.json(err) //Devolver mensaje de error
    } else {
      req.session = null //Elimina las cookies de la session
      res.send('logout') //Devolver logout como respuesta
      res.end()
    }
  });
});

Router.all('*', function (req, res) {
  res.send('Error al mostrar el recurso solicitado. Por favor verifique la dirección url a la cual desea ingresar')
  res.end()
})

module.exports = Router //Exportar el módulo Router
