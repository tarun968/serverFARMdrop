const ProductModel = require('./productsDB')
// 
exports.FindAll = async (req,res) =>{
    const data = await ProductModel.find({})
    console.log("",data[0].ProductID)
    if(!data){
        return res.json({error:'Error in the database'})
    }
    return res.json({message:data})
}
exports.FindbyName = async (req,res) =>{
    const query = req.query.Name
    // console.log('Query',query)
    const data = await ProductModel.find({})
    var array = [];
    data.forEach(element => {
        // console.log('x',element)
        if (element.NameofProduct.toLowerCase().includes(query)){
            array.push(element)
        }
    });
    return res.json({message:array})
}
exports.FindbyID = async (req,res) =>{
    const query = req.query.ID
    // console.log('Query',query)
    const data = await ProductModel.find({})
    var array = [];
    data.forEach(element => {
        // console.log('x',element._id.toString())
        if (element._id.toString().toLowerCase().includes(query)){
            array.push(element)
        }
    });
    return res.json({message:array})
}
exports.FindbyAdder = async (req,res) =>{
    const query = req.query.Adder
    // console.log('Query',query)
    const data = await ProductModel.find({})
    var array = [];
    data.forEach(element => {
        // console.log('x',element)
        if (element.AddedBy.toLowerCase().includes(query)){
            array.push(element)
        }
    });
    return res.json({message:array})
}
exports.FindbyRating = async (req,res) =>{
    const query = req.query.Rating
    console.log('Query',query)
    const data = await ProductModel.find({})
    var array = [];
    data.forEach(element => {
        // console.log('x',element)
        if (element.Rating >= query){
            array.push(element)
        }
    });
    return res.json({message:array})
}