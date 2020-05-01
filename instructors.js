const fs = require('fs') // modulo do node.js que trabalha com ficheiros(fs-file system)
const data = require('./data.json')

//Show
exports.show = function(req, res) {
  const { id } = req.params

  const foundInstructor = data.instructors.find(function(instructor) {
     return id == instructor.id
  })

  if (!foundInstructor) return res.send("Instructor not found!")

  const instructor = {
    ...foundInstructor,
    age: "", 
    gender: "",
    services: "",
    created_at: "",
  }

  return res.render("instructors/show", {instructor})
}

//Create
exports.post = function(req, res) {
    //Estrutura de validação dos dados antes de enviar os dados para a BD
    const keys = Object.keys(req.body)
  
    for(key of keys) {
      //req.body.key == ""
      if (req.body[key] == "") {
        return res.send('Please, fill all the fields!')
      }
    }
    let {avatar_url, birth, name, gender, services} = req.body

    //Tratamento dos dados
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    //Organizando os dados que estamos a enviar para o data.json
    data.instructors.push({
      id,
      avatar_url,
      name,
      birth,
      gender,
      services,
      created_at
    }) 

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
      if (err) return res.send("Error with the file!")

      return res.redirect("/instructors")
    })
  
   //return res.send(req.body)
  
}