import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface DeleteDialogData {
  message: string;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false); // return false
  }

  onDelete(): void {
    this.dialogRef.close(true); // return true
  }
}
