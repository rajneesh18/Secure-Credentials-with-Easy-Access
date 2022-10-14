const express = require("express");
const cors = require("cors");
const app = express();

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const apiRouter = require("./routes/api");

app.use(cors());
app.use('/', apiRouter);

app.set('view engine', 'ejs');

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`I am live again ${port}`);
});