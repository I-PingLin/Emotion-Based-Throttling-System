
import { Component, ChangeDetectionStrategy, inject, viewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStateService } from './services/system-state.service';
import { VisualizerComponent } from './components/visualizer/visualizer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, VisualizerComponent]
})
export class AppComponent {
  systemState = inject(SystemStateService);
  logContainer = viewChild<ElementRef<HTMLDivElement>>('logContainer');

  constructor() {
    effect(() => {
      // Auto-scroll log container when new logs are added
      const container = this.logContainer();
      if (container) {
        // We need to trigger this after the view has been updated
        setTimeout(() => {
          container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
        }, 0);
      }
      // Re-run this effect whenever logs change
      this.systemState.logs();
    });
  }

  changeEmotion(emotionName: string): void {
    this.systemState.setEmotion(emotionName);
  }
}
