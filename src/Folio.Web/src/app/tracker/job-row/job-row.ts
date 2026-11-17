import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Job, statusById } from '../../models/job';

@Component({
  selector: 'app-job-row',
  imports: [DatePipe],
  templateUrl: './job-row.html',
  styleUrl: './job-row.scss',
  host: { '[class.expanded]': 'expanded()' },
})
export class JobRow {
  readonly job = input.required<Job>();
  readonly expanded = input(false);

  readonly toggle = output<void>();
  readonly edit = output<Job>();

  protected readonly status = computed(() => statusById(this.job().status));

  protected readonly meta = computed(() => {
    const { position, location, salary, contact } = this.job();
    return [position, location, salary, contact && `Contact · ${contact}`].filter(Boolean).join('  ·  ');
  });
}
