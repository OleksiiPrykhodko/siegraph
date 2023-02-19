import { Component, OnInit } from '@angular/core';
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


Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})

export class GraphComponent {

  constructor() {
  }

  ngOnInit(){
    this.ShowGraph();
  }

  // Input information. Send it to html to id of canvas.
  private _tagName: string = "tagNameId";
  private _dataSet = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: ' Value ',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 2
    }]
  };
  private _chartOptions = {
    plugins: {
      legend: {display : false},
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  ShowGraph(){
    new Chart(this._tagName, {
      type: 'line',
      data: this._dataSet,
      options: this._chartOptions
    });
  }
}
