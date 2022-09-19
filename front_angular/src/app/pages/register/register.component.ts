import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      avatar: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirm: '',
    })
  }

}
