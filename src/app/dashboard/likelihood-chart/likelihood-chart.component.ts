import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-likelihood-chart',
  templateUrl: './likelihood-chart.component.html',
  styleUrls: ['./likelihood-chart.component.css']
})
export class LikelihoodChartComponent implements OnChanges {
  @Input() backedData: any[] = [];
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  private margin = { top: 20, right: 0, bottom: 40, left: 150 };
  private width: number;
  private height: number;
  private svg: any;

  constructor() {
    this.width = 1400 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backedData'] && changes['backedData'].currentValue) {
      const data = changes['backedData'].currentValue;
 // Log the original data
      const top5Data = this.getTop5Likelihoods(data);
      console.log('Top 5 Data:', top5Data);  // Log the top 5 data
      this.updateChart(top5Data);
    }
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private updateChart(data: any[]): void {
    if (!this.svg) {
      this.createSvg();
    }

    // Set dimensions and margins
    const width = this.width;
    const height = this.height;

    // Remove previous elements
    this.svg.selectAll('*').remove();

    // Create the x scale
    const x = d3.scaleLinear()
      .domain([0, 5]) // Assuming likelihood is out of 5
      .range([0, width]);

    // Create the y scale
    const y = d3.scaleBand()
      .domain(data.map(d => d.sector))
      .range([0, height])
      .padding(0.1);

    // Add the x axis
    this.svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add the y axis
    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Create the bars
    this.svg.selectAll('myRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', (d: { sector: string; }) => y(d.sector)!)
      .attr('width', (d: { likelihood: d3.NumberValue; }) => x(d.likelihood))
      .attr('height', y.bandwidth())
      .attr('fill', '#69b3a2');

    // Add labels
    this.svg.selectAll('text.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d: { likelihood: d3.NumberValue; }) => x(d.likelihood) + 5)
      .attr('y', (d: { sector: string; }) => y(d.sector)! + y.bandwidth() / 2 + 4)
      .text((d: { likelihood: any; }) => d.likelihood)
      .attr('fill', 'black')
      .attr('font-size', '12px');
  }

  private getTop5Likelihoods(data: any[]): any[] {
    // Sort data by likelihood descending
    data.sort((a, b) => b.likelihood - a.likelihood);

    // Take top 5 likelihoods
    const top5Likelihoods: any[] = [];
    const seenSectors = new Set<string>();

    for (const item of data) {
      if (item.sector && !seenSectors.has(item.sector)) {
        top5Likelihoods.push(item);
        seenSectors.add(item.sector);
        if (top5Likelihoods.length === 5) {
          break;
        }
      }
    }

    return top5Likelihoods;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.chartContainer.nativeElement) {
      this.width = this.chartContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right;
      this.height = this.chartContainer.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

      if (this.svg) {
        d3.select(this.chartContainer.nativeElement).select('svg')
          .attr('width', this.width + this.margin.left + this.margin.right)
          .attr('height', this.height + this.margin.top + this.margin.bottom);

        this.svg.attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        const top5Data = this.getTop5Likelihoods(this.backedData);
        this.updateChart(top5Data);
      }
    }
  }
}
