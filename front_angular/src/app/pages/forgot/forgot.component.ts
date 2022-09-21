import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/serices/auth.service';
import { ForgotService } from 'src/app/serices/forgot.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  form!: FormGroup;
  cls = '';
  message = ''

  constructor(
    private formBuilder: FormBuilder,
    private forgotService: ForgotService
    ) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
    })
  }



   submit() {
     
    this.forgotService.forgot(this.form.getRawValue()).subscribe(
    {
      next:()=> {
        this.cls = "success",
        this.message = 'Email was sent!'
      },
      error:() => {
        this.cls = "danger",
        this.message = 'Error to send email'
      }
    }
    )
    console.log(this.form)
   }

}
