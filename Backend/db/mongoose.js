const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/NodeJs',{ useNewUrlParser: true } ).then(()=>{
    console.log("connection to database successfull");
    
})

