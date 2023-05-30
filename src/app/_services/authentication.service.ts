import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    isAuthincate: boolean = false;
    public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public currentUser: Observable<any>;
  data: any;
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router
    ) {

        if (Cookie.check('.BBINAEW.Cookie'))
        this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.BBINAEW.Cookie')));
        // this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        // this.getUserRole();
    }

    public get currentUserValue(): any {
        return Cookie.check('.BBINAEW.Cookie') ? this.currentUserDetails.value : null;
    }

    public isAuthenticated(): boolean {
        return Cookie.check('.BBINAEW.Cookie');
    }

    login(params: any, role: string) {
        const obj = {
            email: params.email,
            password: params.password
        };
        document.cookie = `role=${role}`;

        return this.http.post<any>(environment.apiUrl + 'auth/login', obj).pipe(map(data => {
            if(data.status){
                let response = data.data;
                const user = {
                    email: response.email,
                    contact_no: response.contact_no,
                    employee_code: response.employee_code,
                    full_name: response.name,
                    type: response.type,
                    access_token: response.token,
                    image: response.image,
                    created: response.updated_at,
                }
                let expireDate = new Date('2030-07-19');
                Cookie.set('.BBINAEW.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
                this.currentUserDetails.next(user);
                const res = {
                    data: user,
                    errors: null,
                    message: "",
                    status: true
                };
                return res;
            }else{
                const res = {
                    data: [],
                    errors: null,
                    message: data.message,
                    status: false
                };
                return res;
            }
        }),
        catchError(err => {
            //console.log(err);
            //return err;
            return of(err);
        }));
    }

    logout(hostname: any) {
        return this.http.post<any>(environment.apiUrl + 'logout', {}).pipe(
            map(res => {
                if (res.success) {
                    this.isAuthincate = false;
                    Cookie.delete('.BBINAEW.Cookie', '/', hostname);
                    this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                    this.currentUserDetails.next(null);
                    this.router.navigate(['/login']);
                }
                return res;
            })
        );

    }

    registerSystemAdmin(url: any, params: any) {
        return this.http.post<any>(environment.apiUrl + url, params).pipe(
            map(res => {
                return res;
            })
        );
    }

    // getUserRole(){
        
    //     // this.currentUser = this.currentUserDetails.asObservable();
    // }

    // hasRole(role: string): boolean {
    //     const cookies = document.cookie.split(';');
    //     for (let i = 0; i < cookies.length; i++) {
    //       const cookie = cookies[i].trim();
    //       if (cookie.startsWith('role=')) {
    //         const userRole = cookie.substring(5);
    //         return userRole === role;
    //       }
    //     }
    //     return false;
    //   }

      
    //   isLoggedIn(): boolean {
    //     const cookies = document.cookie.split(';');
    //     for (let i = 0; i < cookies.length; i++) {
    //       const cookie = cookies[i].trim();
    //       if (cookie.startsWith('role=')) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   }
}
