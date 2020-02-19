import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Task } from './task';
import { Topic } from './topic';
@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {

  constructor(private http:HttpClient) { }

  addtask(title){

    return this.http.post('http://localhost:4300/users/addtask',{title:title})

  }

  gettask(){
    return this.http.get<Task[]>('http://localhost:4300/users/getalltask')
  }

  gettopics(tid)
  {
    return this.http.get<Topic[]>('http://localhost:4300/users/gettopics/'+tid)
  }

  addtopic(id,topic)
  {
    return this.http.post('http://localhost:4300/users/addtopic/'+id,{title:topic,taskid:id})
  }

  deltopic(id)
  {
    return this.http.delete('http://localhost:4300/users/deltask/'+id)
  }

  complete(tid){
  return  this.http.put('http://localhost:4300/users/updatetopic/:topicid',{complete:true})
  }

  incomplete(tid){
    return  this.http.put('http://localhost:4300/users/updatetopic/:topicid',{complete:false})
    }

  login(username,password){

    return this.http.post('http://localhost:4300/users/login',{username,password},{observe:'response'})
  }
  signup(username,password){

    return this.http.post('http://localhost:4300/users/signup',{username,password},{observe:'response'})
  }

  updatetask(id,title){
    return this.http.put('http://localhost:4300/users/updatetask/'+id,{title})
  }

  updatetopic(id,title)
  {
    return this.http.put('http://localhost:4300/users/updatetopic/'+id,{title})
  }

  del(id){
    return this.http.delete('http://localhost:4300/users/deltopic/'+id)
  }

  
}
