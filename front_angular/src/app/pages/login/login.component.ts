import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/serices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
    })
  }
   submit() {
    // this.http.post('http://localhost:8000/api/register', this.form.getRawValue()).subscribe(
    //   () => this.router.navigate(['/login'])
    // )

    this.authService.login(this.form.getRawValue()).subscribe(
      (res : any) => {
        this.authService.accessToken = res.token;
        this.router.navigate(['/'])}
    )
   }
}

