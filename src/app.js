const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepositoryIndex(request, response, next) {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'repository does not exist'})
  }

  request.body.repositoryIndex = repositoryIndex;
  request.body.id = id;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(), 
    title: title, 
    url: url, 
    techs: techs, 
    likes: 0
  }
  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", findRepositoryIndex,  (request, response) => {
  const { url, techs, title, repositoryIndex, id } = request.body;

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    url,
    techs,
    title,
    likes,
  }

  repositories[repositoryIndex] = repository;
  console.log(repository);
  return response.json(repository);

});

app.delete("/repositories/:id", findRepositoryIndex,  (request, response) => {
  const { repositoryIndex } = request.body;
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", findRepositoryIndex, (request, response) => {
  const { repositoryIndex } = request.body;

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex])

});

module.exports = app;
