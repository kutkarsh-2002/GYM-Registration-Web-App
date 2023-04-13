import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms'
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css'],
})
export class CreateRegistrationComponent implements OnInit {
  public packages = ['Monthly', 'Quartely', 'Yearly'];
  public genders = ['Male', 'Female'];
  public importantList: string[] = [
    'Toxic Fat Reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  public registerForm!:FormGroup;
  public userIdToUpdate!:number;
  public isUpdateActive:boolean=false;

  constructor(private formBuilder: FormBuilder, private api:ApiService, private toastService:NgToastService, private activatedRoute:ActivatedRoute, private router:Router) { }
  ngOnInit(){
    this.registerForm=this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['']

    })

    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
    })
    
    this.activatedRoute.params.subscribe(val=>{
      
      this.userIdToUpdate=val['id'];
      console.log(val['id']);
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res=>{
        this.isUpdateActive=true;
        this.fillFormToUpdate(res);
      })
    })
  }

  submit(){
    
    this.api.postRegistration(this.registerForm.value).subscribe(res=>{
      this.toastService.success({detail:"Success", summary:"Enquiry Added", duration:3000});
      this.registerForm.reset();
    })
    
  }

  update(){
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate).subscribe(res=>{
      this.toastService.success({detail:"Success", summary:"Enquiry updated", duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
    })
  }

  calculateBmi(heightValue:number){
    const weight=this.registerForm.value.weight;
    const height=heightValue;
    const bmi=Math.floor((weight)/(height*height));
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch(true){
      case bmi<18.5:
        this.registerForm.controls['bmiResult'].patchValue('underWeight');
        break;
      case (bmi>=18.5 && bmi<25):
        this.registerForm.controls['bmiResult'].patchValue('normalWeight');
        break;
      case (bmi>=25 && bmi<30):
        this.registerForm.controls['bmiResult'].patchValue('overWeight');
        break;

      default:
        this.registerForm.controls['bmiResult'].patchValue('Obeseity');
      break;
    }
  }

  fillFormToUpdate(user:User){
    this.registerForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email:user.email,
      mobile: user.mobile,
      weight:user.weight,
      height:user.height,
      bmi:user.bmi,
      bmiResult:user.bmiResult,
      gender:user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      import:user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }

}
