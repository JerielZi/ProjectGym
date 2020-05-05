const fs = require('fs') // modulo do node.js que trabalha com ficheiros(fs-file system)
const data = require('./data.json')
const { age, date } = require('./utils')

//Show
exports.show = function(req, res) {
  const { id } = req.params

  const foundInstructor = data.instructors.find(function(instructor) {
     return id == instructor.id
  })

  if (!foundInstructor) return res.send("Instructor not found!")

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth), 
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-PT").format(foundInstructor.created_at)
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

//Edit
exports.edit = function(req, res) {
  const { id } = req.params

  const foundInstructor = data.instructors.find(function(instructor) {
     return id == instructor.id
  })

  if (!foundInstructor) return res.send("Instructor not found!")
    const instructor = {
      ...foundInstructor,
      birth: date(foundInstructor.birth) 
    }
 
  return res.render("instructors/edit", { instructor })
}

// Put
exports.put = function(req, res) {
  const { id } = req.body

  const foundInstructor = data.instructors.find(function(instructor) {
    return id == instructor.id
  }) 

  if (!foundInstructor) return res.send("Instructor not found!")

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth)
  }

  data.instructors[id - 1] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Error writting!")

    return res.redirect(`/instructors/${id}`)
  })
}

//DELETE
exports.delete = function(req, res) {
  const { id } = req.body

  const filteredInstructors = data.instructors.filter(function(instructor) {
    return instructor.id != id
  })

  data.instructors = filteredInstructors

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Error writting the file!")

    return res.redirect("/instructors")
  })
}

