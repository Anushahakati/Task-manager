import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// Custom Validator: Checks if the selected date is in the past.
export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { pastDate: true };
  }
  return null;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './task-dialog.component.html'
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup; // Will be initialized in ngOnInit
  isEditMode: boolean;
  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['To Do', 'In Progress', 'Done'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data?.isEditMode || false;
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.data?.task?.title || '', Validators.required],
      description: [this.data?.task?.description || ''],
      dueDate: [this.data?.task?.dueDate || '', [Validators.required, futureDateValidator]],
      priority: [this.data?.task?.priority || 'Medium', Validators.required],
      status: [this.data?.task?.status || 'To Do', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.taskForm?.valid) {
      this.dialogRef?.close(this.taskForm.value);
    }
  }
}
