import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../interfaces/message';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule], // Importamos ReactiveFormsModule aquí
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient // Asegúrate de tener HttpClient si lo necesitas para enviar peticiones
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
   }

  contactForm: FormGroup;


  ngOnInit(): void {
    // Inicializamos el formulario reactivo
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.contactForm.valid) {
      // Confirmación antes de enviar
      const confirmSubmit = window.confirm('Are you sure you want to send this message?');
      
      if (confirmSubmit) {
        const { name, email, message } = this.contactForm.value;
        const userId = localStorage.getItem('userToken') || undefined;  // Obtenemos el token de usuario

        const messageData: Message = {
          email,
          message,
          userId,
        };

        // Llamamos al servicio para enviar el mensaje
        this.messageService.postMessage(messageData).subscribe({
          next: ()=>{
            console.log('Message sent successfully');
            // Puedes agregar lógica para mostrar un mensaje de éxito al usuario
            alert('Your message has been sent successfully!');
            // Resetear el formulario 
            this.contactForm.reset();
          },
          error: ()=>{
            console.error('Error sending message:');
          // Agregar lógica de manejo de error
            alert('Sorry, there was an error sending your message. Please try again.');
          }
        })
      } else {
        // Si el usuario cancela el envío
        console.log('Message submission canceled');
      }
    }
  }
}
