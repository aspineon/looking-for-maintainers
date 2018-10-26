const express = require('express');
const passport = require('passport');
const Strategy = require('passport-github').Strategy;
const got = require("got");
const mongoose = require('mongoose');
const async = require("async");
const libs = require("./libs");

const baseUrl = "https://api.github.com";
mongoose.connect('mongodb://localhost/repos',{ useNewUrlParser: true });
const Repos = require('./repos');
const Users = require('./users');
const clientID = "b2464a59102ba2db9cb1";
const clientSecret = "4e265ceaa7bfc09315438f9d9e3d795302bca1ce";

passport.use(new Strategy({
    clientID,
    clientSecret,
    callbackURL: '/login/github/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);
    const {  username, displayName, _json: {
      id, avatar_url, html_url, blog, location, email, bio, public_repos, public_gists, followers,following, created_at
    } } = profile;
    const userData = {
      github_id: id,
      name: displayName,
      username,
      email,
      avatar_url,
      html_url,
      blog,
      location,
      bio,
      public_repos,
      public_gists,
      followers,
      following,
      created_at
    };

    Users.findOneAndUpdate({ github_id: id}, userData , { upsert: true, new: true, setDefaultsOnInsert: true }, function(error, savedData) {
      if (error) console.log(error);
    console.log("mainuaerasdfsdf&&&&&&&&&&&&&&&&&&&&&&&&&&",savedData);
    return cb(null, { ...userData, id: savedData._id, accessToken, refreshToken });
      // do something with the document
    });
   
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    Repos.find({}).populate('repo').sort({stargazers_count: -1 }).limit(20).exec(function(err, repos) {
      if (err) throw err;
       res.render('home', { user: req.user, repos });

    });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/return', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });


app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  async (req, res) => {
    req.session.user  = req.user;
    const { accessToken, username, public_repos, id } = req.user;
    // const {body: sss} = await got(`${baseUrl}/users/sindresorhus?client_id=${clientID}&client_secret=${clientSecret}`, {json: true, method: 'GET'});

  //   if(!req.session.isSynced){
  //   // const totalPages = Math.ceil(public_repos/100);
  //   let reposData = [];
  //   const apiUrl = `${baseUrl}/users/${username}/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=1`;
  //   console.log(public_repos,"((repos(((((((((sddddddddddddd", apiUrl);
  //   const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
  //  //console.log(username, "((((((((((((((repos(((((((((((((((((", repos.length);

  //   reposData = [ ...reposData, ...repos];
  // //   if(totalPages > 1){
  // //   for(let i = 1; i<=totalPages; i++){      
  // //     let apiUrlNew = `${baseUrl}/users/${username}/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=${i}`;
  // //     console.log("((repos(((((((((apiUrlNew", apiUrlNew);
  // //     const {body: repos} = await got(apiUrlNew, {json: true, method: 'GET'});
  // //    // console.log(username, "((((((((((((((repos(((((((((((((((((", repos.length);
  // //     reposData = [ ...reposData, ...repos];      
  // //   }
  // // }


  //      async.mapSeries(reposData, (repo, cb) => {

  //       libs.saveUserRepo(repo, (err, savedRepo) => cb(err, savedRepo));

  //      },(err, repos) => {
  //        console.log(repos);
  //        req.session.isSynced = true;
  //        res.render('profile', { user: req.user, repos: repos });

  //      });
  //     } else {
        // console.log('***********************', req.user)
        res.render('profile', { user: req.user });
      // }

  });


//   app.get("/publish/:repoName",
//   async (req, res) => {
//     const { repoName } = req.params;


// });

app.get('/search/:repoName', require('connect-ensure-login').ensureLoggedIn(), 
async (req, res) => {
  
  console.log("---------req.user----------",req.user)
  // const { accessToken,  username } = req.user;
  const { repoName } = req.params;
  console.log("--------------req.user------------",req.session );

      const { accessToken, username, public_repos, id } = req.session.user ;
    
    const apiUrl = `${baseUrl}/search/repositories?q=${repoName}+user:${username}&client_id=${clientID}&client_secret=${clientSecret}`;
    console.log("--------------apdd------------",apiUrl);
    const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
    res.json({ repo: repos});
  
});

  app.get('/publish/:repoName', async (req, res) => {
    require('connect-ensure-login').ensureLoggedIn();
    const { repoName } = req.params;
    console.log("--------------req.user------------",req.session );
  
        const { accessToken, username, public_repos, id } = req.session.user ;
      
      const apiUrl = `${baseUrl}/repos/${username}/${repoName}?client_id=${clientID}&client_secret=${clientSecret}`;
      console.log("--------------apdd------------",apiUrl);
      const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
      res.json({ repo: repos});
    // const { repoName } = req.params;
    // const repo = new Repos({
    //   repo:repoId
    // });
    // const apiUrl = `${baseUrl}/repos/${username}/${repoId}?token=${accessToken}`;
    // console.log("((repos(((((((((sddddddddddddd", apiUrl);
    // const {body: repoContent} = await got(apiUrl, {json: true, method: 'GET'});
    // repo.save((err, data) => res.json({data}));
    
    
  });
  

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
app.listen(3011);
