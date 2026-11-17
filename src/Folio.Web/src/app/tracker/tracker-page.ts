import { Component, inject, signal } from '@angular/core';
import { Job, JobDraft } from '../models/job';
import { JobStore } from '../services/job-store';
import { ApplicationList } from './application-list/application-list';
import { JobFormDialog } from './job-form-dialog/job-form-dialog';
import { OverviewPanel } from './overview-panel/overview-panel';

/** null editing = adding a new application. */
interface FormState {
  editing: Job | null;
}

@Component({
  selector: 'app-tracker-page',
  imports: [ApplicationList, OverviewPanel, JobFormDialog],
  templateUrl: './tracker-page.html',
  styleUrl: './tracker-page.scss',
})
export class TrackerPage {
  private readonly store = inject(JobStore);

  protected readonly formState = signal<FormState | null>(null);

  protected openNew(): void {
    this.formState.set({ editing: null });
  }

  protected openEdit(job: Job): void {
    this.formState.set({ editing: job });
  }

  protected save(draft: JobDraft): void {
    const editing = this.formState()?.editing;
    if (editing) this.store.update({ ...draft, id: editing.id });
    else this.store.add(draft);
    this.formState.set(null);
  }

  protected remove(): void {
    const editing = this.formState()?.editing;
    if (editing) this.store.remove(editing.id);
    this.formState.set(null);
  }
}
