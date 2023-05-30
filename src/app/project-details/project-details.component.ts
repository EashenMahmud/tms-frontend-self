import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  // datePipeString : string;
id:any;
data:any;
project:any;
TaskList:any;
task:any;
modalRef?: BsModalRef;
error:any;
submitted = false;
endDate: any;
  created_by: any;
  supervisor:any;
  status: any;
  emp:any;
  name:any;
  client_id:any;
  description: any;
  remarks:any;
  assign_ids: any[] = [];
  last_name: any;
  first_name: any;
myform!: FormGroup;
myformContent!: FormGroup;
CheckIds = null;
public form: any;
public userList: any[] = [];
onItemSelect:any;
imageList:any;
dropdownSettings: IDropdownSettings = {
  singleSelection: false,
  defaultOpen: true,
  idField: 'id',
  textField: 'text',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  enableCheckAll: true,
  itemsShowLimit: 3,
  allowSearchFilter: true,
};
constructor(private route: ActivatedRoute,private dataService: DataService,private modalService: BsModalService,
  private router: Router,private toastr:ToastrService, private fb: FormBuilder, ){
    
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {
    this.getTask();
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('pdetails_id'));
    // console.log(this.id);
    this.form = {
       user_ids:this.assign_ids,
       date:this.validateDateTimeFormat(new Date()),
       project_id:this.id
    };

  //   this.dataService. detailsProject(this.id).subscribe(
  //   (res:any) => {
  //   this.project = res;
  //   this.client_id=this.client_id;
  //   this.name=this.project.data.name;
  //   this.endDate = this.project.data.end_date;
  //   this.supervisor = this.project.data.supervisor;
  //   this.remarks = this.project.data.remarks;
  //   this.client_id = this.project.data.client_id;
  //     this.created_by = this.project.data.user.name;
  //     this.status = this.project.data.status;
  //     this.description = this.project.data.description;
  //     this.assign_ids = this.project.data.project_assign.map(
  //       (assign: any) => assign.user
  //     );
  //     this.last_name = this.project.data.user.last_name;
  //     this.first_name = this.project.data.user.first_name;
  //     this.myformContent = new FormGroup({
  //       end_date: new FormControl(this.project.data.end_date),
  //       created_by: new FormControl(this.project.data.created_by),
  //     });
      
  // }); 

  this.dataService.userList().subscribe((data: any) => {
    this.userList = data.data.map((val: any) => {
      return { id: val.id, text: val.last_name,imageUrl: 'http://localhost:8000/profile/' + val.image, };
    });
    // console.log(this.userList);
  });
  this.getTaskList();
}
// navigateToProject(id: number) {
//   this.router.navigate(['/projectDetails', id]);
// }
getTaskList(){
  this.dataService.taskList(this.id).subscribe((data: any) => {
    this.TaskList = data.data.task.reverse();
    console.log(this.TaskList);
    this.getTask();
  });
}

userImages(){
  this.dataService.taskUserImage(this.id).subscribe((data: any)=>{
    this.imageList = data.data;
    console.log(this.data);
  });
}

// get_taskDetails() {
//     this.dataService.task_details(this.id).subscribe((res: any) => {
//       this.task = res;
//       // console.log(this.task);

//       this.endDate = this.task.data.end_date;
//       this.created_by = this.task.data.user.name;
//       this.status = this.task.data.status;
//       this.description = this.task.data.description;
//       this.assign_ids = this.task.data.task_assign.map(
//         (assign: any) => assign.user
//       );
//       this.last_name = this.task.data.user.last_name;
//       this.first_name = this.task.data.user.first_name;

//       this.myform = new FormGroup({
//         end_date: new FormControl(this.task.data.end_date),
//         created_by: new FormControl(this.task.data.created_by),
//       });
//     });
//   }
//   get_image() {
//     this.dataService.task_for_images(this.id).subscribe(
//       (data: any) => {
//         this.imageList = data.data;
//         console.log(data);
//       },
//       (error: any) => {
//         console.error(error);
//       }
//     );
//   }


// getImagesuser() {
//   this.dataService.taskUserImage(this.id).subscribe((data: any) => {
//     this.imageList = data.data;
//     console.log(data);
//   });
// }
getTask(){
  
  this.dataService. detailsProject(this.id).subscribe(
    (res:any) => {
    this.project = res;
    this.client_id=this.client_id;
    this.name=this.project.data.name;
    this.endDate = this.project.data.end_date;
    this.supervisor = this.project.data.supervisor;
    this.remarks = this.project.data.remarks;
    this.client_id = this.project.data.client_id;
      this.created_by = this.project.data.user.name;
      this.status = this.project.data.status;
      this.description = this.project.data.description;
      this.assign_ids = this.project.data.project_assign.map(
        (assign: any) => assign.user
      );
      this.last_name = this.project.data.user.last_name;
      this.first_name = this.project.data.user.first_name;
      this.myformContent = new FormGroup({
        end_date: new FormControl(this.project.data.end_date),
        created_by: new FormControl(this.project.data.created_by),
      });
      
  }); 
}
onSubmit(): void {
  
  console.log(this.CheckIds);
  this.form.user_ids = this.CheckIds;
  console.log(this.form);
  this.dataService.projectAssigned(this.form).subscribe((res) => {
  this.data = res;
  this.getTask();
  this.modalService.hide();

  });
}
on_Submit():void{
  this.dataService.createTask(this.form).subscribe((res) => {
    this.data = res;
    this.getTaskList();
    this.modalService.hide();
    
    this.toastr.success(JSON.stringify(this.data.message),JSON.stringify(this.data.code),{
      timeOut: 2000,
      progressBar: true
    });

  }, err =>{
    console.log(err)

    this.toastr.error(err.error.message, err.error.message,{
      timeOut: 2000,
      progressBar: true
    });


  }
  );
}
validateDateTimeFormat(value: Date) {
  return moment(value).format('YYYY-MM-DD');
}
}

