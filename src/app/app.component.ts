import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./sharedComponents/nav-bar/nav-bar.component";
import { FooterComponent } from './sharedComponents/footer/footer.component';
import { WeathemodalComponent } from "./components/weathemodal/weathemodal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nutriTrack';
}
