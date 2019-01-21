const express = require("express");
const got = require("got");
const mongoose = require("mongoose");
const libs = require("./libs");
const request = require("request");
const cors = require("cors");
const { db, clientID, clientSecret, PORT } = require("./config");

const baseUrl = "https://github.com";

mongoose.connect(
  db,
  { useNewUrlParser: true }
);
const UserRepos = require("./user-repos");
const Users = require("./users");

// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
app.use(express.static("assets"));
app.use(cors());
// Define routes.

app.get("/", (req, res) => {
  UserRepos.find({})
    .populate("userId")
    .sort({ stargazers_count: -1 })
    .limit(20)
    .exec(function(err, repos) {
      if (err) throw err;
      console.log(repos);
      res.render("index", { user: req.user });
    });
});

app.get("/explore", function(req, res) {
  const { q } = req.query;
  let query = {};
  if (q) {
    query = { ...query, language: q };
  }

  UserRepos.find(query)
    .populate("userId")
    .sort({ stargazers_count: -1 })
    .exec(function(err, repos) {
      if (err) throw err;
      res.json(repos);
    });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/login/github/:code", (req, response) => {
  request.post(
    {
      url: "https://github.com/login/oauth/access_token",
      form: {
        client_id: clientID,
        client_secret: clientSecret,
        code: req.params.code
      }
    },
    function(error, res, body) {
      if (body.includes("access_token")) {
        const [, tokenObj] = body.split("=");
        const [token] = tokenObj.split("&");
        console.log(error, "--------", token);
        request.get(
          {
            url: ` https://api.github.com/user`,
            headers: {
              Authorization: `token ${token}`,
              "User-Agent": "github-login"
            },
            json: true
          },
          function(error, req, user) {
            console.log("-----------sdf", user);
            response.json(user);
          }
        );
      } else {
        response.status(401).json({ error: "wrong code" });
      }
    }
  );
});

app.get("/repos/:userId", async (req, res) => {
  const { userId } = req.params;

  UserRepos.find({ userId })
    .populate("userId")
    .sort({ name: -1 })
    .exec(function(err, repos) {
      console.log(
        userId,
        "************************************req.user",
        repos
      );
      res.json(repos ? repos : []);
    });
});

app.get("/user-repo/:username/:repoName", async (req, res) => {
  const { repoName, username } = req.params;
  const apiUrl = `https://api.github.com/search/repositories?q=${repoName}+user:${username}&client_id=${clientID}&client_secret=${clientSecret}`;
  console.log("--------------apdd------------", apiUrl);
  const { body: repos } = await got(apiUrl, { json: true, method: "GET" });
  res.json(repos);
});

app.delete("/delete/:repoName", (req, res) => {
  require("connect-ensure-login").ensureLoggedIn();
  const { repoName } = req.params;
  const { id } = req.user;

  UserRepos.remove({ userId: id, name: repoName }, function(err) {
    if (err) {
      res.json({ ok: false });
    } else {
      res.json({ ok: true });
    }
  });
});

app.get("/publish/:repoName", async (req, res) => {
  require("connect-ensure-login").ensureLoggedIn();
  const { repoName } = req.params;
  const { q } = req.query;
  const { username, id, orgs } = req.session.user;

  const isUserOwnOrg = orgs.filter(({ login }) => {
    console.log(login + "===" + q);
    return login === q;
  });
  const searchUrl = q ? `${q}` : `${username}`;
  console.log("-------------------sdfdsfdsf--------------:", isUserOwnOrg);
  const apiUrl = `${baseUrl}/repos/${searchUrl}/${repoName}?client_id=${clientID}&client_secret=${clientSecret}`;
  console.log("--------------apdd------------", apiUrl);
  const { body: repos } = await got(apiUrl, { json: true, method: "GET" });
  console.log(repos);
  libs.saveUserRepo({ repo: repos, userId: id }, (err, savedRepo) =>
    res.json({ repo: savedRepo })
  );
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
app.listen(PORT, () =>
  console.log(`app is running at port: ${PORT} in ${process.env.NODE_ENV} mode`)
);
