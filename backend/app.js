'use strict'
//to accept JSON calls
const bodyParser = require('body-parser');
//for localhost development
const cors = require('cors');
//using express to route
const express = require('express');
//initializing the db w/ password in seperate file and importing the connection
const db = require('./db/db.js');
//using moment for the timestamp/gravestone to flag for deletion. formats for mysql input
const moment = require('moment');
//to use the mysql database -- check db folder
const mysql = require('mysql');
//setting the variables for use on game creation
let timestamp = moment().format('YYYY-MM-DD HH:mm:ss')
let gravestone = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
//initializing express to run
let app = express()
//initializing body parser
app.use(bodyParser.json());
//enabling cross origin requests from localhost
app.use(cors())

// ability to add usernames after successful firebase login
app.post('/username', (req, res) => {
  let id = req.body.auth_id;
  let username = req.body.username;
  let email = req.body.email
  db.query('INSERT INTO users (auth_id, username, email) VALUES (?, ?, ?)', [id, username, email], (err, results) => {
    if (err) {
      console.log(err.code);
      res.send({
        message: 'We\'re sorry but that email or username is already associated with an account.',
        status: false
      })
    } else {
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
  let id = req.body.auth_id
  db.query(`SELECT username FROM users WHERE auth_id = "${id}"`, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      res.send(results)
    }
  })
})

//lets logged in user create a new game
app.post('/game', (req, res) => {
  let id = req.body.auth_id;
  let gameName = req.body.game_name;
  db.query('INSERT INTO game_created (creator_id, time_created, tombstone, status, game_name) VALUES (?, ?, ?, ?, ?)', [id, timestamp, gravestone, false, gameName], (err, results) => {
    if (err) {
      console.log('error creating game');
      res.send(err)
    } else {
      res.send(results);
    }
  })
})

//after user creates game, run a concurrent call to capture game id
app.post('/gameid', (req, res) => {
  let id = req.body.auth_id
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
  let id = req.body.auth_id
  let game = req.body.game_id
  let name = req.body.username
  db.query(`INSERT INTO waiting_room (game_id, user_id, username, score, anonymous) VALUES (?, ?, ?, ?, ?)`, [game, id, name, 0, 0], (err, results) => {
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
  db.query(`SELECT * FROM waiting_room WHERE game_id = ${req.body.game_id}`, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results)
    }
  })
})

// allows game owner to create new players in game.  They are given code anonymous so they will not show up in future stat search results
app.post('/addPlayer', (req, res) => {
  let game = req.body.game_id
  let id = 'anonymous'
  let name = req.body.username
  db.query(`INSERT INTO waiting_room (game_id, user_id, username, score, anonymous) VALUES (?, ?, ?, ?, ?)`, [game, id, name, 0, 1], (err, results) => {
    if (err) {
      res.send(err)
      console.log(err.code);
    } else {
      res.send('success')
    }
  })

})

// allows game owner to delete players from current game before start
app.post('/deleteplayerfromgame', (req, res) => {
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

// allows owner to record game scores and finalize table
app.post('/inputscore', (req, res) => {
  // sort function to first arrange and place them by score
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
  // function to add new value to place key
  function ranking(obj) {
    for (let y = 0; y < obj.length; y++) {
      obj[y].place = y + 1
    }
    return (obj)
  }
  let finalRanker = ranking(sortedRanker)
  // loop to send a db call for each player in game.
  function sendStatement(finalRanker) {
    let counter = 0;
    for (let z = 0; z < finalRanker.length; z++) {
      let id = finalRanker[z].game_id
      let user = finalRanker[z].user_id
      let name = finalRanker[z].username
      let score = finalRanker[z].score
      let place = finalRanker[z].place
      let anonymous = finalRanker[z].anonymous
      //db query with if/else to determine if there was an error or not to send back to user
      db.query('INSERT INTO game_results(game_id, username, user_id, score, place, anonymous) VALUES (?, ?, ?, ?, ?, ?)', [id, name, user, score, place, anonymous], (err, results) => {
        if (err) {
          console.log('error logging game');
          // console.log(err);
          if (counter < finalRanker.length - 1) {
            counter++
          } else {
            res.send(err)
          }
        } else {
          if (counter < finalRanker.length - 1) {
            counter++
          } else {
            res.send('success')
          }
        }
      })
    }
  }
  sendStatement(finalRanker)
})

// after game is successfully recorded, make call to close game in game_created which allows owner to make new game.
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

// allows game owner to cancel game at any time
app.post('/cancelgame', (req, res) => {
  const tables = ['game_created', 'waiting_room']
  let counter = 0;
  // loop to delete all info with game_id of current game
  for (let x = 0; x < tables.length; x++) {
    db.query(`DELETE FROM ${tables[x]} WHERE game_id = ${req.body.game_id}`, (err, results) => {
      if (err) {
        if (counter < 1) {
          counter++
          console.log(err);
        } else {
          res.send({
            status: 'err'
          })
        }
      } else {
        if (counter < 1) {
          counter++
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

// pulls the current players record with all games played.
app.post('/playerstats', (req, res) => {
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

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000');
})
