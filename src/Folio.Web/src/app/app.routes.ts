import { Routes } from '@angular/router';
import { TrackerPage } from './tracker/tracker-page';

export const routes: Routes = [
  { path: '', component: TrackerPage, title: 'folio' },
  { path: '**', redirectTo: '' },
];
