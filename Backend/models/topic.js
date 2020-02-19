const mongoose = require('mongoose')
const topicschema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    taskid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    complete:{
        type:Boolean,
        required:true,
        default:false
    }
})
const Topic=mongoose.model('Topic',topicschema )
module.exports=Topic