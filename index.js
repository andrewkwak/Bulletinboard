const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/board', function(request, response){
  pg.connect('postgres://localhost:5432/bulletinboard', function(err, client, done){
    client.query('select * from messages', function(err, result){
      response.render('board', {titles: result.rows});
      done();
      pg.end();
    })
  })
})


app.get('/board/:id', function(request, response){
  pg.connect('postgres://localhost:5432/bulletinboard', function(err, client, done){
    let user_id = request.params.id;
    client.query(`select * from messages where id='${user_id}'`, function(err, result){
      response.render('message', { post: result.rows[0] });
      done();
      pg.end();
    });
  });
});

app.post('/board', function(request, response){
  pg.connect('postgres://localhost:5432/bulletinboard', function(err, client, done){
    client.query(`insert into messages (title, body) values ('${request.body.title}', '${request.body.body}');`, function(err, result){
    if(request.body.title !== ""){
      response.redirect('/board');
      done();
      pg.end();
    }
    })
  })
})

app.get('*', function(request, response){
  response.send("You probably were trying to get to /board.  Try again.")
})

app.listen(3000, function() {
  console.log("Now listening in port 3000");
})
