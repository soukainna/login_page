import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/serices/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message = ''
  img = ''
  body = ''
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user().subscribe(
      {
        next: (res: any)=> {
          this.message = ` Hello ${res.first_name} ${res.last_name}`;
          this.body = `ipsum dolor sit amet, consectetur adipisicing elit. Vel aliquam provident iusto sequi numquam corrupti culpa quibusdam voluptate dolore quia amet, accusamus molestias excepturi aliquid nihil tenetur unde, repudiandae voluptas!`
          this.img = `${res.avatar}`
          AuthService.authEmitter.emit(true)
        },
        error: err =>{
         this.message = 'you are not authentificated'
         AuthService.authEmitter.emit(false)
        }
      }
    )
  }

}
