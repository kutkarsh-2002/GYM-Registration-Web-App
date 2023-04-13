import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string="http://localhost:3000/enquiry";

  constructor(private http:HttpClient) { }

  //post Registration
  postRegistration(registerObj: User){
    return this.http.post<User>(`${this.baseUrl}`, registerObj);
  }
  
  //getRegisterUser

  getRegisteredUser(){
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  //updateRegisterUser
  updateRegisterUser(registerObj:User, id:number){
    return this.http.put<User>(`${this.baseUrl}/${id}`, registerObj);
  }

  //delete User from the registration list
  deleteRegistered(id:number){
    return this.http.delete<User>(`${this.baseUrl}/${id}`)
  }
  getRegisteredUserId(id:number){
    
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  
}
