import { Component, Input, OnInit, AfterContentChecked, OnDestroy, Output, EventEmitter} from '@angular/core';
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
import {GraphPoint} from '../../models/graph/graph-point';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})

export class GraphComponent {

  @Input() public GraphPoints: GraphPoint[];
  @Input() public GraphUniqueName: string;
  @Output() public GraphCreatingEvent = new EventEmitter<GraphPoint[]>();

  constructor() {
  }

  ngOnInit(){
    this.GraphCreatingEvent.subscribe((points: GraphPoint[]) =>
    {
      this._yAxisChart.destroy();
      this._currentChart.destroy();
      this.ShowGraph(points);
    })
  }

  ngAfterViewInit(){
    this.ShowGraph(this.GraphPoints);
  }

  ngOnDestroy(){
    this._yAxisChart.destroy();
    this._currentChart.destroy();
    this.GraphCreatingEvent.unsubscribe();
  }

  private _yAxisId: string = "graphYAxis";
  private _yAxisChart: Chart;
  private _currentChart: Chart;

  private _lineWidthOnGraph: number = 3;
  // The number of points after which the distance between points becomes fixed.
  private _borderNumberOfPointsForFixedGraphWidth: number = 8;
  // The distance in pixels between two points on the x-axis in.
  private _distanceBetweenPoints: number = 140;

  public YAxisId(): string{
    return `${this._yAxisId}-${this.GraphUniqueName}`;
  }

  public GetNameForBox(): string{
    return `boxFor${this.GraphUniqueName}`;
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

  private _chartOptions = {
    maintainAspectRatio: false,
    layout:{
      padding: { top : 10, bottom: 10}
    },
    plugins: {
      legend: {display : false},
    },
    scales: {
      //x: {
      //  ticks: {display : true,
      //    align: 'start'
      //  }
      //},
      y: {
        beginAtZero: true,
        ticks: {display : false},
        grid: {
          drawTicks : false
        }
      }
    }
  };

  ShowGraph(graphPoints: GraphPoint[]){
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
    this._yAxisChart = new Chart(this.YAxisId(), {
      type: 'bar',
      data: yAxisDataSet,
      options: this._yAxisChartOptions
    });

    // This is real chart.
    this._currentChart = new Chart(this.GraphUniqueName, {
      type: 'line',
      data: currentChartDataSet,
      options: this._chartOptions
    });

    var box = document.querySelector<HTMLElement>("."+this.GetNameForBox());
    var barLength = this._currentChart.data.labels!.length;

    if(barLength > this._borderNumberOfPointsForFixedGraphWidth){
      var chartWidth = barLength * this._distanceBetweenPoints;
      // Set the size for a unique box if the graph has many points.
      this.SetChartBoxSize(box!, `${chartWidth}px`, '100%');
    }
    else{
      // Set the normal size for a unique box if the graph has few points.
      this.SetChartBoxSize(box!, `100%`, '100%');
    }

  }

  private SetChartBoxSize(boxHTMLElement: HTMLElement, width: string, height: string){
    if(boxHTMLElement !== null){
      boxHTMLElement.style.width = width;
      boxHTMLElement.style.height = height;
    }
  }
}
