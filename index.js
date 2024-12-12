require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fullstackopenfrontend-dj4i.onrender.com",
    ],
  })
);

app.use(express.static("dist"));

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

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
  Person.find({}).then((persons) => {
    response.json(persons);
  });
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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: `data not found` });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name and number are required" });
  }

  const person = new Person({
    name,
    number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people <br> ${currentTime}</p>`
  );
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  response.status(500).send({ error: "Internal server error" });
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
