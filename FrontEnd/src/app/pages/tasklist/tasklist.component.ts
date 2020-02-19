import { Component, OnInit } from '@angular/core';
import { TaskserviceService } from 'src/app/taskservice.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
addtopic=false
updatetopic=false
title=''
mainid=''
taskarray=[]
topicarray=[]
addt=false
taskid=''
updatetitle=''
updateid=''
updatetid=''
showselect=true
updatetask=false
tellnotask=''
shownotask=false
updatedtask={}
aretheretopic=false
tellme=''
  constructor(private service:TaskserviceService) { }

  ngOnInit() {
 this.service.gettask().subscribe((d)=>{
   console.log(d);
   if(d.length===0)
   {
     this.aretheretopic=true
this.tellme='You got no topics , Click the add button to get started'
   }
   this.taskarray=d
})
  }

  addme(){
this.addtopic=true
this.aretheretopic=false
this.topicarray=[]
  }

  reallyadd(title){
    this.service.addtask(title).subscribe((d)=>{
      console.log(d);
      this.ngOnInit()
    this.addtopic=false
      
    })

  }

  showtopic(id)
  {
    this.showselect=false
    this.mainid=id
    if(this.taskarray.length!=0)
    {
    this.service.gettopics(id).subscribe((d)=>{
      console.log('holla');
      if(d.length===0)
      {
        this.shownotask=true
        this.tellnotask='No tasks in here , Start adding !!'
    this.topicarray=[]
    if(this.taskarray.length===0)
    this.shownotask=false
      }
      else{
        this.shownotask=false
        this.topicarray=d
      }
      
    })
  }
  }
addtopics(id)
{
  this.taskid=id
  this.addt=true
  if(this.taskarray.length!=0)
  {
  this.showtopic(id)
this.shownotask=false  
}
}

addmeto(){
  console.log(this.taskid+' '+this.title);;
  
  
this.service.addtopic(this.taskid,this.title).subscribe((d)=>{
  this.topicarray.push(d)
  this.showtopic(this.taskid)
  this.addt=false
  this.title=''
})
//this.showtopic(this.taskid)
}

complete(task){
  console.log(task);
  if(task.complete===false)
  {
  this.service.complete(task._id).subscribe((d)=>{
    console.log(d);
    task.complete=true

  })
}
else{
  this.service.incomplete(task._id).subscribe((d)=>{
    console.log(d);
    task.complete=false

  })
}

}
updateetopic=(id,title)=>{
  this.updatetopic=true
 this.updateid=id
 this.updatetitle=title
 this.showtopic(id)
}

updateetask=(id,title)=>{
this.updatetask=true
this.updatetitle=title
this.updatetid=id
}
reallyupdatetask=()=>{
  alert(this.updatetid+" "+this.updatetitle);
  
  this.service.updatetopic(this.updatetid,this.updatetitle).subscribe(d=>{
    console.log('heello'+d);
    this.showtopic(this.mainid)
    this.updatetask=false
    
  })

}
reallyupdate()
{
  alert(this.updateid+this.updatetitle)
this.service.updatetask(this.updateid,this.updatetitle).subscribe((d)=>{
  console.log(d);
  this.ngOnInit();
  this.updatetopic=false
})

}

deltopic(id)
{
  this.service.deltopic(id).subscribe(d=>{
    console.log('deletion successfull');
    this.showtopic(id)
    this.ngOnInit();
    
  })
}

deltask=(id)=>{
this.service.del(id).subscribe((d)=>{
  console.log(d);
  console.log('done deletion');
  
  this.showtopic(this.mainid)
})
}


}
