import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

   // Control visibility of the "How to register" video
   showRegisterVideo: boolean = false;

   // Toggle the visibility of the video
   toggleVideo(videoType: string): void {
     if (videoType === 'register') {
       this.showRegisterVideo = !this.showRegisterVideo;
     }
   }

}
