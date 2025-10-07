import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './student-portal.component.html',
  styleUrls: ['./student-portal.component.scss']
})
export class StudentPortalComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Initialize student portal
  }
}