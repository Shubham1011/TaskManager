const mongoose = require('mongoose')
const taskschema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    uid:{
        type:mongoose.Types.ObjectId,
        required:true
    }
})
const Task=mongoose.model('Task',taskschema)
module.exports=Task