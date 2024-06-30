const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    res.render("index", { files });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.desc,
    (err) => {
      if (err) {
        console.log(err.message);
      }
      res.redirect("/");
    }
  );
});

app.get("/files/:name", (req, res) => {
  const path = req.params.name;

  fs.readFile(`./files/${req.params.name}`, "utf-8", (err, data) => {
    if (err) {
      res.send("Error reading file");
    }
    res.render("show", { title: path, desc: data });
  });
});

app.get("/delete/:title", (req, res) => {
  fs.unlink(`./files/${req.params.title}`, (err) => {
    if (err) res.send("error while deleting");
    res.redirect("/");
  });
});

app.get("/edit/:title", (req, res) => {
  req.oldPath = req.params.title;
  //   console.log("the old path is", req.oldPath);
  res.render("edit", { title: req.params.title });
});

app.post("/edit/:oldPath", (req, res) => {
  const oldPath = req.params.oldPath;
  const { newTitle, newDesc } = req.body;
  fs.renameSync(`./files/${oldPath}`, `./files/${newTitle}`);
  fs.writeFileSync(`./files/${newTitle}`, newDesc);
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("server running sucessfully");
});
