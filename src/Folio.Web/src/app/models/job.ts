export type StatusId = 'applied' | 'interview' | 'offer' | 'rejected';

export interface Status {
  id: StatusId;
  label: string;
  color: string;
}

export const STATUSES: readonly Status[] = [
  { id: 'applied', label: 'Applied', color: 'var(--status-applied)' },
  { id: 'interview', label: 'Interview', color: 'var(--status-interview)' },
  { id: 'offer', label: 'Offer', color: 'var(--status-offer)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--status-rejected)' },
];

export const POSITIONS = ['Remote', 'Hybrid', 'In person'] as const;

export interface Job {
  id: string;
  title: string;
  company: string;
  /** Work schedule: Remote, Hybrid or In person. */
  position: string;
  location: string;
  salary: string;
  url: string;
  contact: string;
  notes: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  status: StatusId;
}

export type JobDraft = Omit<Job, 'id'>;

export function statusById(id: StatusId): Status {
  return STATUSES.find(s => s.id === id)!;
}
