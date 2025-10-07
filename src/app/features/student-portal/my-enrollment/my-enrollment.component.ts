import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Enrollment {
  id: string;
  courseName: string;
  courseCode: string;
  status: 'active' | 'pending' | 'suspended' | 'completed';
  duration: string;
  startDate: string;
  endDate: string;
  completionDate?: string;
  instructor: string;
  fee: string;
  progress: number;
  currentGrade?: string;
  finalGrade?: string;
  grades: Array<{
    assignment: string;
    score: string;
  }>;
}

@Component({
  selector: 'app-my-enrollment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-enrollment.component.html',
  styleUrls: ['./my-enrollment.component.scss']
})
export class MyEnrollmentComponent implements OnInit {
  currentEnrollments: Enrollment[] = [
    {
      id: '1',
      courseName: 'Business Management',
      courseCode: 'BM-2024-001',
      status: 'active',
      duration: '12 months',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      instructor: 'Dr. Sarah Johnson',
      fee: 'R25,000',
      progress: 65,
      currentGrade: 'B+',
      grades: [
        { assignment: 'Mid-term Exam', score: '85%' },
        { assignment: 'Business Plan', score: '78%' },
        { assignment: 'Case Study', score: '92%' },
        { assignment: 'Group Project', score: '88%' }
      ]
    },
    {
      id: '2',
      courseName: 'Digital Marketing',
      courseCode: 'DM-2024-002',
      status: 'active',
      duration: '6 months',
      startDate: '2024-02-01',
      endDate: '2024-07-01',
      instructor: 'Ms. Lisa Chen',
      fee: 'R15,000',
      progress: 45,
      currentGrade: 'A-',
      grades: [
        { assignment: 'SEO Project', score: '90%' },
        { assignment: 'Social Media Campaign', score: '85%' },
        { assignment: 'Analytics Report', score: '88%' }
      ]
    }
  ];

  completedEnrollments: Enrollment[] = [
    {
      id: '3',
      courseName: 'Introduction to Programming',
      courseCode: 'IP-2023-001',
      status: 'completed',
      duration: '3 months',
      startDate: '2023-09-01',
      endDate: '2023-11-30',
      completionDate: '2023-11-30',
      instructor: 'Mr. David Wilson',
      fee: 'R12,000',
      progress: 100,
      finalGrade: 'A',
      grades: [
        { assignment: 'Final Project', score: '95%' },
        { assignment: 'Mid-term Exam', score: '88%' },
        { assignment: 'Weekly Assignments', score: '92%' }
      ]
    },
    {
      id: '4',
      courseName: 'Project Management Fundamentals',
      courseCode: 'PM-2023-002',
      status: 'completed',
      duration: '4 months',
      startDate: '2023-06-01',
      endDate: '2023-09-30',
      completionDate: '2023-09-30',
      instructor: 'Dr. Michael Brown',
      fee: 'R18,000',
      progress: 100,
      finalGrade: 'B+',
      grades: [
        { assignment: 'Final Project', score: '82%' },
        { assignment: 'Case Study', score: '85%' },
        { assignment: 'Presentation', score: '88%' }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize enrollment data
  }

  getGradeClass(grade: string): string {
    if (!grade) return '';
    
    const gradeValue = grade.charAt(0);
    switch (gradeValue) {
      case 'A':
        return 'excellent';
      case 'B':
        return 'good';
      case 'C':
        return 'average';
      default:
        return 'poor';
    }
  }

  applyForNewCourse(): void {
    this.router.navigate(['/student-portal/course-application']);
  }

  viewCourseDetails(enrollment: Enrollment): void {
    // Navigate to course details page or open modal
    console.log('View course details:', enrollment);
  }

  accessCourse(enrollment: Enrollment): void {
    // Navigate to course content or learning management system
    console.log('Access course:', enrollment);
  }

  downloadCertificate(enrollment: Enrollment): void {
    // Handle certificate download
    console.log('Download certificate for:', enrollment.courseName);
    // In a real application, this would trigger a file download
  }

  viewTranscript(enrollment: Enrollment): void {
    // Navigate to transcript view or open modal
    console.log('View transcript for:', enrollment.courseName);
  }
}