const express = require('express');
const app = express();
const mongoose = require('mongoose')
const port = 5000;
const route = require('./routes/route')

app.listen(port, () => {
    console.log(`App is running on localhost:${port}`);
});

const db = 'mongodb+srv://santhosh_18:santhosh1818@santhosh.q56f2et.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(db)
    .then((result)=> console.log('connected to db'))
    .catch((err)=> console.log(err));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.use(route)

app.get('/home',(req,res)=>{
    res.redirect('/');
})
