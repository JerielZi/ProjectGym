module.exports = {
  age:  function(timestamp) {
    const today = new Date()
    const birthDate = new Date(timestamp)
    
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()

    //Lógica a ser aplicada quando a pessoa ainda não fez anos
    if (month < 0 || 
      month == 0 && 
      today.getDate() <= birthDate.getDate()) {
      age = age - 1
    }

    return age
  }
}