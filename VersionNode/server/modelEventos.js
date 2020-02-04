let mongoose = require('mongoose'), //Requerir el módulo mongoose
    Schema = mongoose.Schema, //Definir la variable Schema
  
    EventSchema = new Schema({ //Cerrar el esquema de los Eventos
      title:{ type: String, required: true }, //Definir titulo del evento - Obligatorio
      start: { type: String, required: true }, //Inicio del evento - Obligatorio
      end: { type: String, required: false }, //Finalizacion del evento - No obligatorio
      user: { type: Schema.ObjectId, ref: "Usuario" }
    });



let EventoModel = mongoose.model('Evento', EventSchema) 
module.exports = EventoModel 
