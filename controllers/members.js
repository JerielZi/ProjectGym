const fs = require('fs') // modulo do node.js que trabalha com ficheiros(fs-file system)
const data = require('../data.json') 
const { date } = require('../utils')

//Index
exports.index = function(req, res) {
  
  return res.render("members/index", { members: data.members })
}
//Create
exports.create = function(req, res) {
  return res.render("members/create")
}
//Post
exports.post = function(req, res) {
    //Estrutura de validação dos dados antes de enviar os dados para a BD
    const keys = Object.keys(req.body)
  
    for(key of keys) {
      //req.body.key == ""
      if (req.body[key] == "") {
        return res.send('Please, fill all the fields!')
      }
    }
    //Tratamento dos dados
    birth = Date.parse(req.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]
    
    if (lastMember) {
      id = lastMember.id + 1
    }
    //Organizando os dados que estamos a enviar para o data.json
    data.members.push({
       id,
       ...req.body,
       birth 
    }) 

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
      if (err) return res.send("Error with the file!")

      return res.redirect(`/members/${id}`)
    })
  
}
//Show
exports.show = function(req, res) {
  const { id } = req.params

  const foundMember = data.members.find(function(member) {
     return id == member.id
  })

  if (!foundMember) return res.send("Member not found!")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).birthDay
  }

  return res.render("members/show", {member})
}
//Edit
exports.edit = function(req, res) {
  const { id } = req.params

  const foundMember = data.members.find(function(member) {
     return id == member.id
  })

  if (!foundMember) return res.send("Member not found!")
    const member = {
      ...foundMember,
      birth: date(foundMember.birth).iso
    }
 
  return res.render("members/edit", { member })
}
// Put
exports.put = function(req, res) {
  const { id } = req.body
  let index = 0
  const foundMember = data.members.find(function(member, foundIndex) {
    if (id == member.id) {
      index = foundIndex
      return true
    }
  }) 

  if (!foundMember) return res.send("Member not found!")

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Error writting!")

    return res.redirect(`/members/${id}`)
  })
}
//DELETE
exports.delete = function(req, res) {
  const { id } = req.body

  const filteredMembers = data.members.filter(function(member) {
    return member.id != id
  })

  data.members = filteredMembers

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Error writting the file!")

    return res.redirect("/members")
  })
}

