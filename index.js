import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "password123",
  port: 5432,
})
db.connect()

db.query ("SELECT * FROM capitals", (err, res)=>{
  if(err){
    console.error("Error dectecting", err.stack)
  }
  else{
    quiz = res.rows;
  }
  db.end();
})

let quiz = [
  {country: "France", capital: "paris"},
  {country: "United Kingdom", capital: "england"},
  {country: "Nigeria", capital: "abuja"}
]
 let totalCorrect = 0;

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static("public"));

  let currentQuestion = {};

  app.get("/", async (req,res)=>{
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs", {question: currentQuestion});
  })
  app.post("/submit", (req, res)=>{
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if(currentQuestion.capital.toLowerCase()=== answer.toLowerCase()){
      totalCorrect++;
      isCorrect = true;
    }
    nextQuestion()

    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: isCorrect,
      totalScore: totalCorrect
    })
  })

    async function nextQuestion(){
      var randomQuestion = quiz[Math.floor(Math.random()*quiz.length)];

      currentQuestion = randomQuestion;
    }

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


