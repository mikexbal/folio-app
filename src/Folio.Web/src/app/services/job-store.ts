import { Injectable, computed, signal } from '@angular/core';
import { Job, JobDraft, STATUSES, StatusId } from '../models/job';

const STORAGE_KEY = 'folio.jobs.v1';

/**
 * Holds the tracked applications. Persists to localStorage for now;
 * swap load/persist for HTTP calls once Folio.Api has a jobs endpoint.
 */
@Injectable({ providedIn: 'root' })
export class JobStore {
  private readonly _jobs = signal<Job[]>(this.load());

  readonly jobs = this._jobs.asReadonly();

  /** Newest first. */
  readonly byDate = computed(() => [...this._jobs()].sort((a, b) => b.date.localeCompare(a.date)));

  readonly total = computed(() => this._jobs().length);

  readonly counts = computed(() => {
    const counts = Object.fromEntries(STATUSES.map(s => [s.id, 0])) as Record<StatusId, number>;
    for (const job of this._jobs()) counts[job.status]++;
    return counts;
  });

  add(draft: JobDraft): void {
    this.set([...this._jobs(), { ...draft, id: newId() }]);
  }

  update(job: Job): void {
    this.set(this._jobs().map(j => (j.id === job.id ? job : j)));
  }

  remove(id: string): void {
    this.set(this._jobs().filter(j => j.id !== id));
  }

  private set(jobs: Job[]): void {
    this._jobs.set(jobs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {
      // Storage unavailable (private mode, quota) — keep in memory only.
    }
  }

  private load(): Job[] {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(saved)) return saved;
    } catch {
      // Fall through to seed data.
    }
    return SEED;
  }
}

function newId(): string {
  return crypto.randomUUID();
}

const SEED: Job[] = (
  [
    ['Senior Product Designer', 'Halcyon Labs', 'Hybrid', 'San Francisco', '2026-10-02', 'interview', '$150k–175k', 'Dana Ruiz'],
    ['UX Designer', 'Northwind Health', 'Hybrid', 'Chicago', '2026-10-05', 'rejected', '$105k–120k', ''],
    ['Design Systems Lead', 'Parcel', 'Remote', '', '2026-10-09', 'interview', '$165k–190k', 'Sam Okafor'],
    ['Product Designer', 'Brightline', 'Remote', '', '2026-10-14', 'applied', '$120k–140k', ''],
    ['Interaction Designer', 'Fern & Co', 'In person', 'New York', '2026-10-18', 'offer', '$145k–160k', 'Priya Shah'],
    ['Staff Designer', 'Orbit Finance', 'Remote', '', '2026-10-22', 'interview', '$180k–210k', ''],
    ['UI Engineer', 'Lumen', 'Hybrid', 'Austin', '2026-10-27', 'rejected', '', ''],
    ['Product Designer, Growth', 'Tandem', 'Remote', '', '2026-11-01', 'applied', '$140k–160k', 'Jo Lin'],
    ['Visual Designer', 'Kite Studio', 'Remote', '', '2026-11-04', 'applied', '$70/hr', ''],
    ['Senior UX Researcher', 'Meridian', 'Hybrid', 'Seattle', '2026-11-08', 'applied', '', ''],
    ['Product Design Manager', 'Atlas Mobility', 'Hybrid', 'Denver', '2026-11-11', 'applied', '$170k–195k', ''],
    ['Brand Designer', 'Quarry', 'Remote', '', '2026-11-14', 'applied', '', ''],
  ] as const
).map(([title, company, position, location, date, status, salary, contact]) => ({
  id: newId(),
  title,
  company,
  position,
  location,
  date,
  status,
  salary,
  contact,
  url: '',
  notes: '',
}));
