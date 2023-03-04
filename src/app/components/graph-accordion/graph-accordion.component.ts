import { Component, Input, ViewChild } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';
import { GraphPoint } from '../../models/graph/graph-point';
import { TagPoints } from 'src/app/models/graph/tag-points';


@Component({
  selector: 'app-graph-accordion',
  templateUrl: './graph-accordion.component.html',
  styleUrls: ['./graph-accordion.component.scss']
})

export class GraphAccordionComponent {

ngOnInit(){
  this._tagName = this.GraphPoints.Name;
  this._allPoints = this.GraphPoints.Points;
  //this._grupsOfPoints = this.SplitAllPointToGrups(this._allPoints, this._numberOfPointsDisplayedOnGraph);
}

@Input() public GraphPoints: TagPoints;

@ViewChild(GraphComponent) private ChildGraphComponent: GraphComponent;

public _tagName: string = "TagName";
private _allPoints: GraphPoint[] = [];
private readonly _maxNumberOfShowedPoints: number = 200;
private _indexOfFirstPointNowShowed: number = 0;

private GetNumberOfPoints(points: GraphPoint[], startIndex: number, numberOfPoints: number) : GraphPoint[]{
  return points.slice(startIndex, startIndex + numberOfPoints);
}

public GetFirstInitPoints(): GraphPoint[]{
  return this.GetNumberOfPoints(this._allPoints, 0, this._maxNumberOfShowedPoints);
}

public ShowPreviousPoints(){
  if(this._indexOfFirstPointNowShowed > 0){
    if(this._indexOfFirstPointNowShowed - this._maxNumberOfShowedPoints < 0){
      this._indexOfFirstPointNowShowed = 0;
    }
    else{
      this._indexOfFirstPointNowShowed -= this._maxNumberOfShowedPoints;
    }
    var pointsForShowing = this.GetNumberOfPoints(this._allPoints, this._indexOfFirstPointNowShowed, this._maxNumberOfShowedPoints);
    this.ChildGraphComponent.GraphCreatingEvent.emit(pointsForShowing);
  }
}

public ShowNextPoints(){
  if((this._indexOfFirstPointNowShowed + this._maxNumberOfShowedPoints) < this._allPoints.length){
    this._indexOfFirstPointNowShowed += this._maxNumberOfShowedPoints;
    var pointsForShowing = this.GetNumberOfPoints(this._allPoints, this._indexOfFirstPointNowShowed, this._maxNumberOfShowedPoints);
    this.ChildGraphComponent.GraphCreatingEvent.emit(pointsForShowing);
  }
}

}
