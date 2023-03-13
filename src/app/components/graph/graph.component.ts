import { Component, Input, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {
  Chart,
  ChartType,
  ChartOptions,
  ChartData,
  Colors,
  BubbleController,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  registerables,
} from 'node_modules/chart.js';
import { GraphPoint } from '../../models/graph/graph-point';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})

export class GraphComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() public _graphPoints: GraphPoint[];
  @Input() public _graphUniqueName: string;
  @Output() public _graphCreatingEvent = new EventEmitter<GraphPoint[]>();

  private _yAxisId: string = "graphYAxis";
  private _yAxisChart: Chart;
  private _currentChart: Chart;

  private _lineWidthOnGraph: number = 3;
  // The number of points after which the distance between points becomes fixed.
  private _borderNumberOfPointsForFixedGraphWidth: number = 8;
  // The distance in pixels between two points on the x-axis in.
  private _distanceBetweenPoints: number = 140;


  ngOnInit(){
    this._graphCreatingEvent.subscribe((points: GraphPoint[]) =>
    {
      this._yAxisChart.destroy();
      this._currentChart.destroy();
      this.showGraph(points);
    });
  }

  ngAfterViewInit(){
    this.showGraph(this._graphPoints);
  }

  ngOnDestroy(){
    this._yAxisChart.destroy();
    this._currentChart.destroy();
    this._graphCreatingEvent.unsubscribe();
  }

  public yAxisId(): string{
    return `${this._yAxisId}-${this._graphUniqueName}`;
  }

  public getNameForBox(): string{
    return `boxFor${this._graphUniqueName}`;
  }

  private _yAxisChartOptions = {
    maintainAspectRatio: false,
    layout:{
      padding: { bottom : 56}
    },
    plugins: {
      legend: {display : false},
    },
    scales: {
      x:{
        ticks: {display : false},
        grid: {drawTicks : false}
      },
      y: {
        beginAtZero: true,
        afterFit: (ctx : any) => {ctx.width = 87}
      }
    }
  };

  private _mainChartOptions = {
    maintainAspectRatio: false,
    layout:{
      padding: { top : 10, bottom: 10}
    },
    plugins: {
      legend: {display : false},
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {display : false},
        grid: {
          drawTicks : false
        }
      }
    }
  };

  private showGraph(graphPoints: GraphPoint[]): void{
    var yAxisDataSet ={
      // min and max values
      labels: ['0','1'],
      datasets: [{
        // min and max value from incoming data
        data: [Math.min(...(graphPoints.map(point => point.Y))),
              Math.max(...(graphPoints.map(point => point.Y)))],
        borderWidth: 0
      }]
    };

    var currentChartDataSet = {
      labels: graphPoints.map(point => point.X),
      datasets: [{
        label: ' Value ',
        data: graphPoints.map(point => point.Y),
        borderWidth: this._lineWidthOnGraph
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
    this._currentChart!.update();

    var box = document.querySelector<HTMLElement>("."+this.getNameForBox());
    var barLength = this._currentChart.data.labels!.length;

    if(barLength > this._borderNumberOfPointsForFixedGraphWidth){
      var chartWidth = barLength * this._distanceBetweenPoints;
      // Set the size for a unique box if the graph has many points.
      this.setChartBoxSize(box!, `${chartWidth}px`, '100%');
    }
    else{
      // Set the normal size for a unique box if the graph has few points.
      this.setChartBoxSize(box!, `100%`, '100%');
    }

  }

  private setChartBoxSize(boxHTMLElement: HTMLElement, width: string, height: string): void{
    if(boxHTMLElement){
      boxHTMLElement.style.width = width;
      boxHTMLElement.style.height = height;
    }
  }
}
