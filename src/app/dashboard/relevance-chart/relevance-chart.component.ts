import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-relevance-chart',
  templateUrl: './relevance-chart.component.html',
  styleUrls: ['./relevance-chart.component.css']
})
export class RelevanceChartComponent implements OnChanges {
  @Input() backedData: any[] = [];
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  private margin = { top: 20, right: 50, bottom: 60, left: 40 };
  private width: number;
  private height: number;
  private svg: any;

  constructor(private renderer: Renderer2) {
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backedData'] && changes['backedData'].currentValue) {
      const data = changes['backedData'].currentValue;
      const groupedData = this.groupDataByTopic(data);
      const top5Data = this.getTop5Data(groupedData);

      if (this.svg) {
        this.updateChart(top5Data);
      } else {
        this.createSvg();
        this.drawBars(top5Data);
      }
    }
  }

  private groupDataByTopic(data: any[]): Map<string, any[]> {
    const groupedData = new Map<string, any[]>();
    data.forEach(item => {
      const topic = item.pestle;
      if (!groupedData.has(topic)) {
        groupedData.set(topic, []);
      }
      groupedData.get(topic)?.push(item);
    });
    return groupedData;
  }

  private getTop5Data(groupedData: Map<string, any[]>): any[] {
    const top5Data: any[] = [];
    groupedData.forEach((values, key) => {
      values.sort((a, b) => b.relevance - a.relevance);
      const top5 = values.slice(0, 5);
      top5Data.push(...top5);
    });
    return top5Data;
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${800} ${400}`)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawBars(data: any[]): void {
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.pestle))
      .padding(0.1)
      .paddingInner(0.2)
      .paddingOuter(0.2);

    const y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(data, d => d.relevance)]);

    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    this.svg.append('g')
      .call(d3.axisLeft(y));

    this.svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(d.pestle))
      .attr('y', (d: any) => y(d.relevance))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.relevance))
      .attr('fill', 'steelblue');
  }

  private updateChart(data: any[]): void {
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.pestle))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(data, d => d.relevance)]);

    this.svg.selectAll('.bar')
      .data(data)
      .attr('x', (d: any) => x(d.pestle))
      .attr('y', (d: any) => y(d.relevance))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.relevance));
  }

  onResize(event: Event): void {
    // Resize chart on window resize event
    if (this.svg) {
      this.width = this.chartContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right;
      this.height = this.chartContainer.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

      // Update SVG and re-render chart
      d3.select(this.chartContainer.nativeElement).select('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom);

      this.svg.attr('transform', `translate(${this.margin.left},${this.margin.top})`);

      // Redraw or update bars based on new dimensions
      const data = this.getTop5Data(this.groupDataByTopic(this.backedData));
      this.updateChart(data);
    }
  }

}
