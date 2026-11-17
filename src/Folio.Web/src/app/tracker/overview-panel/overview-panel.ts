import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { STATUSES, StatusId, statusById } from '../../models/job';
import { JobStore } from '../../services/job-store';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SEGMENT_GAP = 2;

@Component({
  selector: 'app-overview-panel',
  templateUrl: './overview-panel.html',
  styleUrl: './overview-panel.scss',
})
export class OverviewPanel implements OnDestroy {
  private readonly store = inject(JobStore);
  private hoverTimer?: ReturnType<typeof setTimeout>;

  protected readonly radius = RADIUS;
  protected readonly total = this.store.total;
  protected readonly hover = signal<StatusId | null>(null);
  /** Keeps the centre label filled while it fades out. */
  private readonly lastHover = signal<StatusId | null>(null);

  protected readonly segments = computed(() => {
    const total = this.total();
    const counts = this.store.counts();
    const hover = this.hover();
    const shown = STATUSES.filter(s => counts[s.id] > 0).length;
    let acc = 0;
    return STATUSES.map(s => {
      const n = counts[s.id];
      const len = total ? (n / total) * CIRCUMFERENCE : 0;
      const gap = shown > 1 && n ? SEGMENT_GAP : 0;
      const segment = {
        ...s,
        count: n,
        pct: total ? Math.round((n / total) * 100) : 0,
        dash: `${Math.max(len - gap, 0)} ${CIRCUMFERENCE}`,
        offset: -acc,
        width: hover === s.id ? 26 : 22,
        dimmed: !!hover && hover !== s.id,
      };
      acc += len;
      return segment;
    });
  });

  protected readonly focused = computed(() => {
    const id = this.hover() ?? this.lastHover();
    if (!id) return null;
    const seg = this.segments().find(s => s.id === id)!;
    return { ...statusById(id), count: seg.count, pct: seg.pct };
  });

  protected readonly donutLabel = computed(
    () =>
      `${this.total()} applications: ` +
      this.segments()
        .map(s => `${s.count} ${s.label}`)
        .join(', '),
  );

  /** Debounced so sweeping across segments doesn't flicker the centre label. */
  protected hoverTo(id: StatusId | null): void {
    clearTimeout(this.hoverTimer);
    this.hoverTimer = setTimeout(
      () => {
        this.hover.set(id);
        if (id) this.lastHover.set(id);
      },
      id ? 70 : 140,
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.hoverTimer);
  }
}
