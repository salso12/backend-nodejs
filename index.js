const express = require('express');
const courseRoutes = require('./routes/courses.routes')
const blogRoutes = require('./routes/blog.routes')
const categorieRoutes = require('./routes/categorie.routes')
var bodyParser = require('body-parser')

// const path = require('path');
// const fileUpload = require('express-fileupload');
// let relativePath = 'public/images/';

// let absolutePath = path.resolve(relativePath);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// app.use(fileUpload())

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', 'template')

app.use(courseRoutes)
app.use(blogRoutes);
app.use(categorieRoutes);



// app.get('/', (req, res) => res.render("home.pug", {
//     myTitle: title
// }))
// app.get('/article', (req, res) => res.render("index.ejs") )

app.listen(4001, (req,res) => {
    console.log("The serve is running")
    // console.log(absolutePath);
    
})
