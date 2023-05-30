import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import { HeaderComponent } from './header/header.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import{FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchPipe } from './search.pipe';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { FilterPipe } from './projects/filter.pipe';
import { DatePipe } from '@angular/common';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { UserProjectsComponent } from './user-projects/user-projects.component';
// import { TaskComponent } from './task/task.component';



@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    HeaderComponent,
    ProjectsComponent,
    TasksComponent,
    EmployeeComponent,
    ProfileComponent,
    LogoutComponent,
    LoginComponent,
    RegisterComponent,
    ProjectEditComponent,
    ProjectDetailsComponent,
    SearchPipe,
    TaskDetailsComponent,
    FilterPipe,
    UserProjectsComponent,
    
    
    
    // TaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgbDatepickerModule,
    NgxPaginationModule,
    SweetAlert2Module.forRoot(),
    NgMultiSelectDropDownModule,
    NgSelectModule,
    DatePipe,
    
    

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
