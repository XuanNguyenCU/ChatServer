// Xuan Nguyen 101228417

//connect to server and retain the socket
//connect to same host that served the document
const socket = io('http://' + window.document.location.host)

socket.on('serverSays', function(message) {
  let receivedMsgObj = JSON.parse(message)
  displayMessage(receivedMsgObj, false)  
})

socket.on("regAck", function(message){
  console.log(message)
  let disableUserName = document.getElementById('registerName')
  disableUserName.setAttribute('disabled', '');
  document.getElementById('registerButton').setAttribute('disabled', '');
  
  let receivedMsgObj = JSON.parse(message)
  displayMessage(receivedMsgObj, true)
})


function registerUser() {
  
  let username = document.getElementById('registerName').value.trim()

  console.log("Registering user: " + username)

  if(username === '')
    return

  else if (/^[a-zA-Z]/.test(username) && username.indexOf(' ')=== -1) {
    let dataObj = {"username": username, "text": "", private: ""}
    socket.emit('register', JSON.stringify(dataObj))
  } 
  
  else{
    document.getElementById('registerName').value = ''
  }
}


function displayMessage(message, ack){
  let username = document.getElementById('registerName').value.trim()

  let messageDiv = document.createElement('div')
  if( (message.private === "") && (username.toLowerCase() === message.sender.toLowerCase()) && (!ack))
    messageDiv.style.color = "darkblue"

  else if (message.private !== "" && !ack) {
    messageDiv.style.color = "red"
  }

  messageDiv.textContent = message.text
  document.getElementById('messages').appendChild(messageDiv)
}


function sendMessage() {

  let message = document.getElementById('messageBox').value.trim()
  let privateUsers = ""

  if(message === '') 
    return 

  else if (message.indexOf(":") !== -1) {
    let privateMessage = message.split(":")
    message = privateMessage[1]
    privateUsers = privateMessage[0].split(",")
  }


  let dataObj = {"username": document.getElementById('registerName').value.trim(), "text": message, "private": privateUsers}
  
  if(privateUsers === "") 
    socket.emit('clientPublicSays', JSON.stringify(dataObj))
   
  
  else 
    socket.emit('clientPrivateSays', JSON.stringify(dataObj))
  

  document.getElementById('messageBox').value = ''
}


function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY) {

    if(document.getElementById('registerName').value !== "")
      sendMessage()

    return false //don't propogate event
  }
}

function clearAllMessages(){
  while (document.getElementById('messages').childNodes.length > 1)
    document.getElementById('messages').removeChild(document.getElementById('messages').lastChild)
}

//Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('clearButton').addEventListener('click', clearAllMessages)
  document.getElementById('send_button').addEventListener('click', sendMessage)
  document.getElementById('registerButton').addEventListener('click', registerUser)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
})
