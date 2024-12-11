const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end("There is no person with that id");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name and number are required" });
  }
  if (persons.find((person) => person.name === name)) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name,
    number,
  };

  persons = persons.concat(person);
  response.status(201).json(person);
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people <br> ${currentTime}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
