'use strict'
//using express to route
const express = require('express');
//to accept JSON calls
const bodyParser = require('body-parser');
//to use the mysql database -- check db folder
// const mysql = require('mysql');
//initializing the db w/ password in seperate file and importing the connection
const db = require('./db/db.js');

const cors = require('cors')
//using moment for the timestamp/gravestone to flag for deletion. formats for mysql input
const moment = require('moment');
//setting the variables for use on game creation
let timestamp = moment().format('YYYY-MM-DD HH:mm:ss')
let gravestone = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
//initializing express to run
let app = express()
//initializing body parser
app.use(bodyParser.json());
//enabling cross origin requests from localhost
app.use(cors())
//first page to check database
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.log('error with database');
    } else {
      console.log(results[1].username);
      res.send(results)
    }
  })
})
//checking ability to add usernames after successful firebase login
app.post('/username', (req, res) => {
  console.log(req.body);
  // res.send('hit the server')
  let id = req.body.auth_id;
  let username = req.body.username;
  let email = req.body.email
  db.query('INSERT INTO users (auth_id, username, email) VALUES (?, ?, ?)', [id, username, email], (err, results) => {
    // if (err.code === 'ER_DUP_ENTRY') {
    //if this is err.code.....only seems to work with actual err message.  Screws up the else
    if (err) {
      console.log('duplicate entry');
      console.log(err.code);
      res.send({
        message: 'We\'re sorry but that email or username is already associated with an account.',
        status: false
      })
    } else {
      console.log('success');
      res.send({
        message: 'Success',
        status: true
      })
      console.log(results);
    }
  })
})

//if user has firebaseid --> check to see if they have username and send results
app.post('/usernamecheck', (req, res) => {
  console.log(req.body);
  let id = req.body.auth_id
  db.query(`SELECT username FROM users WHERE auth_id = "${id}"`, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      console.log(results);
      res.send(results)
    }
  })
})
//lets logged in user create a new game
app.post('/game', (req, res) => {
  console.log(req.body);
  let id = req.body.auth_id;
  let gameName = req.body.game_name;
  db.query('INSERT INTO game_created (creator_id, time_created, tombstone, status, game_name) VALUES (?, ?, ?, ?, ?)', [id, timestamp, gravestone, false, gameName], (err, results) => {
    if (err) {
      console.log('error creating game');
      res.send(err)
    } else {
      console.log('success')
      res.send(results);
    }
  })
})
//after user creates game, run a concurrent call to captre game id
app.post('/gameid', (req, res) => {
  let id = req.body.auth_id
  console.log(req.body);
  db.query(`SELECT * FROM game_created WHERE creator_id ="${id}" AND status = 0`, (err, results) => {
    if (err) {
      console.log('error checking created game');
      res.send(err)
    } else {
      res.send(results)
    }
  })
})

//after user creates game, this fires with the captured game id to insert the game owner into the waiting room
app.post('/join', (req, res) => {
  console.log(req.body);
  let id = req.body.auth_id
  let game = req.body.game_id
  let name = req.body.username
  db.query(`INSERT INTO waiting_room (game_id, user_id, username, score) VALUES (?, ?, ?, ?)`, [game, id, name, 0], (err, results) => {
    if (err) {
      res.send(err)
      console.log(err.code);
    } else {
      res.send('success')
    }
  })
})
//checking for existing game, if game is open send back false, else send back true. logic on the front end handles results
app.post('/gamecheck', (req, res) => {
  let id = req.body.auth_id
  db.query(`SELECT * FROM game_created WHERE creator_id ="${id}" AND status = 0`, (err, results) => {
    if (err) {
      console.log('error checking game');
      res.send(err)
    } else if (results.length > 0) {
      //checking to see if there is already an open game. if not, sends them to create game page
      res.send({
        status: false
      })
    } else {
      res.send({
        status: true
      })
    }
  })
})
// checking results of waiting_room table. this needs to be fired to make sure that new people are displayed before game commit.
app.post('/waiting', (req, res) => {
  console.log(req.body);
  db.query(`SELECT * FROM waiting_room WHERE game_id = ${req.body.game_id}`, (err, results) => {
    if (err) {
      console.log('not working');
      console.log(err);
    } else {
      console.log('success....very nice......');
      res.send(results)
    }
  })
})


app.post('/deleteplayerfromgame', (req, res) => {
  console.log(req.body);
  db.query(`DELETE FROM waiting_room WHERE game_id = ${req.body.game_id} AND user_id = "${req.body.user_id}"`, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err)
      console.log('error deleteplayerfromgame');
    } else {
      console.log('successfully deleted player');
      res.send('Deleted player succesffully')
    }
  })
})

//non-game-owning players find game by typing in game name first, then goes to join post up abobe
app.post('/joingamename', (req, res) => {
  console.log(req.body);
  db.query(`SELECT * FROM game_created WHERE game_name ="${req.body.game_name}" AND status = 0`, (err, results) => {
    if (err) {
      console.log('error retrieving game by name');
      console.log(err);
      res.send(err)
    } else {
      res.send(results)
    }
  })
})


app.post('/inputscore', (req, res) => {

  function compare(a, b) {
    const scoreA = parseInt(a.score, 10)
    const scoreB = parseInt(b.score, 10)
    let comparison = 0;
    if (scoreA > scoreB) {
      comparison = -1;
    } else if (scoreA < scoreB) {
      comparison = 1;
    }
    return comparison;
  }
  let sortedRanker = req.body.ranker.sort(compare)
  // console.log(sortedRanker);

  function ranking(obj) {
    for (let y = 0; y < obj.length; y++) {
      obj[y].place = y + 1
    }
    // console.log(obj);
    return (obj)
  }
  let finalRanker = ranking(sortedRanker)
  console.log(finalRanker);

  function sendStatement(finalRanker) {
    let counter = 0;
    console.log(finalRanker.length);
    for (let z = 0; z < finalRanker.length; z++) {
      let id = finalRanker[z].game_id
      let user = finalRanker[z].user_id
      let name = finalRanker[z].username
      let score = finalRanker[z].score
      let place = finalRanker[z].place
      db.query('INSERT INTO game_results(game_id, username, user_id, score, place) VALUES (?, ?, ?, ?, ?)', [id, name, user, score, place], (err, results) => {
        if (err) {
          console.log('error logging game');
          // console.log(err);
          console.log(counter);
          if (counter < finalRanker.length - 1) {
            counter++
          } else {
            console.log('it gets to this err');
            res.send(err)
          }
        } else {
          console.log(counter);
          if (counter < finalRanker.length - 1) {
            counter++
          } else {
            console.log('finally getting to success');
            res.send('success')
          }
        }
      })
    }
  }
  sendStatement(finalRanker)
})

app.post('/closeGame', (req, res) => {
  console.log(req.body);
  db.query(`UPDATE game_created SET status = 1 WHERE game_id = ${req.body.game_id}`, (err, results) => {
    if (err) {
      res.send({
        status: 'err'
      })
    } else {
      res.send({
        status: 'success'
      })
    }
  })
})

app.post('/cancelgame', (req, res) => {
  console.log(req.body);
  const tables = ['game_created', 'waiting_room']
  let counter = 0;
  for (let x = 0; x < tables.length; x++) {
    db.query(`DELETE FROM ${tables[x]} WHERE game_id = ${req.body.game_id}`, (err, results) => {
      if (err) {
        if (counter < 1) {
          console.log(counter);
          counter++

          console.log(err);
          console.log(tables[x]);
        } else {
          res.send({
            status: 'err'
          })
          console.log('error deleting game instance');
        }
      } else {
        console.log(counter);
        if (counter < 1) {

          counter++

          console.log(results);
          console.log(tables[x]);
        } else {
          console.log('successfully deleted game isntance');
          res.send({
            status: 'success'
          })
        }
      }
    })
  }
})

app.post('/playerstats', (req, res) => {
  console.log(req.body);
  db.query(`SELECT * FROM game_results WHERE user_id = "${req.body.auth_id}"`, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      console.log(results);
      res.send(results)
    }
  })
})

app.listen(3000, () => {
  console.log('listening on port 3000');
})