if(req.body.date) {
    console.log("existe")
    return
} else {
  const date = new Date()
  console.log("Não existe")
}

console.log(date)
