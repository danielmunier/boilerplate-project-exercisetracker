const express = require('express')
const { client} = require("../database/conect")
const path = require("path")
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../views/index.html'))
});

const db = client.db("exercisetracker")
const userCollection = db.collection("users")

const getUser = async (username) => {
  const userFound = await userCollection.findOne({
    username: username
  })

  
  if (userFound) {
    return userFound
  } else {
    return false
  }

}

const getUserById = async (id) => {
  const userFound = userCollection.findOne({
    _id: id
  })

  if(userFound) {
    return userFound
  } else {
    return false
  }
}

app.post("/api/users/", async function (req, res) {
  const newUser = req.body.username

  if(!newUser) { 
    return res.status(404).json({
      error: "Missing username"
    })
  }
  const userFound = await getUser(newUser)
  
  if (userFound) {
    return res.json({
      "username": userFound.username,
      "_id": userFound._id
    })
    
  }

  const userCollection = db.collection("users")

  await userCollection.insertOne({
    username: newUser
  }).then((userCreated) => {
       res.status(200).json({
        "username": newUser,
        "_id": userCreated.insertedId
      })
     
  })

 

})

app.post("/api/users/:_id/exercises", async function(req, res) {
  const id = req.body._id
  const description = req.body.description
  const duration = parseInt(req.body.duration)
  const date = req.body.date

  const userFound = await getUserById(id)
  if(userFound) {
    // To-do

    
  } else {
    return res.json({
      error: "User not found by the given id"
    })
  }

})

app.get("/api/users/:username?", async function(req, res) {
  const username = req.params.username

  const user = await getUser(username)

  if(user) {
    return res.json({
      username: user.username,
      _id: user._id
    })
  } else {
    return res.json({
      error: "User not found"
    })
  }

} )


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port http://localhost:3000')
})
