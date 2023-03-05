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
}

@Input() public GraphPoints: TagPoints;

@ViewChild(GraphComponent) private ChildGraphComponent: GraphComponent;

private _tagName: string = "TagName";
private _allPoints: GraphPoint[] = [];
private _minDate: Date;
private _maxDate: Date;
private _indexOfFirstPointNowShowed: number = 0;
private readonly _maxNumberOfShowedPoints: number = 10;

public GetTagName(){
  return this._tagName;
}
public GetMinDate(){
  return this._minDate;
}
public GetMaxDate(){
  return this._maxDate;
}
public GetFirstPointIndex(){
  return this._indexOfFirstPointNowShowed;
}
public CheckPreviousButtonActivity(){
  return this._indexOfFirstPointNowShowed > 0;
}
public CheckNextButtonActivity(){
  return (this._indexOfFirstPointNowShowed + this._maxNumberOfShowedPoints) < this._allPoints.length;
}

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

public DateFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  return day !== 0 && day !== 6;
};

public SetDate($event: any){
  console.log($event.target.value);
}

}
