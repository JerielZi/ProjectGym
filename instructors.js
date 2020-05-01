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
  
   return res.send(req.body)
  
}
