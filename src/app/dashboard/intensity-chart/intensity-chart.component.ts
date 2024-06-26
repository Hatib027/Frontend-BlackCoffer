import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-intensity-chart',
  templateUrl: './intensity-chart.component.html',
  styleUrls: ['./intensity-chart.component.css'],
})
export class IntensityChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() backedData: any[] = [];
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  private width: number;
  private height: number;
  private svg: any;

  constructor() {
    this.width = 800;
    this.height = 400;
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backedData'] && changes['backedData'].currentValue) {
      const data = changes['backedData'].currentValue;
      const top5Data = this.getTop5Pestles(data);
      this.updateChart(top5Data);
    }
  }

  private createSvg(): void {
    this.svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
  }

  private updateChart(data: any[]): void {
    if (!this.svg) {
      this.createSvg();
    }

    // Prepare data for pie chart
    const pie = d3
      .pie<any>()
      .value((d: any) => d.intensity)
      .sort(null);

    const radius = Math.min(this.width, this.height) / 2 - 1;
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Remove previous elements
    this.svg.selectAll('*').remove();

    // Draw arcs
    const arcs = this.svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.pestle))
      .range(d3.schemeCategory10);

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => colorScale(d.data.pestle))
      .append('title')
      .text((d: any) => `${d.data.pestle}: ${d.data.intensity}%`);

    // Add labels with percentage
    arcs
      .append('text')
      .attr('transform', (d: any) => {
        const centroid = arc.centroid(d);
        return `translate(${centroid[0]},${centroid[1]})`;
      })
      .attr('text-anchor', 'middle')
      .text((d: any) => {
        const percentage = Math.round(
          ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
        );
        return `${d.data.pestle} (${percentage}%)`;
      })
      .attr('fill', 'white')
      .attr('font-size', '12px');
  }

  private getTop5Pestles(data: any[]): any[] {
    // Sort data by intensity descending
    data.sort((a, b) => b.intensity - a.intensity);

    // Take top 5 pestles
    const top5Pestles: any[] = [];
    const seenPestles = new Set<string>();

    for (const item of data) {
      if (!seenPestles.has(item.pestle)) {
        top5Pestles.push(item);
        seenPestles.add(item.pestle);
        if (top5Pestles.length === 5) {
          break;
        }
      }
    }

    return top5Pestles;
  }

  private onResize(): void {
    if (this.chartContainer.nativeElement) {
      this.width = this.chartContainer.nativeElement.offsetWidth;
      this.height = this.chartContainer.nativeElement.offsetHeight;

      if (this.svg) {
        d3.select(this.chartContainer.nativeElement)
          .select('svg')
          .attr('width', this.width)
          .attr('height', this.height);

        this.svg.attr(
          'transform',
          `translate(${this.width / 2},${this.height / 2})`
        );

        const top5Data = this.getTop5Pestles(this.backedData);
        this.updateChart(top5Data);
      }
    }
  }
}
