import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})


export class TaskDetailsComponent implements OnInit  {
  loading: boolean = false;
  sending: boolean = false;
  public form: any;
  task: any;
  id: any;
  file_id: any;
  drpUserList!: FormGroup;
  myform!: FormGroup;
  myformContent!: FormGroup;
  endDate: any;
  created_by: any;
  status: any;
  description: any;
  assign_ids: any[] = [];
  last_name: any;
  first_name: any;
  modalRef?: BsModalRef;
  UserList: any[] = [];
  TaskList: any;
  ts: any;
  data: any;
  user_ids: any[] = [];

  CheckIds = null;
  comment_box = null;
  commentform!: FormGroup;
  commentList: any;
  fileExtension:any;
  uploadform!: FormGroup;
  files: any;
  file: any;
  taskttachment: any;
  imageList: any;
  name:any;

  disabled = false;
  ShowFilter = false;
  limitSelection = false;

  iconList = [ // array of icon class list based on type
  { type: "xlsx", icon: "fa fa-file-excel-o" },
  { type: "pdf", icon: "fa fa-file-pdf-o" },
  { type: "jpg", icon: "fa fa-file-image-o" }
];
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

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private formbuilder: FormBuilder
  ) {}

  createForm() {
    this.form = this.formbuilder.group({
      file: [null],
      task_id: [null],
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.createForm();
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('tdetails_id'));

    console.log(this.id);

    this.form = {
      user_ids: this.assign_ids,
      date: this.validateDateTimeFormat(new Date()),
      task_id: this.id,
    };

    this.commentform = new FormGroup({
      task_id: new FormControl(this.id),
      // user_ids: new FormControl(this.assign_ids),
      comment_box: new FormControl(),
      date: new FormControl(this.validateDateTimeFormat(new Date())),
    });

    this.uploadform = new FormGroup({
      file: new FormControl(),
    });

    this.dataService.userList().subscribe((data: any) => {
      this.UserList = data.data.map((val: any) => {
        return { id: val.id, text: val.last_name ,imageUrl: 'http://localhost:8000/profile/' + val.image,};
      });
      console.log(this.UserList);
    });

    this.get_taskDetails();
    this.get_image();
    this.get_commentList();
  }

  get_taskDetails() {
    this.dataService.task_details(this.id).subscribe((res: any) => {
      this.task = res;
      console.log(this.task);

      this.name=this.task.data.name;
      this.endDate = this.task.data.end_date;
      this.created_by = this.task.data.user.name;
      this.status = this.task.data.status;
      this.description = this.task.data.description;
      this.assign_ids = this.task.data.task_assign.map(
        (assign: any) => assign.user
      );
      this.last_name = this.task.data.user.last_name;
      this.first_name = this.task.data.user.first_name;

      this.myform = new FormGroup({
        end_date: new FormControl(this.task.data.end_date),
        created_by: new FormControl(this.task.data.created_by),
      });
    });
  }

  get_image() {
    this.dataService.task_for_images(this.id).subscribe(
      (data: any) => {
        this.imageList = data.data;
        console.log(data);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  get_commentList() {
    this.dataService.task_for_comments(this.id).subscribe((data: any) => {
      this.commentList = data.data;
      console.log(data);
    });
  }

  onSubmit(): void {
    console.log(this.CheckIds);
    this.form.user_ids = this.CheckIds;
    console.log(this.form);
    this.dataService.assign_task(this.form).subscribe((res) => {
      this.data = res;
      this.get_taskDetails();
      this.modalService.hide();
    });
  }

  validateDateTimeFormat(value: Date) {
    return moment(value).format('YYYY-MM-DD');
  }

  create_comment(): void {
    // this.commentform.comment_box = this.comment_box;

    // this.commentform.value.assign_id = this.task.data.task_assign.map(
    //   (assign: any) => assign.user
    // );

    /////
    // console.log(this.UserList);

    // let user_ids: any = [];

    // this.UserList.forEach((user) => {
    //   //console.log(user)
    //   user_ids.push(user.id);
    // });

    // //console.log(user_ids);

    // this.commentform.patchValue({
    //   user_ids: user_ids,
    // });

    // this.last_name = this.task.data.user.last_name;
    // this.first_name = this.task.data.user.first_name;

    this.sending = true;

    console.log(this.commentform.getRawValue());
    this.dataService.create_a_comment(this.commentform.getRawValue()).subscribe(
      (res) => {
        this.data = res;
        this.get_commentList();
        // this.commentform.reset();
        this.commentform.get('comment_box')?.setValue('');
      }
    );

    setTimeout(() => {
      this.sending = false;
    }, 2000);
  }

  create_file(): void {
    this.loading = true;

    const formData = new FormData();
    formData.append('file', this.files, this.files.name);
    formData.append('task_id', this.id);

    // console.log(this.uploadform.getRawValue());
    this.dataService.upload_a_image(formData).subscribe((res) => {
      this.data = res;
      console.log(this.data);
      this.get_image();
      this.uploadform.reset();
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  imageUpload(event: any) {
    // console.log('logs: ', event.target.files);
    this.files = event.target.files[0];
    console.log(this.files);
  }

  openImageWindow(imageUrl: string) {
    window.open(imageUrl, '_blank', 'height=600,width=800');
  }

  delete_a_comment(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.delete_a_comment(id).subscribe((res) => {
          this.data = res;
          Swal.fire('Deleted!', 'Comment Deleted', 'success');
          this.get_commentList();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'Not deleted', 'error');
      }
    });
  }

  delete_a_file(file_id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.delete_a_file(file_id).subscribe((res) => {
          this.data = res;
          Swal.fire('Deleted!', 'Image deleted', 'success');
          this.get_image();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'Not deleted', 'error');
      }
    });
  }

  // getFileDetails() {
  //   // Example file object with extension
  //   this.file = {
  //     name: 'example.txt',
  //     fileExtension: 'txt'
  //   };
  // }
  // getIconClass(fileExtension: a): string {
  //   // Define your mapping of file extensions to icon classes
  //   const iconClasses = {
  //     txt: 'fa fa-file-text-o', // Example icon classes, modify based on your chosen icon library
  //     pdf: 'fa fa-file-pdf-o',
  //     doc: 'fa fa-file-word-o',
  //     // Add more mappings as needed
  //   };

  //   // Get the icon class based on the file extension
  //   const iconClass = iconClasses[fileExtension] || 'fa fa-file-o'; // Default icon class

  //   return iconClass;
  // }
}

