import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    contactForm!: FormGroup;

    constructor(private fb: FormBuilder, private http: HttpClient) { }

    ngOnInit(): void {
        this.contactForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    handleError = (error: HttpErrorResponse) => {
        // Show error message to the user
        Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    sendEmail() {
        if (this.contactForm.valid) {
            const formData = this.contactForm.value;

            // Optional: Set headers if needed
            const headers = { 'Content-Type': 'application/json' };

            this.http.post('https://srv667884.hstgr.cloud:9090/mailing/send-email', formData, { headers })
                .pipe(
                    catchError(this.handleError)
                )
                .subscribe(
                    response => {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Your message has been sent successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        // this.contactForm.reset(); // Optionally reset the form after successful submission
                    },
                    (error: HttpErrorResponse) => {
                        console.error('Error sending email:', error.message);
                        // Error handling is managed by handleError method
                    }
                );
        } else {
            Swal.fire({
                title: 'Invalid Form!',
                text: 'Please fill out all required fields correctly.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }

    get email() {
        return this.contactForm.get('email');
    }

    get subject() {
        return this.contactForm.get('subject');
    }

    get message() {
        return this.contactForm.get('message');
    }
}