const express = require('express');
const app = express();
const port = 5000;
const route = require('./routes/route')

app.listen(port, () => {
    console.log(`App is running on localhost:${port}`);
});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.use(route)

app.get('/home',(req,res)=>{
    res.redirect('/');
})
