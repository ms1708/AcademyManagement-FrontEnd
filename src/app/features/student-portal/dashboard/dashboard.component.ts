import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Course {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  startDate: string;
  endDate: string;
  instructor: string;
}

interface Activity {
  type: 'assignment' | 'completed' | 'grade' | 'announcement';
  title: string;
  description: string;
  time: string;
}

interface Event {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = 'Thandi';
  completedCourses = 2;
  totalFeesPaid = 45000;
  currentGPA = 3.8;
  attendanceRate = 92;

  currentCourse: Course = {
    name: 'Business Management',
    description: 'Comprehensive business management course covering leadership, strategy, and operations.',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    instructor: 'Dr. Sarah Johnson'
  };

  recentActivities: Activity[] = [
    {
      type: 'assignment',
      title: 'Assignment Submitted',
      description: 'Business Strategy Analysis assignment submitted successfully',
      time: '2 hours ago'
    },
    {
      type: 'grade',
      title: 'Grade Received',
      description: 'Marketing Fundamentals - Grade: A-',
      time: '1 day ago'
    },
    {
      type: 'announcement',
      title: 'New Announcement',
      description: 'Mid-term exam schedule has been updated',
      time: '2 days ago'
    },
    {
      type: 'completed',
      title: 'Module Completed',
      description: 'Financial Management module completed',
      time: '3 days ago'
    }
  ];

  upcomingEvents: Event[] = [
    {
      day: '15',
      month: 'Jan',
      title: 'Mid-term Exam',
      time: '09:00 AM',
      location: 'Room 201'
    },
    {
      day: '18',
      month: 'Jan',
      title: 'Group Presentation',
      time: '02:00 PM',
      location: 'Conference Room A'
    },
    {
      day: '22',
      month: 'Jan',
      title: 'Guest Lecture',
      time: '10:00 AM',
      location: 'Main Auditorium'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize dashboard data
  }

  viewCourse(): void {
    // Navigate to course details or open course modal
    console.log('View course clicked');
  }

  viewSchedule(): void {
    // Navigate to schedule or open schedule modal
    console.log('View schedule clicked');
  }
}