import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <header class="app-header">
      <h1 class="brand">folio<span class="brand-dot">.</span></h1>
    </header>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: 100vh;
      padding: 16px 20px;
      overflow: hidden;
      background: radial-gradient(1200px 500px at 0% -10%, var(--bg-glow) 0%, var(--bg) 60%);
    }

    .app-header {
      display: flex;
      align-items: center;
    }

    .brand {
      margin: 0;
      font: 700 30px/1 'Space Grotesk', sans-serif;
      letter-spacing: -0.04em;
      color: var(--brand);
    }

    .brand-dot {
      color: var(--accent);
    }

    .app-main {
      display: flex;
      flex: 1;
      min-height: 0;
    }
  `,
})
export class App {}
