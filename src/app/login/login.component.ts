import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  data:any;
  token:any;
  type:any;

    constructor(private formBuilder: FormBuilder, private dataService: DataService,
      private toastr: ToastrService, private router:Router, )  {}

      loginForm(){
        this.form = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
        })
      }

  ngOnInit(): void {
    this.loginForm();
  }
  
  get f(){
    return this.form.controls;
  }
  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
   
    formData.append("email", this.form.value.email);
    formData.append("password", this.form.value.password);

    let params = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.dataService.login(params).subscribe(res =>{
      this.data = res;
      if (this.data.status === 400) {
          this.toastr.error('Unauthorized request found', 'Error!', { timeOut: 3000 });
          return;
      } else if (this.data.status === 401) {
          this.toastr.error('Invalid Email Or Password', 'Error!', { timeOut: 3000 });
          return;
      } else if (this.data.status === 409) {
          this.toastr.error('Invalid Email Or Password', 'Error!', { timeOut: 3000 });
          return;
      }
      
      this.token = this.data.data.token;
      this.type = this.data.data.type;
      localStorage.setItem('token', this.token);
      localStorage.setItem('tms_user', this.type);
      this.toastr.success(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
        timeOut: 2000,
        progressBar: true
      });
      this.router.navigate(['']);
      // this.router.navigate(['/projects']);
      // if(this.data.status === 1){
          
        // this.toastr.success(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
        //   timeOut: 2000,
        //   progressBar: true
        // });
      // }else if (this.data.status === 0){
      //   this.toastr.error(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
      //     timeOut: 2000,
      //     progressBar: true
      //   });
        
      // }
      
      // }
      
    });
  }
}
