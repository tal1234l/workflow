
var http = require('http'),
    flights = require('./data'),
    db = require('./db'),
    app = require('./app')(flights);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port' + app.get('port'));
});

//-------------------Socket-IO----------------//
/*var io = require('socket.io').listen(server);
 var AllSchemas = require('./schemas/schemas');
var socketConnections = {};
io.on('connection', function(socket){
  socketConnections[socket.id] = "";
  console.log('a user connected and his socket is: '+ socket.id);


    socket.on('disconnect', function(){
        console.log('user disconnected');
        var doctorId = socketConnections[socket.id];
        socketConnections[socket.id]= '';
        delete socketConnections[socket.id];
        io.emit(doctorId+'_doctor_queue', 'patient has disconnected');
    });

  
    socket.on('enterDoctorQueue', function(doctorId){
        socketConnections[socket.id] = doctorId;
        AllSchemas.PatientsOnline.find({ doctor_uid: doctorId},function(err,data){
            if (err){
                console.log('getAllOnlinePatientsOfADoctor did not succeed at the find command');
            }
            if(data!=null && data.length!=0)
            {
                //console.log(data);
                var queue = {}
                var i= 1;
                Object.keys(data).forEach(function(key) {
                    console.log(data[key].PID);
                    queue[data[key].PID] = i;
                    i++;
                });
                //give the patient his position in the queue
                io.emit('enterDoctorQueue', queue);

                //update the doctor that a new patient has joined his queue
                io.emit(doctorId+'_newPatientInQueue', 'new patient entered the queue');
              
                 socket.on(doctorId+'_doctor_queue', function(msg){
                      // update the queue for all patients.
                      io.emit(doctorId+'_doctor_queue', msg);
                  });
            }
            else
            {
                console.log('Currently there are no patients online for this doctor');
            }
        });
    });
  
});*/

