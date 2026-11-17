import { Component, computed, inject, output, signal } from '@angular/core';
import { Job, STATUSES, StatusId } from '../../models/job';
import { JobStore } from '../../services/job-store';
import { JobRow } from '../job-row/job-row';

type Filter = StatusId | 'all';

@Component({
  selector: 'app-application-list',
  imports: [JobRow],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss',
})
export class ApplicationList {
  private readonly store = inject(JobStore);

  readonly edit = output<Job>();

  protected readonly filter = signal<Filter>('all');
  protected readonly openRowId = signal<string | null>(null);

  protected readonly tabs = computed(() => {
    const counts = this.store.counts();
    return [
      { id: 'all' as Filter, label: 'All', count: this.store.total(), color: null },
      ...STATUSES.map(s => ({ id: s.id as Filter, label: s.label, count: counts[s.id], color: s.color })),
    ];
  });

  protected readonly jobs = computed(() => {
    const filter = this.filter();
    const jobs = this.store.byDate();
    return filter === 'all' ? jobs : jobs.filter(j => j.status === filter);
  });

  protected toggleRow(id: string): void {
    this.openRowId.update(current => (current === id ? null : id));
  }
}
