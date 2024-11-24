import { Component } from '@angular/core';
import { RegisterComponent } from '../../components/user/register/register.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

}

