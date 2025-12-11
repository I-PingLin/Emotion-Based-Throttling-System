
import { Injectable, signal, computed } from '@angular/core';

export interface Emotion {
  name: string;
  icon: string;
  color: string;
  performance: number; // 0.0 to 1.0
  description: string;
}

export interface LogEntry {
  message: string;
  timestamp: Date;
  color: string;
}

const EMOTION_STATES: Emotion[] = [
  {
    name: 'Calm',
    icon: '😌',
    color: '#34d399', // emerald-400
    performance: 1.0,
    description: 'System nominal. All cores operating at 100% efficiency.'
  },
  {
    name: 'Focused',
    icon: '🎯',
    color: '#60a5fa', // blue-400
    performance: 0.85,
    description: 'Resource allocation optimized for priority tasks. Throughput stable.'
  },
  {
    name: 'Stressed',
    icon: '😟',
    color: '#facc15', // yellow-400
    performance: 0.5,
    description: 'High load detected. Non-essential processes are being throttled.'
  },
  {
    name: 'Overloaded',
    icon: '🥵',
    color: '#f87171', // red-400
    performance: 0.2,
    description: 'CRITICAL: System integrity at risk. Aggressive throttling engaged. Performance reduced.'
  },
];

@Injectable({
  providedIn: 'root',
})
export class SystemStateService {
  private readonly initialEmotion = EMOTION_STATES[0];

  emotions = signal<Emotion[]>(EMOTION_STATES);
  currentEmotion = signal<Emotion>(this.initialEmotion);
  logs = signal<LogEntry[]>([
    {
      message: `System initialized in ${this.initialEmotion.name} state.`,
      timestamp: new Date(),
      color: this.initialEmotion.color,
    },
    {
        message: this.initialEmotion.description,
        timestamp: new Date(),
        color: '#a5b4fc', // indigo-300
    }
  ]);

  currentPerformance = computed(() => this.currentEmotion().performance);

  setEmotion(emotionName: string) {
    const newEmotion = this.emotions().find(e => e.name === emotionName);
    if (newEmotion && newEmotion.name !== this.currentEmotion().name) {
      this.currentEmotion.set(newEmotion);
      this.addLog(`State transition to ${newEmotion.name} initiated.`, newEmotion.color);
      this.addLog(newEmotion.description, '#a5b4fc'); // indigo-300
    }
  }

  private addLog(message: string, color: string) {
    this.logs.update(currentLogs => [
      ...currentLogs,
      { message, timestamp: new Date(), color }
    ]);
  }
}
