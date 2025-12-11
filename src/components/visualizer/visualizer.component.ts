
import { Component, ChangeDetectionStrategy, input, viewChild, ElementRef, AfterViewInit, effect, OnDestroy } from '@angular/core';

declare const d3: any;

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  imports: [],
})
export class VisualizerComponent implements AfterViewInit, OnDestroy {
  performance = input.required<number>();
  color = input.required<string>();

  container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  svgContainer = viewChild.required<ElementRef<SVGSVGElement>>('svgContainer');

  private svg: any;
  private xScale: any;
  private yScale: any;
  private bars: any;
  private readonly numBars = 16;
  private readonly data = Array.from({ length: this.numBars }, () => Math.random());
  private resizeObserver!: ResizeObserver;

  constructor() {
    effect(() => {
      this.updateChart(this.performance(), this.color());
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
        this.createChart();
        this.updateChart(this.performance(), this.color());
    });
    this.resizeObserver.observe(this.container().nativeElement);
    this.createChart();
  }
  
  ngOnDestroy(): void {
    if (this.resizeObserver) {
        this.resizeObserver.disconnect();
    }
  }

  private createChart(): void {
    const element = this.svgContainer().nativeElement;
    const containerElement = this.container().nativeElement;
    d3.select(element).selectAll("*").remove(); // Clear previous chart

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = containerElement.offsetWidth - margin.left - margin.right;
    const height = containerElement.offsetHeight - margin.top - margin.bottom;

    this.svg = d3.select(element)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.xScale = d3.scaleBand()
      .domain(d3.range(this.numBars))
      .range([0, width])