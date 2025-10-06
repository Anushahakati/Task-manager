import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task, TaskService } from '../../../core/services/task.service';
import { MatInputModule } from "@angular/material/input";
import { MaterialModule } from "../../../material.module";

function futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value && new Date(control.value) < new Date()) return { pastDate: true };
  return null;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  imports: [MatInputModule, MaterialModule]
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode: boolean;
  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['Pending', 'In Progress', 'Completed'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || ''],
      dueDate: [this.data?.dueDate || '', [Validators.required, futureDateValidator]],
      priority: [this.data?.priority || 'Medium', Validators.required],
      status: [this.data?.status || 'Pending', Validators.required]
    });
  }

  onSave(): void {
    if (this.taskForm.invalid) return;

    const request = this.isEditMode
      ? this.taskService.updateTask(this.data._id!, this.taskForm.value)
      : this.taskService.addTask(this.taskForm.value);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode ? 'Task updated successfully' : 'Task added successfully',
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: err => this.snackBar.open(err.error?.message || 'An error occurred', 'Close', { duration: 3000 })
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
