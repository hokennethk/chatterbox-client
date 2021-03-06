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
  var newArr = _.uniq(selectArr);
  for (var i=0; i<newArr.length; i++) {
    $("select").append("<option value='" + sanitize(newArr[i]) + "''>" + sanitize(newArr[i]) + "</option>");
  }
};



var app = {};
app.friendsList = [];

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
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
}

app.clearMessages = function() {
  $('#chats').children().remove();
  $("#roomSelect").children().remove();
};

app.addMessage = function(data) {
  if(app.friendsList.indexOf(data.username) !== -1){
    $("#chats").append("<div class='messages" + data.roomname + "'>" + '<button class="username friend">' + window.sanitize(data.username) + '</button>' + ': ' + window.sanitize(data.text) + "</div>");
  }else{
    $("#chats").append("<div class='messages " + data.roomname + "'>" + '<button class= "username">' + window.sanitize(data.username) + '</button>' + ': ' + window.sanitize(data.text) + "</div>");
  }
};

app.addRoom = function(room) {
  if (room === undefined) {
    console.log("no room name given");
    return null;
  }
  var tester = "<option value='" + sanitize(room) + "''>" + sanitize(room) + "</option>"
  if (selectArr.indexOf(room) === -1){
    $('#roomSelect').append(tester);
    selectArr.push(room)
  }

  $("#roomSelect").val(room);
}

app.addFriend = function(friend) {
  if (app.friendsList.indexOf(friend) === -1) {
    app.friendsList.push(friend);
    var username = $('.username');
    for(var i = 0; i < username.length; i++){
      if(username[i].textContent === friend){
        $(username[i]).addClass('friend')
      }
    }
  }
};

app.handleSubmit = function() {
  var messageBro = {
    username: location.search.substring(10),
    text: $('.messageInput').val(),
    roomname: $('select option:selected').text() || "4chan"
  }
  app.send(messageBro);
  // trigger room filter
  $("#chats").prepend("<div class='messages " + messageBro.roomname + "'>" + '<button class= friends>' + window.sanitize(messageBro.username) + '</button>' + ': ' + window.sanitize(messageBro.text) + "</div>");
};

$(document).ready(function(){
  app.init();

  $(".roomButton").on('click', function() {
    var room = $(".new-room-name").val();
    app.addRoom(room);
  });

  $("#chats").on("click", ".username", function() {
    app.addFriend($(this).text());
  });

  $("select").change(function() {
    var currentRoom = $('select option:selected').text();
    $("div.messages").show();
    $("div.messages").filter(function(){
      return !$(this).hasClass(currentRoom);
    }).hide();
  });

  $('#refresher').on('click', function(){
    app.clearMessages();
    app.fetch();
  });

  $('#send').on('submit', function(){
    app.handleSubmit();
  });

  $("form").submit(function(e) {
    e.preventDefault();
  });

});
