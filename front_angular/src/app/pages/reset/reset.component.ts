import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ForgotService } from 'src/app/serices/forgot.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  form!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private forgotService: ForgotService,
    private route : ActivatedRoute,
    private router : Router
    ) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      
    
      password: '',
      password_confirm: '',
     
    })
  }

   submit() {
    const formData = this.form.getRawValue();
    const data = {
      ...formData,
      token: this.route.snapshot.params['token']
    }
    this.forgotService.reset(data).subscribe( () => {
      this.router.navigate(['/login'])
    })
  
   }
}
