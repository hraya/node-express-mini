// implement your API here
const express = require('express');

const db=require('./data/db')

const server = express();
const PORT = 4000;

server.use(express.json());


//endpoints

server.get('/api/users', (req, res) =>{
    db.find()
        .then((users) =>{
            res.json(users)
        })
        .catch(err => {
            res.status(500)
            .json({message:"failed to get users"})
        })
});

server.get('/api/users/:id', (req, res) =>{
    const { id } = req.params;
    db.findById(id)
        .then( user => {
            if(user){
                res.json(user)
            } else {
                res
                    .status(404)
                    .json({message:"user does not exist"})
            }
        })
        .catch( err => {
            res
            .status(500)
            .json({message:"failed to get user"})
        })
});



server.delete('/api/users/:id', (req, res) =>{
    const { id } = req.params;
    db.remove(id).then(count =>{
        if(count){
            res.json({message:"yup you deleted it"})
        }else{
            res.status(404)
            .json({ message:"invalid id"});
        }
    }).catch(err =>{
        res.status(500).json({error: "The user could not be removed" })
    })
})

server.put('/api/users/:id', (req, res) =>{
    const { id } = req.params;
    const user = req.body
    if(user.name && user.bio){
        db.update(id, user).then(count =>{
            if(count){
                db.findById(id).then(user=>{
                    res.json(user);
                });
            }else{
                res.status(404)
                .json({message:"failed to update"})
            }
        }).catch(err =>{
            res.status(500).json({message:"failed catch 2"})
        })
    }else{
        res.status(400).json({message:"missing name & bio"})
    }
})

//listening
server.listen(PORT, () =>{
    console.log(`server is up and running on port ${PORT}`)
})