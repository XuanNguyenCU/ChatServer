/*
(c) 2023 Louis D. Nel
Based on:
https://socket.io
see in particular:
https://socket.io/docs/
https://socket.io/get-started/chat/

Before you run this app first execute
>npm install
to install npm modules dependencies listed in package.json file
Then launch this server:
>node server.js

To test open several browsers to: http://localhost:3000/chatClient.html

*/
const server = require('http').createServer(handler)
const io = require('socket.io')(server) //wrap server app in socket io capability
const fs = require('fs') //file system to server static files
const url = require('url'); //to parse url strings
const PORT = process.env.PORT || 3000 //useful if you want to specify port through environment variable

const ROOT_DIR = 'html' //dir to serve static files from

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

server.listen(PORT) //start http server listening on PORT

function handler(request, response) {
  //handler for http server requests
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR + urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

  fs.readFile(filePath, function(err, data) {
    if (err) {
      //report error to console
      console.log('ERROR: ' + JSON.stringify(err))
      //respond with not found 404 to client
      response.writeHead(404);
      response.end(JSON.stringify(err))
      return
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath)
    })
    response.end(data)
  })

}

// Socket Server
let usersRegistered = new Map();

io.on('connection', function(socket) {
  console.log("socket ID: " + socket.id);
  
  socket.on('register', (data)=>{
    dataObj = JSON.parse(data);
  
    if(!usersRegistered.has(dataObj.username)) {
      let returnObj = {}

      returnObj.text = dataObj.username + " is now registered and connected to the SLAY CHAT Server"
      returnObj.sender = dataObj.username
      returnObj.private = dataObj.private
      usersRegistered.set(dataObj.username, socket.id)

      console.log(usersRegistered)
      socket.emit('regAck', JSON.stringify(returnObj))
    }
  })

  // prints on console regarding messages sent in public chat
  socket.on('clientPublicSays', function(data) {
    console.log("PUBLIC Chat Message")
    console.log('RECEIVED: ' + data)
    dataObj = JSON.parse(data)

    let returnObj = {}
    returnObj.text = dataObj.username + ": " + dataObj.text
    returnObj.sender = dataObj.username
    returnObj.private = dataObj.private

    if(usersRegistered.has(dataObj.username)){

      for (const socketID of usersRegistered.values()){
        io.to(socketID).emit('serverSays', JSON.stringify(returnObj))}
    }
  })

   // prints on console regarding messages sent privately
  socket.on('clientPrivateSays', function(data) {
    console.log("PRIVATE Chat Message")
    console.log('RECEIVED: ' + data)
    dataObj = JSON.parse(data)
    
    let returnObj = {}
    returnObj.text = dataObj.username + ": " +dataObj.text
    returnObj.sender = dataObj.username
    returnObj.private = dataObj.private
    dataObj.private.push(dataObj.username)

    if(usersRegistered.has(dataObj.username)){

      for(received of dataObj.private) {
        
        if (usersRegistered.has(received.trim()))
          io.to(usersRegistered.get(received.trim())).emit('serverSays', JSON.stringify(returnObj))
      }
    }
  })
})

console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to:`)
console.log(`http://localhost:3000/chatClient.html`)