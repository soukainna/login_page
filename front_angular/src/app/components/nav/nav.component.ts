import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/serices/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  auth = false
  
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user().subscribe(
      {
        next: (res: any)=> {
          this.auth = true
        },
        error: err =>{
         this.auth = false
          
        }
      }
    )
  }

  logout(){
    this.authService.logout().subscribe(() => {
      this.authService.accessToken = '';
    })
  }

}
