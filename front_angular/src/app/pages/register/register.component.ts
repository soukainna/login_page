import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { enableDebugTools } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/serices/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  file: any
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      avatar: '',
    })
  }

  getFile(event: any){
    this.file = event.target.files[0];
    console.log('file', this.file)
  }

   submit() {
    // this.http.post('http://localhost:8000/api/register', this.form.getRawValue()).subscribe(
    //   () => this.router.navigate(['/login'])
    // )
     
    this.authService.register(this.form.getRawValue()).subscribe(
      () => this.router.navigate(['/login'])
    )
    console.log(this.form)
   }
}
