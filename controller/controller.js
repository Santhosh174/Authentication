const index = (req,res) => {
    res.render('index',{title: "Home"});
}
const product = (req,res) => {
    res.render('product',{title: "Products"})
}
const details = (req,res) => {
    const product = req.query.product;
    res.render('details', { title: product ,product });
}
const signin = (req,res) => {
    res.render('signin')
}
const signup = (req,res) => {
    res.render('signup')
}
module.exports = {
    index,
    product,
    details,
    signin,
    signup
}