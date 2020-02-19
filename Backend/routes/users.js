var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var Task=mongoose.model('Task')
var User=mongoose.model('User')
var Topic=mongoose.model('Topic')
var jwt = require('jsonwebtoken')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

let authenticate=(req,res,next)=>{
  let token=req.header('x-access-token')
  console.log(token);
  
  jwt.verify(token,'secret',(err,decoded)=>{
    if(!err)
    {
      console.log(decoded);
      
      req._uid=decoded._id
      next();
    }
    else{
      console.log('in error');
     res.sendStatus(401).send('not allowed')
     
    }
    
  })

}

router.get('/getalltask',authenticate,async (req,res)=>{

 await Task.find({
  uid:req._uid
 }).exec((err,d)=>{
   console.log(d);
   if(!err)
   res.json(d)
  else
  console.log(err.message);
  
  
 })

  
})

router.post('/addtask',authenticate,async (req,res)=>{
const task=new Task()
task.title=req.body.title
task.uid=req._uid
await task.save().then((d)=>{
  console.log(d);
  res.send(d)
  
})
})

router.put('/updatetask/:id',authenticate,async(req,res)=>{
await Task.findByIdAndUpdate({
  _id:req.params.id,
  uid:req._uid
},{
  $set:req.body
}).exec((err,d)=>{
  if(!err)
  res.send(d)
  else
  console.log(err.message);
  
})
})

router.get('/gettopics/:tid',authenticate,async (req,res)=>{
await Topic.find({
  taskid:req.params.tid
}).exec((err,d)=>{
  res.json(d)
})
})

router.delete('/deltopic/:id',authenticate,(req,res)=>{
  Topic.findByIdAndDelete({
    _id:req.params.id
  }).exec((err,d)=>{
    if(!err)
    res.send(d)
    else
    console.log(err.message);
    
  })
})

router.delete('/deltask/:id',authenticate,async (req,res)=>{
  Task.findOneAndDelete({
    _id:req.params.id,
    uid:req._uid
  }).exec((err,d)=>{
                              
    //delete all topics associated with the task
    if(d!=null)
    {
    Topic.deleteMany({
      taskid:d._id
    }).then((d)=>{
      console.log('deletion successfull');
      res.send(d)
    })
  }
  else{
    res.sendStatus(403)
  }
  }).catch((e)=>{
    res.send(e.message)
  })
})

router.post('/addtopic/:tid',authenticate,(req,res)=>{

  Task.findOne({
    _id:req.params.tid,
    uid:req._uid
  }).exec((err,d)=>{
    if(err)
    {
      res.sendStatus(403)
    }
    else{
      const topic=new Topic()
      topic.title=req.body.title
      topic.taskid=req.params.tid     
      topic.save().then((d)=>{
        res.json(d)
      })
    }
  })
 
})


//in this case Im not checking the TASK user has created because the user 
// will only be shown the task which he has created already so he can update only that
router.put('/updatetopic/:topicid',authenticate,(req,res)=>{
  Topic.findOneAndUpdate({
    _id:req.params.topicid,
    
  },{$set:req.body
  }).exec((err,data)=>{
    if(!err)
    res.send(data)
    else{
      console.log(err.message);
      
    }
  })
})  
  
router.post('/signup', (req,res)=>{
  console.log('hello');
    
  const user=new User(req.body);
  console.log(user);
  console.log('hellllooooo');
   user.save().then(()=>{
    console.log('after save');
    
    return user.createsession()
  }).then((refreshtoken)=>{
   
    
    
    return user.generateaccesstoken().then((accesstoken)=>{
      console.log('in here');
      
      return {accesstoken,refreshtoken}
    })
  }).then((authtoken)=>{
    console.log(authtoken);
    
    res.header('x-refresh-token',authtoken.refreshtoken)
    res.header('x-access-token',authtoken.accesstoken)
    .send(user.toJSON())
  }).catch((e)=>{
    res.send(e.message)
  })
})

router.post('/login',(req,res)=>{
  let username=req.body.username
  let password=req.body.password
  let use1r={}
  User.findByCredentials(username,password).then((user)=>{
    console.log(user);
    use1r=user
    return user.createsession()
  }).then((refreshtoken)=>{
    console.log(refreshtoken);
    console.log('hello');
    return use1r.generateaccesstoken().then((accesstoken)=>{
    console.log(accesstoken+'hey');
    
      return {accesstoken,refreshtoken}
    })
  }).then((authtoken)=>{
    
    
    res.header('x-refresh-token',authtoken.refreshtoken)
    res.header('x-access-token',authtoken.accesstoken)
    .send(use1r.toJSON())
  }).catch((e)=>{
  //  console.log('in catc');
    
    res.send(e.message)
  })
})
let verify=(req,res,next)=>{
  console.log('inside middleware');
  
  let refreshtoken=req.header('x-refresh-token')
  let _id=req.header('id')
  console.log(_id+' ---'+refreshtoken+'no');
  
  User.findByIdandToken(_id,refreshtoken).then((user)=>{
    console.log(user);
    
    if(user===null)
    { 
      console.log('please throw error');
      
    return Promise.reject('user not found')
    }
    else{
    console.log('in else');
    
    req.user_id=user._id
    req.userObj=user
    req.refreshtoken=refreshtoken
  let isvalid=false
    user.sessions.forEach((session)=>{
      if(session.token===refreshtoken)
      {
        if(!User.hasrefreshtokenexpired(session.expiresIn))
        {
  isvalid=true
        }
      }
    })
    console.log(isvalid);
    
  
    if(isvalid)
    {
  next();
    }
    else{
  return Promise.reject('not valid')
    }
  
    }
  }).catch((e)=>{
    console.log('in catch');
    
    res.send(e)
  })
  

  } 
  
  

router.get('/users/me',verify,(req,res)=>{

  //we know that refreshtoken is valid , we have userid and userobj

  req.userObj.generateaccesstoken().then((accesstoken)=>{
    res.header('x-access-token',accesstoken).send({accesstoken})
  }).catch(e=>{
    res.send(e.message)
  })



})

//middleware to check accesstoken

module.exports = router;
