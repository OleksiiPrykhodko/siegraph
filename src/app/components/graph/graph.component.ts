import { Component, Input, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
import { GraphPoint } from '../../models/graph/graph-point';
import { ScrollDirection } from '../../models/common/scroll-direction'

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})

export class GraphComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() public _graphPoints: GraphPoint[];
  @Input() public _graphUniqueName: string;
  @Output() public _showGraphEvent = new EventEmitter<GraphPoint[]>();
  @Output() public _scrollGraphBoxEvent = new EventEmitter<ScrollDirection>();

  private _yAxisId: string = "graphYAxis";
  private _yAxisChart: Chart;
  private _currentChart: Chart;

  private _ticksOnAxesColor: string = "#f8f9fa";
  private _ticksOnAxesFontSize: number = 13;
  private _gridOnGraphColor: string = "#495057";
  private _lineOnGraphColor: string = "#1de9b6";
  private _lineOnGraphWidth: number = 2;
  private _pointOnGraphStyle: string = "triangle";
  private _pointOnGraphRadius: number = 6;
  private _pointOnGraphRadiusOnHover: number = 10;
  // The distance in pixels between two points on the x-axis in.
  private _distanceBetweenPoints: number = 140;


  ngOnInit(){
    this._showGraphEvent.subscribe((points: GraphPoint[]) =>
    {
      this.setPointsToGraph(points);
    });
    this._scrollGraphBoxEvent.subscribe((direction)=>
    {
      this.scrollGraphBoxTo(direction);
    });
  }

  ngAfterViewInit(){
    this.createGraph(this._graphPoints);
  }

  ngOnDestroy(){
    this._yAxisChart.destroy();
    this._currentChart.destroy();
    this._showGraphEvent.unsubscribe();
    this._scrollGraphBoxEvent.unsubscribe();
  }

  public yAxisId(): string{
    return `${this._yAxisId}-${this._graphUniqueName}`;
  }

  public getClassNameForGraphBox(): string{
    return `colFor${this._graphUniqueName}`
  }

  public getNameForBox(): string{
    return `boxFor${this._graphUniqueName}`;
  }

  private _yAxisChartOptions = {
    maintainAspectRatio: false,
    layout:{
      padding: { bottom : 56 }
    },
    plugins: {
      legend: { display : false },
    },
    scales: {
      x:{
        ticks: { display : false },
        grid: { drawTicks : false }
      },
      y: {
        ticks: {
          color : this._ticksOnAxesColor,
          font: { size: this._ticksOnAxesFontSize }
        },
        beginAtZero: true,
        afterFit: (ctx : any) => { ctx.width = 87 }
      }
    }
  };

  private _mainChartOptions = {
    maintainAspectRatio: false,
    layout:{
      padding: { top : 10, bottom: 10}
    },
    plugins: {
      legend: { display : false },
    },
    scales: {
      x: {
        ticks: {
          color : this._ticksOnAxesColor,
          font: { size: this._ticksOnAxesFontSize }
        },
        grid: {
          color: this._gridOnGraphColor,
        }
      },
      y: {
        beginAtZero: true,
        ticks: { display : false },
        grid: {
          color: this._gridOnGraphColor,
          drawTicks : false
        }
      }
    }
  };

  private createGraph(graphPoints: GraphPoint[]): void{
    var yAxisDataSet ={
      // Set 2 points on x axis for min and max values.
      labels: ['0','1'],
      datasets: [{
        // Min and max value from incoming data.
        data: [Math.min(...(graphPoints.map(point => point.Y))),
              Math.max(...(graphPoints.map(point => point.Y)))],
        borderWidth: 0
      }]
    };

    var currentChartDataSet = {
      labels: graphPoints.map(point => this.formDateToCustomTimeFormat(point.X as Date)),
      datasets: [{
        label: ' Value ',
        data: graphPoints.map(point => point.Y),
        borderColor: this._lineOnGraphColor,
        borderWidth: this._lineOnGraphWidth,
        pointStyle: this._pointOnGraphStyle,
        pointRadius: this._pointOnGraphRadius,
        pointHoverRadius: this._pointOnGraphRadiusOnHover
      }]
    };

    // This is chart only for creating Y axis.
    this._yAxisChart = new Chart(this.yAxisId(), {
      type: 'bar',
      data: yAxisDataSet,
      options: this._yAxisChartOptions
    });

    // This is real chart.
    this._currentChart = new Chart(this._graphUniqueName, {
      type: 'line',
      data: currentChartDataSet,
      options: this._mainChartOptions
    });
    (this._currentChart!.options!.scales!['x']!.ticks! as any).align = 'start';
    this._currentChart.update();

    this.resizeChartBox();
  }

  private resizeChartBox(): void{
    var box = document.querySelector<HTMLElement>("."+this.getNameForBox());
    var numberOfPointsOnGraph = this._currentChart.data.labels!.length;
    var chartWidth = numberOfPointsOnGraph * this._distanceBetweenPoints;
    // Set the size for a unique box if the graph has many points.
    this.setChartBoxSize(box!, `${chartWidth}px`, '100%');
  }

  private setChartBoxSize(boxHTMLElement: HTMLElement, width: string, height: string): void{
    if(boxHTMLElement){
      boxHTMLElement.style.width = width;
      boxHTMLElement.style.height = height;
    }
  }

  private setPointsToGraph(graphPoints: GraphPoint[]): void{
    if(this._currentChart){
      // Remove all old points and set new.
      var onAxisX = graphPoints.map(point => this.formDateToCustomTimeFormat(point.X as Date));
      this._currentChart.data.labels = onAxisX;
      var onAxisY = graphPoints.map(point => point.Y);
      this._currentChart.data.datasets.forEach(dataset => dataset.data = onAxisY);
      // 'none' argument can to update chart without animations.
      this._currentChart.update();

      // Set new max and min point to Y axis chart for resizing of Y axis.
      this._yAxisChart.data.datasets.forEach(dataset => dataset.data =
        [Math.min(...(onAxisY)),
          Math.max(...(onAxisY))]);
      this._yAxisChart.update();

      this.resizeChartBox();
    }
  }

  private scrollGraphBoxTo(scrollDirection: ScrollDirection): void{
    var box = document.querySelector<HTMLElement>("." + this.getClassNameForGraphBox()) as HTMLElement;

    if(scrollDirection === ScrollDirection.ToStart){
      box.scrollLeft = 0;
    }
    if(scrollDirection === ScrollDirection.ToEnd){
      box.scrollLeft = box.scrollWidth;
    }
  }

  private formDateToCustomTimeFormat(date: Date): string{
    if(date.toString() === "Invalid Date"){
      return "";
    }
    var month = date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
  }

}
