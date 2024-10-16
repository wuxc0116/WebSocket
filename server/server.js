
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

app.use(express.json());
app.use(cors());

//When a client is connected
io.on('connection', (socket) => {
    console.log(socket.id + 'is connected');

    //send message to front-end clients
    io.emit('message', 'User ' + socket.id.substr(0,2) + ' is connected')

    //Client send some message
    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0,2)} said ${message}` );   
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(socket.id + ' has disconnected');
        io.emit('message', 'User ' + socket.id.substr(0, 2) + ' has disconnected');
    });
});

server.listen(8080, () => console.log('listening on http://localhost:8080') );


//In memory storage
let resourcesDict = {};

//Create new resource
app.post('/api/resources', (req,res)=>{
    try{
        const {id, name} = req.body;
        //If no id is given, fail
        if(!id){
            return res.status(400).json({ error: 'Must Provide ID' });
        }
        const tempResource = {id: id, name};
        resourcesDict[id] = name;
        res.status(201).json(tempResource);
        console.log(resourcesDict);
    } catch (error){
        res.status(500).json({ error: 'Error creating resource' });
    }
});

//Read all entered entries
app.get('/api/resources', (req, res) => {
    res.json(resourcesDict);
});

//Delete an entry by ID
app.delete('/api/resources', (req, res) => {
    try{
        const {id} = req.body
        //If no id is given, fail
        if(!id){
            return res.status(400).json({ error: 'Must Provide ID' });
        }

        //Check if the id exist, and delete it
        if(resourcesDict[id]){
            delete resourcesDict[id];
            return res.status(200).json({message: 'Item deleted'});
        }
        else{
            return res.status(404).json({error: 'Item not found'});
        }
    } catch (error){
        res.status(500).json({ error: 'Error deleting item' });
    }
    
})