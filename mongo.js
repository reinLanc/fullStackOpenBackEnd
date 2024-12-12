const mongoose = require('mongoose');
const process = require('process');

const password = process.argv[2];
const url = `mongodb+srv://UserName:${password}@cluster0.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.log('Error de conexión:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log('Error al guardar:', error.message);
      mongoose.connection.close();
    });
}

else {
  console.log('phonebook:');
  Person.find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log('Error al obtener las entradas:', error.message);
      mongoose.connection.close();
    });
}
