# Instructions to Launch ChatServer 

Author: Xuan Nguyen
Tested on Windows OS Command Prompt.
node.js version number: v18.13.0
npm version number: 8.19.3
Based on: https://socket.io


Install node.js and npm.
---------------------------------------------------------------------------------------------
If there is NO package.json file then create one by executing
> npm init

It will ask some questions and then generate the package.json file

Install socket.io and add the dependency to package.json by exectuing
> npm install socket.io --save
(as of npm 5.x.x it will generate a package-lock.json whicH can be ignored)

----------------------------------------------------------------------------------------------
However there is already a package.json file inside the zip file, the required modules are specified in its dependencies section.
First make sure to be in the same directory with the package.json and package-lock.json files.
To install the dependencies in package.json, execute this command:
> npm install


Launch Instructions:
> node server.js

Open several Chrome browser instances at the URL address: http://localhost:3000/chatClient.html
Enjoy :)
