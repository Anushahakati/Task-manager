import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

// --- ADDED IMPORTS FOR DATEPICKER ---
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// ------------------------------------

import { TaskService } from '../core/services/task.service';

// --- In-file TaskDialogComponent to resolve the import error ---
@Component({
  selector: 'app-task-dialog',
  template: `
    <h1 mat-dialog-title class="text-xl font-semibold">{{ data.isEditMode ? 'Edit Task' : 'Add New Task' }}</h1>
    <div mat-dialog-content class="mt-4">
      <mat-form-field class="w-full">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="taskData.title" required cdkFocusInitial>
      </mat-form-field>
      <mat-form-field class="w-full mt-4">
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="taskData.description"></textarea>
      </mat-form-field>
      <mat-form-field class="w-full mt-4">
        <mat-label>Due Date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="taskData.dueDate">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end" class="mt-6">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="taskData" [disabled]="!taskData.title">
        {{ data.isEditMode ? 'Save Changes' : 'Create Task' }}
      </button>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule
  ]
})
export class TaskDialogComponent implements OnInit {
  taskData: any = { title: '', description: '', dueDate: null };

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.isEditMode && this.data.task) {
      // Clone the task object to avoid modifying the original object directly in the dialog
      this.taskData = { ...this.data.task };
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    DatePipe,

    // --- MODULES FOR DATEPICKER ---
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => { this.tasks = data; },
      error: (err: any) => console.error('Failed to load tasks', err)
    });
  }

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '450px',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.createTask(result).subscribe({
          next: () => this.loadTasks(),
          error: (err: any) => console.error('Failed to create task', err)
        });
      }
    });
  }

  openEditDialog(task: any): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '450px',
      data: { isEditMode: true, task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task.id, result).subscribe({
          next: () => this.loadTasks(),
          error: (err: any) => console.error('Failed to update task', err)
        });
      }
    });
  }

  deleteTask(taskId: string): void {
    // Note: confirm() can have usability issues.
    // Consider a custom Material dialog for confirmation in a real app.
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(),
        error: (err: any) => console.error('Failed to delete task', err)
      });
    }
  }
}

