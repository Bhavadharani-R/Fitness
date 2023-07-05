import { Component , OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit{
     public packages = ["Monthly", "Quartely", "Yearly"];
     public importantlist: string[] =  [
      "Toxic Fat reduction",
      "Energy and Endurance",
      "Building Lean Muscle",
      "Healthier Digestive System",
      "Sugar Craving Body",
      "Fitness"
     ];

     public registerForm!: FormGroup;
     public userIdToUpdate!: number;
     public isUpdateActive: boolean = false;
  

     constructor(private fb: FormBuilder,
     private activatedRoute: ActivatedRoute  , 
     private api: ApiService ,
     private router: Router,
     private toastService: NgToastService){

     }
     ngOnInit(): void{
      this.registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['',Validators.required],
        email: ['', Validators.required],
        mobile: ['', Validators.required],
        weight: ['', Validators.required],
        height: ['', Validators.required],
        bmi: [''],
        bmiResults: [''],
        gender: [''],
        requireTrainers: [''],
        package: [''],
        important: [''],
        haveGymBefore: [''],
        enquiryDate: ['']
      });

    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe(val=>{
        this.userIdToUpdate = val['id'];
        this.api.getRegisteredUserId(this.userIdToUpdate)
        .subscribe(res=>{
          this.isUpdateActive = true;
         this.fillFormToUpdate(res);
        })
    })

     }

   submit(){
      this.api.postRegistration(this.registerForm.value).subscribe(res =>{
          this.toastService.success({detail:"SUCCESS", summary:"Enquiry Added", duration:3000});
          this.registerForm.reset();
          
      })
   }

    update(){
      this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
        .subscribe(res =>{
        this.toastService.success({detail:"SUCCESS", summary:"Enquiry Updated", duration:3000});
        this.registerForm.reset();
        this.router.navigate(['list'])
    })
    } 






   calculateBmi(heightValue: number){
       const weight = this.registerForm.value.weight;
       const height = heightValue;
       const bmi= weight/(height*height);
       this.registerForm.controls['bmi'].patchValue(bmi);
       
       switch (true) {
        case bmi < 18.5:
          this.registerForm.controls['bmiResults'].patchValue("UnderWeight");
          break;
          case (bmi >= 18.5 && bmi < 25):
            this.registerForm.controls['bmiResults'].patchValue("Normal");
            break;
            case (bmi >= 25 && bmi < 30):
              this.registerForm.controls['bmiResults'].patchValue("OverWeight");
              break;
             
        default:
          this.registerForm.controls['bmiResults'].patchValue("Obesity");
          break;
       }

   }

fillFormToUpdate(user: User){
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResults: user.bmiResults,
      gender: user.gender,
      requireTrainers: user.requireTrainers,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate

    })
}

}
