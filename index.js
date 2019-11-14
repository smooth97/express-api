const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "courses1" },
  { id: 2, name: "courses2" },
  { id: 3, name: "courses3" }
];
app.get("/", (req, res) => {
  res.send("Hello World~~");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// POST ------------------------

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

// PUT ---------------------------

app.put("/api/courses/:id", (req, res) => {
  //  1. Look up the course
  // 2. If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`ID was not found`);

  const { error } = validateCourse(req.body);

  // return 400 error Bad Request
  if (error) return res.status(400).send(error);

  // 3. Update course
  course.name = req.body.name;
  // 4 .Return the update course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    // schema
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema); // validate
}

// DELETE ---------------------------
app.delete("api/courses/:id", (req, res) => {
  // 1. Look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 2. Not existing, return 404
  if (!course) return res.status(404).send(`ID was not found`);
  // 3. Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // 4. Return the same course
  res.send(course);
});

// GET ------------------------------
// /api/coureses/1
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`ID was not found`);
  res.send(course);
});

// PORT -------------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
