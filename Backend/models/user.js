const mongoose = require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const userschema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    sessions:[{
        token:{
            type:String,
        required:true
    },
    expiresIn:{
        type:Number,
        required:true
    }
    }]
})
//model methods

userschema.statics.findByIdandToken=(id,token)=>{
    const user=this
     return new Promise((resolve,reject)=>{
         User.findOne({
             _id:id,
             'sessions.token':token
         }).exec((err,doc)=>{
             if(!err)
             {
                 console.log('user');
                 
             resolve(doc)
             }
             else{
                 console.log('no user');
                 
                 reject('no user')
             }
         })
     })
}

userschema.statics.findByCredentials=(username,password)=>{
    let user=this
    return new Promise((resolve,reject)=>{
        User.findOne({
            username
        }).then((user)=>{
            if(!user)
            return reject('invalid credentials')
            else{
                resolve(user)
            }
        })
    })
    /**User.findOne({username:username}).then((user)=>{
        if(!user) return Promise.reject()
        bcrypt.compare(password,user.password,(err,res)=>{
            if(res){
            resolve(user)
            }else{
            reject()
        }
        })
    })**/

}

userschema.pre('save', function (next){
    let user=this
    let count=10
   
    
    if(user.isModified('password'))
    {
        
        bcrypt.genSalt(count,(err,salt)=>{
            console.log('in save');
            if(err) console.log(err.message);
            
            bcrypt.hash(user.password,salt,(err,hash)=>{
                console.log('in save');
                if(!err)
                user.password=hash
               else
               console.log(err.message);
               
                next();
             
            })
        })
            
        

    }
    else{
        next();
    }

})

userschema.statics.hasrefreshtokenexpired=(expiresat)=>{
    let epoch=Date.now()/1000
    if(expiresat>epoch)
    return false //not expired
    else return true
}


//instance methods
userschema.methods.toJson= function(){
    const user=this
    const userobj=user.toObject()
    return {
        username:userobj.username,

    }
}

userschema.methods.generateaccesstoken=function(){
    const user=this
    console.log('in generate accestoken');
    
    return new Promise((resolve,reject)=>{
        jwt.sign({_id:user._id},'secret',{expiresIn:'10m'},(err,d)=>{
            if(!err)
            {
                console.log('ddd');
                
                resolve(d)
            }
            else{
                
                
                reject();   
            }
        })
    })
    
}

userschema.methods.generaterefreshtoken=function(){
    return new Promise((resolve,reject)=>{
     crypto.randomBytes(64,(err,buff)=>{
         if(!err)
         {
             let token=buff.toString('hex')
             return resolve(token)
         }
     })
    })
}

userschema.methods.createsession=function(){
    const user=this
    return new Promise((resolve,reject)=>{
    console.log('in create sesson');
    
        return user.generaterefreshtoken().then((refreshtoken)=>{
            return savesessiontodb(user,refreshtoken)
        }).then((refreshtoken)=>{


            return resolve(refreshtoken)

        }).catch((e)=>{
            console.log('in this catch');
            
            return reject('no session created')
            
        })

    })


}

let savesessiontodb=(user,refreshtoken)=>{
    return new Promise((resolve,reject)=>{
        let expirytime=generateexpirytime();
        user.sessions.push({token:refreshtoken,expiresIn:expirytime})
        user.save().then(()=>{
            console.log('user saved');
            
return resolve(refreshtoken)
        })
    })
}

let generateexpirytime=()=>{
    let days='10'
   let seconds=((days*24)*60)*60;
    
    return (Date.now()/1000)+seconds
}
const User=mongoose.model('User',userschema)
module.exports=User