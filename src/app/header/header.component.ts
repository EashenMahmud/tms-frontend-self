import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  @Input() collapsed = false;
  @Input() screenWidth = 0; 
  // myform!: FormGroup;
  data: any;
  user:any;
  first_name:any;
  image:any;
  project:any;
  // selectedItem: string;
  selectedItem:any;
  // data:any;
form:any;


  constructor(private dataService: DataService, private router: Router){
    
  }
  

  selectMenuItem(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.router.navigateByUrl(selectedValue);
    }
  }

  ngOnInit(): void {
    this.dataService.getProfile().subscribe((res: any) => {
      this.user = res;
      this.first_name=this.user.data[0].first_name;
      this.image=this.user.data[0].image;
      // console.log(this.image);
      // console.log(this.user);
    });
  }
  onSubmit(){
   
    Swal.fire({
      title:'are you sure',
      text: 'Logout',
      icon: 'warning',
      showCancelButton:true,
      confirmButtonText:'yes',
      cancelButtonText:'no'
    }).then((result)=>{
      if(result.isConfirmed){
        this.dataService.logOut(this.form).subscribe(res=>{
          this.data = res; 
          localStorage.removeItem('token');
          this.router.navigate(['/login']);

          Swal.fire(
            'Logout!',
            'user logout',
            'success',
           )
           
        })
        
        }
    })
  }

  

  
  getHeadClass(): string{
    let styeClass = '';
    if(this.collapsed && this.screenWidth> 768){
      styeClass = 'head-trimed';
    }else{
      styeClass = 'head-md-screen';
    }
    return styeClass;
  }



}
