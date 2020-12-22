const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const likes = 0;

  const repository = { id, title, url, techs, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid ID!" });

  const position = repositories.findIndex(repo => repo.id === id);

  if (position < 0) return response.status(400).json({ error: "Repository not found!" });

  repositories[position] = { ...repositories[position], title, url, techs };

  return response.json(repositories[position]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid ID!" });

  const position = repositories.findIndex(repo => repo.id === id);

  if (position < 0) return response.status(400).json({ error: "Repository not found!" });

  repositories.splice(position, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid ID!" });

  const position = repositories.findIndex(repo => repo.id === id);

  if (position < 0) return response.status(400).json({ error: "Repository not found!" });

  repositories[position].likes += 1;

  return response.json(repositories[position]);
});

module.exports = app;
