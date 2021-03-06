const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000

// Set the view engine for the express app
app.set("view engine", "pug")

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xww~
app.use(bodyParser.urlencoded({ extended: true}));

// Database
const Pool = require('pg').Pool

console.log(port)

var connectionParams = null;
if (process.env.DATABASE_URL != null) {
  connectionParams = {
    connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false}
  }
} else {
  connectionParams = {
    user: 'api_user',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432
  }
}
console.log(connectionParams)
const pool = new Pool(connectionParams)

/*
const pool = new Pool({
  user: 'api_user',
  host: process.env.DATABASE_URL || 'localhost',
  database: 'api',
  password: 'password',
  port: 5432
})
*/


app.get('/', (req, res) => {
  console.log('Accept: ' + req.get('Accept'))
  pool.query('SELECT VERSION()', (err, version_results) => {
    console.log(err, version_results.rows)

    pool.query('SELECT * FROM team_members', (err, team_members_results) => {
      console.log(err, team_members_results.rows)
      res.render('index', {
                           teamNumber: 1,
                           databaseVersion: version_results.rows[0].version,
                           teamMember: team_members_results.rows
                          })
      console.log('Content-Type: ' + res.get('Content-Type'))
    })
  })
})


app.post('/', (req, res) => {
  pool.query(`INSERT INTO team_members (first_name, last_name) VALUES ('${req.body.first_name}', '${req.body.last_name}')`, (err, result) => {
    console.log(err, result)
    res.redirect('/')
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
