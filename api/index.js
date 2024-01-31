const express = require('express')
const { client, ObjectId} = require("../database/conect")
const path = require("path")
const app = express()
const cors = require('cors')
const { ok } = require('assert')
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
const exerciseCollection = db.collection("exercises")

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

const getExercises = async (user) => {

}


const getUserById = async (id) => {
  const userFound = await userCollection.findOne({
    "_id": new ObjectId(id)
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

app.get("/api/users", async function(req, res) {
  const usersData = await userCollection.find().toArray()
  res.send(usersData)

})



app.post("/api/users/:_id/exercises/", async function(req, res) {
 try {
  console.log("Here")
  const id = req.params._id
  const description = req.body.description
  const duration = parseInt(req.body.duration)
  console.log(req.body.date)
  let date;
  if(req.body.date) {
      console.log("existe")
      date = new Date(req.body.date)
     
  } else {
    date = new Date()
    console.log("Não existe")
  }


const userFound = await getUserById(id)
  
if(userFound) {

    exerciseCollection.insertOne({
      user_id: userFound._id,
      username: userFound.username,
      date: date,
      duration: duration,
      description: description
      
    }).then((exerciseCreated) => {
      console.log(exerciseCreated)
      res.json({
        "_id": id,
        "username": userFound.username,
        "date": date.toDateString(),
        "duration": duration,
        "description": description

      })
    })



    
  } else {
    return res.json({
      error: "User not found by the given id"
    })
  }


 } catch(e) { 
  console.error(e)
  

 }
})



app.get("/api/users/:_id/exercises/", async function(req, res) {
  try {
 
   const id = req.params._id
   const userFound = await getUserById(id)
   console.log(userFound)

   if(!userFound) {
    return res.json("User not found")

   }  



   return res.send(userFound)



 
 
  } catch(e) { 
   console.error(e)
   
 
  }
 })

app.get("/api/users/:_id/logs", async function (req, res) {
  const from = req.query.from
  const to = req.query.to
  const limit = req.query.limit  
  console.log(`${from} to ${to} with limit at ${limit}`)

  const fromDate = new Date(from).getTime()
  const toDate = new Date(to).getTime()

  const userId = req.params._id
  const userFound = await getUserById(userId)

  if(userFound) {
    const exercises = await exerciseCollection.find({
        "username": userFound.username
    }).toArray()

   
    for (let i = exercises.length - 1; i >= 0; i--) {
      const exercise = exercises[i];
    
      delete exercise._id;
      delete exercise.username;
      delete exercise.user_id;
      exercise.date = exercise.date.toDateString();
      let exerciseDate = new Date(exercise.date).getTime()
    
      if (exerciseDate > fromDate && exerciseDate > toDate) {
        exercises.splice(i, 1);
      }
     
    }


    res.json({"_id": userFound._id,
    "username": userFound.username,
    "count": exercises.length,
    "log": exercises
  })
    
  } else {
    console.log("User not found querying id")
    res.json({"error": "User not found"})
  }

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port http://localhost:3000')
})
