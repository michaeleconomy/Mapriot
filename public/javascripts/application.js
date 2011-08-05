var mainDiv

function load_home(data) {
  $.ajax('/home', {
      data: data
    , failure: window.location.reload
    , dataType: 'json'
    , success: handle_response
  })
}

function add_user(user) {
  var offsets = mainDiv.offset()
  var userDiv = $("<div>", {
      class: 'player'
    , id: user.uid
    , css: {
        left: user.x + offsets.left
      , top: user.y + offsets.top
    }
  })
  
  userDiv.append($("<img>", {
      src: "http://graph.facebook.com/" + user.uid + "/picture"
    , alt: user.name
    , title: user.name
  }))
  
  mainDiv.append(userDiv)
}

function handle_response(response) {
  var version
  if(response) {
    var data = response.data
    switch (response.event) {
    case "add":
      add_user(data)
      break
    case "start":
      mainDiv.html("")
      $.each(data, function(index, user) {
        add_user(user)
      })
      break
    case "move":
      var offsets = mainDiv.offset()
      $("#" + data.uid).animate({
          left: data.x + offsets.left
        , top: data.y + offsets.top
      })
      break
    case "remove":
      $("#" + data).remove()
      break
    case "chat":
      var message = $("<div>", {
          class: "speechBubble"
      }).text(data.message)
      $("#" + data.uid).append(message)
      setTimeout(function(){
        message.remove()
      }, 5000) // A FADE WOULD BE NICER HERE
      break
    }
    version = response.version
  }
  load_home({version: version})
}


$(function() {
  mainDiv = $('#main')
  
  $("#chatForm").ajaxForm().submit(function() {
    $("#chatForm input").val("")
    return false
  })
  
  load_home()
 
  mainDiv.click(function(e){
    var offsets = mainDiv.offset()
    $.post('/move', {
        x: e.pageX - offsets.left
      , y: e.pageY - offsets.top
    })
  })
})
