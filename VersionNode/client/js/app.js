

class EventManager {
  constructor() {
    this.urlBase = "/events"
    this.obtenerDataInicial()
    this.inicializarFormulario()
    this.guardarEvento()
  }
  sessionError() {
    alert('Usuario no ha iniciado sesión') //Enviar mensaje
    window.location.href = 'http://localhost:3000/index.html' //Redireccionar si no existe sesión iniciada
  }
  obtenerDataInicial() {
    let url = this.urlBase + "/all"
    $.get(url, (response) => {
      if (response == "logout") {//Verificar que la respuesta no sea logout (Usuario no ha iniciado sesion)
        this.sessionError() ////Mostrar mensaje con el resultado de la consulta
      } else {
        this.inicializarCalendario(response) //Ejecutar la función para renderizar los eventos en el calendario
      }
    })
  }

  eliminarEvento(evento) { //Eliminar evento
    let eventId = evento._id //Obtener el identificador del evento
    $.post('/events/delete/' + eventId, { id: eventId }, (response) => { //Enviar el identificador del evento como parámetro
      if (response == "logout") { //Verificar que la respuesta no sea logout (Usuario no ha iniciado sesion)
        this.sessionError() //Llamar la función error de sesiones
      } else {
        $('.calendario').fullCalendar('removeEvents', eventId); //Remover el evento del calendario renderizado
        alert(response) //Mostrar mensaje con el resultado de la consulta
      }
    })
  }

  guardarEvento() {
    $('.addButton').on('click', (ev) => {
      ev.preventDefault()
      let nombre = $('#titulo').val(),
        start = $('#start_date').val(),
        title = $('#titulo').val(),
        end = '',
        start_hour = '',
        end_hour = '';

      if (!$('#allDay').is(':checked')) {
        end = $('#end_date').val()
        start_hour = $('#start_hour').val()
        end_hour = $('#end_hour').val()
        start = start + 'T' + start_hour
        end = end + 'T' + end_hour
      }
      let url = this.urlBase + "/new"
      if (title != "" && start != "") {
        let ev = {
          title: title,
          start: start,
          end: end
        }
        $.post(url, ev, (response) => {
          alert(response)
        })
        $('.calendario').fullCalendar('renderEvent', ev)
      } else {
        alert("Complete los campos obligatorios para el evento")
      }
    })
  }

  inicializarFormulario() {
    $('#start_date, #titulo, #end_date').val('');
    $('#start_date, #end_date').datepicker({
      dateFormat: "yy-mm-dd"
    });
    $('.timepicker').timepicker({
      timeFormat: 'HH:mm:ss',
      interval: 30,
      minTime: '5',
      maxTime: '23:59:59',
      defaultTime: '',
      startTime: '5:00',
      dynamic: false,
      dropdown: true,
      scrollbar: true
    });
    $('#allDay').on('change', function () {
      if (this.checked) {
        $('.timepicker, #end_date').attr("disabled", "disabled")
      } else {
        $('.timepicker, #end_date').removeAttr("disabled")
      }
    })
  }

  inicializarCalendario(eventos) {
    var d = new Date();
    $('.calendario').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,basicDay'
      },
      defaultDate: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), //Mostrar el día actual como fecha predeterminada
      navLinks: true,
      editable: true,
      eventLimit: true,
      droppable: true,
      dragRevertDuration: 0,
      timeFormat: 'H:mm',
      eventDrop: (event) => {
        this.actualizarEvento(event)
      },
      events: eventos,
      eventDragStart: (event, jsEvent) => {
        $('.delete').find('img').attr('src', "../img/trash-open.png");
        $('.delete').css('background-color', '#a70f19')
      },
      eventDragStop: (event, jsEvent) => {
        var trashEl = $('.delete');
        var ofs = trashEl.offset();
        var x1 = ofs.left;
        var x2 = ofs.left + trashEl.outerWidth(true);
        var y1 = ofs.top;
        var y2 = ofs.top + trashEl.outerHeight(true);
        if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
          jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
          this.eliminarEvento(event, jsEvent)
        }
        $('.delete').find('img').attr('src', "../img/delete.png");
      }
    })
  }

  actualizarEvento(evento) {

    if (evento.end === null) { //Verificar si el evento es de dia completo
      var start = moment(evento.start).format('YYYY-MM-DD'), //Enviar la información del día en formato año-mes-dia
        url = '/events/update/' + evento._id + '&' + start + '&' + start //enviar como parámetros el identificador del evento + lafecha de inicio + la fecha de inicio ya que no se pueden enviar parámetros vacíos
    } else {
      var start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'), //Enviar la información del día en formato año-mes-dia Hora-minuto-segundos
        end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'), //Enviar la información del día en formato año-mes-dia Hora-minuto-segundos
        url = '/events/update/' + evento._id + '&' + start + '&' + end //enviar como parámetros el identificador del evento + lafecha de inicio + la fecha de finalización del evento
    }

    var data = { //Crear objero data
      id: evento._id, //asignar e idenificador del evento obtenido
      start: start, //obtener la fecha inicial
      end: end //obtener la fecha final
    }
    $.post(url, data, (response) => { //Enviar la consulta AJAX
      if (response == "logout") {//Verificar que la respuesta no sea logout (Usuario no ha iniciado sesion)
        this.sessionError() //Ejecutar función de error de sesión
      } else {
        alert(response) //Mostrar mensaje recibido
      }
    })
  }

  cerrarSesion() {
    var url = "/usuarios/logout", //url a consultar
      data = ""; //Enviar variable data sin información
    $.post(url, data, (response) => {
      if (response == "logout") {
        window.location.href = "http://localhost:3000/index.html" //url a redireccionar
      } else {
        alert("Error inesperado al cerrar sesión") //Mensaje de error
      }
    })
  }


}

const Manager = new EventManager()

$('.logout-container').on('click', function () {
  Manager.cerrarSesion() //Función de cierre de sesión
})