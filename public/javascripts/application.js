$(function() {
  var mainDiv = $('#main');
  $("#chatForm").submit(function() {
    chatForm.find("input").val("")
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
  mainDiv.append($("<img>", {
      class: 'player'
    , id: user.uid
    , src: "http://graph.facebook.com/" + user.uid + "/picture"
    , alt: user.name
    , title: user.name
    , css: {
        left: user.x + offsets.left
      , top: user.y + offsets.top
    }
  }))
}

function handle_response(response) {
  var version
  if(response) {
    switch (response.event) {
    case "add":
      add_user(response.data)
      break
    case "start":
      mainDiv.html("")
      $.each(response.data, function(index, user) {
        add_user(user)
      })
      break
    case "move":
      var user = response.data
      var offsets = mainDiv.offset()
      $("#" + user.uid).animate({
          left: user.x + offsets.left
        , top: user.y + offsets.top
      })
      break
    case "remove":
      $("#" + response.data).remove()
      break
    }
    version = response.version
  }
  load_home({version: version})
}
