var socket = io();
socket.on('connect', function () {
    console.log('connected to the server');
});
/* socket.emit('createMessage', {
    from: 'bob', 
    text: 'hello from me'
},function (data) {
    console.log('got it',data);
});
socket.on('newMessage',function (message) {
    console.log('newMessage',message);
}); */
socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage',function (message) {
    console.log('newMessage',message);
    $('#messages').append(`<li>${message.from}: ${message.text}</li>`);
});

$('#message-form').on('submit',function (e) {
 e.preventDefault();
     socket.emit('createMessage',{
       from: 'User',
       text:  $('[name=message]').val() 
     },function () {
        //  console.log('got it',data);
     });
});

var locationButton = $('#send-location');

locationButton.on('click',function () {
if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
}  
navigator.geolocation.getCurrentPosition(function (position) {
    // console.log(position);
    socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude 
    });
},function () {
    alert('Unable to fetch location.');
});
});

socket.on('generateLocationMessage',function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>'); 

    li.text(`${messsage.from}:`);
    a.attr('href',message.url);

    li.append(a);
    $('#messages').append(li);
});