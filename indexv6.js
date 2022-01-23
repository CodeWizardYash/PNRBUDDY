
const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const multer = require("multer")

const xlsx = require("xlsx");

const fs = require("fs");
const { render } = require("express/lib/response");

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {

res.render('index2')
    

});



app.post('/convert', (req, res) => {

    const hello = req.body.falsename
    console.log(hello)
    res.render(hello)

})





app.listen({port: 8000}, () => {
    console.log("server started")
})