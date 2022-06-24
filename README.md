# ServerNurse
Server for Nurse Messaging System based in MQTT
## System Description
This server is part of a system that includes a mobile messaging application and a administration web page. It provides a simple interface to a database an a Mosquitto mqtt brocker.
## Database Description
We are using a MySQL database. The database diagrams is:\
[picture]  
The bed entity has 4 columns: bedId(number), a callerId(number of the caller device), roomId(number of the room) and floorId(number of the floor).
## NodeJs application description
[picture]

## MQTT topics
[picture]

## Endpoints specification
### Beds Management

GET methods:
* "localhost:8000/api/beds/" : returns a list of all the beds avaiable in the system in a Json format:\
`
[{"bedId":1,"roomId":1,"callerId":1,"floorId":0},{"bedId":2,"roomId":1,"callerId":2,"floorId":0},{"bedId":3,"roomId":1,"callerId":1,"floorId":0 
}]`

* "localhost:8000/api/beds/:id" : returns the information of a bed a Json format: 
`[{"bedId":1,"roomId":1,"callerId":1,"floorId":0}]`

PUT methods:\
In order to edit a bed information
* "localhost:8000/api/beds/:id" : needs the body to have the new information in a Json format. The bedId is passed as parameter. Example of body:
`[{"roomId":1,"callerId":1,"floorId":0}]`

POST method:\
Adding a new bed. the bedId is created by the system in a incremental way.
* "localhost:8000/api/beds/" : needs the body to have information in a Json format. The bedId is passed as parameter. Example of body:
`[{"roomId":1,"callerId":1,"floorId":0}]` 

DELETE method:
* "localhost:8000/api/beds/:id": needs bedId as parameter. Returns the sql result or the error.

### Users Management

GET methods:
* "localhost:8000/api/user/": returns all the users registered in the system in JSON format.
* "localhost:8000/api/user/:id": returns the user's information registered in the system in JSON format. Example: 
`[{"userId":1,"username":"Josesito","firstname":"Jose","lastname":"laurm","occupation":"administrador","state":1,"password":"1234"}]` 

POST methods:
* "localhost:8000/api/user/": used for adding a new user to the system, needs users information in the body parameter.
Body example:  
[{"username":"peter",
 "firstname":"peter",
 "lastname":"Frant",
 "occupation":"medico",
 "state":"1",
 "password":"123456"}]

PUT methods:
* "localhost:8000/api/user/:id": used for editing a user information: needs information passed by the body parameter in JSON format.
Example:   
 [{
  "username":"peter",
  "firstname":"peter",
  "lastname":"Frant",
  "occupation":"medico",
  "state":"1",
  "password":"123456"}]


DELETE method:
* "localhost:8000/api/user/:id": used for removing a user information from the database.

### Pacient Management
GET methods:
* "localhost:8000/api/pacient/": returns all the pacients registered in the system in JSON format.
* "localhost:8000/api/pacient/:id": returns the user's information registered in the system in JSON format. Example: 
`[{"pacientId":1,"firstName":"Pedro","lastName":"Pasculli","bedId":1,"notesTableId":1,"userTableId":1}]` 

POST methods:
* "localhost:8000/api/pacient/": used for adding a new pacient to the system, needs the pacient information in the body of the message.
Body example:  
 [{"pacientId":2, 
  "firstname":"peter",
  "lastname":"Frant",
  "bedId":"3",
  "notesTableId":"1",
  "userTableId":"1"}]
PUT methods:
* "localhost:8000/api/pacient/:id": used for editing a pacient information: needs information passed by the body parameter in JSON format.
Example:   
 [{"firstname":"peter",
  "lastname":"Frant",
  "bedId":"3",
  "notesTableId":"1",
  "userTableId":"1"}]


DELETE method:
* "localhost:8000/api/pacient/:id": used for removing a user information from the database.

### Messaging Management
GET methods:
* "localhost:8000/api/messages/": returns the last 100 messages saved in the database in JSON format.
Example of return:
[{"messageId":1,"userIdLastName":"1","userIdSender":1,"pacientId":"1","content":"Se levanto bien","dateTime":"2022-05-01T23:36:03.000Z","audiolink":null,"userTableId":1}]
* "localhost:8000/api/messages/info": returns the last 100 messages saved in the database in JSON format with information of the sender.
Example of return:
[{"messageId":1,"firstname":"Jose","lastname":"laurm","pacientId":"1","content":"Se levanto bien"}]


based in https://github.com/gotoiot/app-fullstack-base
by Agustin Bassi https://github.com/agustinBassi ,Ernesto Gigliotti https://github.com/ernesto-g and Brian Ducca https://github.com/brianducca
