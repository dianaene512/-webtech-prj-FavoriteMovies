var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const Sequelize = require('sequelize')
const sequelize = new Sequelize('wtdatabase', 'user', '', {
  dialect : 'mysql',
  define : {
    timestamps : false
  }
})

var app = new express();
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(express.static('../backend'));

var Genre = sequelize.define('genre', {
    name : {
    type : Sequelize.STRING,
    allowNull : false,
    }
    
}, {
  underscored : true
})

var Movie = sequelize.define('movie', {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    year: Sequelize.INTEGER,
    cast: Sequelize.STRING,
    rating: Sequelize.FLOAT
})

Genre.hasMany(Movie)

//CREATE

//app.get('/', function (req, res) {
  //  res.send('Favorite movie manager');
//});

// app.get('/create', (req, res, next) => {
//   sequelize.sync({force : true})
//     .then(() => res.status(201).send('created'))
//     .catch((error) => next(error))
// })
//genre
app.post('/genres', (req, res, next) => {
  Genre.create(req.body)
    .then(() => res.status(201).send('Genre successfully created'))
    .catch((error,msg) => {next(error, msg)
      
    })
})


//movie

app.post('/genres/:gid/movies', (req, res, next) => {
  Genre.findById(req.params.gid)
    .then((genre) => {
      if(genre){
        let movie = req.body
        movie.genre_id = genre.id
        movie.name = "mname"
        
        return Movie.create(movie)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('Movie successfully created')
      }
    })
    .catch((err) => next(err))
})

//READ all genres
app.get('/genres', (req, res, next) => {
  Genre.findAll()
    .then((user) => res.status(200).json(user))
    .catch((error) => next(error))
})

//READ genre by id
app.get('/genres/:id', (req, res, next) => {
  Genre.findById(req.params.id)
    .then((user) => {
      if (user){
        res.status(200).json(user)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((error) => next(error))
})

//READ all movies by genre
app.get('/genres/:gid/movies', (req, res, next) => {
  Movie.findById(req.params.gid)
    .then((user) => {
      if(user){
        return user.getMovies()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then((movie) => {
      if (!res.headersSent){
        res.status(200).json(movie)
      }
    })
    .catch((err) => next(err))
})


//READ movie by id
app.get('/genres/:gid/movies/:mid', (req, res, next) => {
  Movie.findById(req.params.mid)
    .then((movie) => {
      if (movie){
        res.status(200).json(movie)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((err) => next(err))
})


//UPDATE movie by id
app.put('/genres/:gid/movies/:mid', (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (movie){
        return movie.update(req.body)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('Movie successfully modified')
      }
    })
    .catch((err) => next(err))  
})

//DELETE movie by id
app.delete('/genres/:gid/movies/:mid', (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (movie){
        return movie.destroy()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('Movie successfully deleted')
      }
    })
    .catch((err) => next(err))
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('There has been an error')
})

app.listen(process.env.PORT || 8080)