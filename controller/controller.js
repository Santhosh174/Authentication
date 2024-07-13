const index = (req,res) => {
    res.render('index');
}
const product = (req,res) => {
    res.render('product')
}
module.exports = {
    index,
    product
}