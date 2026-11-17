import { AfterViewInit, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Job, JobDraft, POSITIONS, STATUSES, StatusId } from '../../models/job';

@Component({
  selector: 'app-job-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form-dialog.html',
  styleUrl: './job-form-dialog.scss',
})
export class JobFormDialog implements AfterViewInit {
  /** The application to edit, or null to add a new one. */
  readonly job = input<Job | null>(null);

  readonly saved = output<JobDraft>();
  readonly deleted = output<void>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly statuses = STATUSES;
  protected readonly positions = POSITIONS;

  protected readonly form = inject(NonNullableFormBuilder).group({
    title: ['', [Validators.required, notBlank]],
    company: ['', [Validators.required, notBlank]],
    position: [''],
    location: [''],
    salary: [''],
    date: [today(), Validators.required],
    contact: [''],
    url: [''],
    notes: [''],
    status: ['applied' as StatusId],
  });

  ngAfterViewInit(): void {
    const job = this.job();
    if (job) this.form.patchValue(job);
    this.dialog().nativeElement.showModal();
  }

  protected pickStatus(id: StatusId): void {
    this.form.controls.status.setValue(id);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({ ...value, title: value.title.trim(), company: value.company.trim() });
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }
}

function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() ? null : { blank: true };
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
