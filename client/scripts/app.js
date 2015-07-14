// YOUR CODE HERE:
/*
var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};
*/

window.escaped = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var sanitize = function(string) {
  if (!string) {
    return '';
  }
  return string.replace(/[&<>"'\/"]/g, function(s) {
    return window.escaped[s];
  });
};

var selectArr = [];

var displayMessages = function(data) {
  for (var i=0; i<data.results.length; i++) {
    app.addMessage(data.results[i]);
    if(selectArr.indexOf(data.results[i].roomname === -1)){
      selectArr.push(data.results[i].roomname);
    }
  }
  console.log(data.results)
  var newArr = _.uniq(selectArr);
  for (var i=0; i<newArr.length; i++) {
    $("select").append("<option value=" + newArr[i] + ">" + newArr[i] + "</option>");
  }
};



var app = {};

app.init = function(){
  this.server = 'https://api.parse.com/1/classes/chatterbox';
  app.fetch();
};

app.fetch = function() {
    return $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    // data: JSON.stringify(message),
    dataType: 'json',
    contentType: 'application/json',
    success: displayMessages,
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
};

app.send = function(message){
  return $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

app.clearMessages = function() {
  $('.messages').remove();
};

app.addMessage = function(data) {
  $("#chats").append("<div class='messages'>" + window.sanitize(data.username) + ': ' + sanitize(data.text) + "</div>");
};

// app.createDropdown = function(array) {
//   for (var i=0; i<array.length; i++) {
//     console.log(array[i])
//     $("select").append("<option>" + array[i] + "</option>");
//   }
// };


$(document).ready(function(){
  app.init();
  // app.createDropdown(selectArr);

  $(".roomButton").on('click', function() {
    var room = $(".new-room-name").val();
    var tester = "<option value=" + room + ">" + room + "</option>"
    if (selectArr.indexOf(room) === -1){
      $('select').append(tester);
      selectArr.push(room)
    }
  });

  $("select").change(function() {
    var currentRoom = $('select option:selected').text();

  });

  $('#refresher').on('click', function(){
    app.clearMessages();
    app.fetch();
  });

  $('#sendButton').on('click', function(){
    var messageBro = {
      username: location.search.substring(10),
      text: $('.messageInput').val(),
      roomname: $('select option:selected').text()
    }
    //console.log(messageBro)
    app.send(messageBro);
    $('#refresher').trigger('click');
  });

  $("form").submit(function(e) {
    e.preventDefault();
  });

});
