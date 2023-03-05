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
  this.GraphPoints.Points.forEach((point) => {
    var pointDate = new Date(point.X);
    if(pointDate instanceof Date){
      this._timeStampsOfAllPoints.push(pointDate);
    }
  });
}

@Input() public GraphPoints: TagPoints;

@ViewChild(GraphComponent) private ChildGraphComponent: GraphComponent;

private _tagName: string = "TagName";
private _allPoints: GraphPoint[] = [];
private _timeStampsOfAllPoints: Date[] = [];
private _minDate: Date;
private _maxDate: Date;
private _indexOfFirstPointNowShowed: number = 0;
private readonly _maxNumberOfShowedPoints: number = 200;
private _selectedDate: Date;

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
public CheckShowDateButtonActivity(){
  return this._selectedDate instanceof Date ? true : false;
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

public ShowSelectedDatePoints(){
  if(this._timeStampsOfAllPoints.length > 0 && this._selectedDate instanceof Date){
    var indexOfFirstPointForSelectedDay = this._timeStampsOfAllPoints.findIndex((date) =>
    date.getFullYear() == this._selectedDate.getFullYear() && date.getMonth() == this._selectedDate.getMonth() && date.getDate() == this._selectedDate.getDate());

    this._indexOfFirstPointNowShowed = indexOfFirstPointForSelectedDay;
    var pointsForShowing = this.GetNumberOfPoints(this._allPoints, indexOfFirstPointForSelectedDay, this._maxNumberOfShowedPoints);
    this.ChildGraphComponent.GraphCreatingEvent.emit(pointsForShowing);
  }
}

public DateFilter = (date: Date | null): boolean => {

  const day = (date || new Date()).getDate();
  const month = (date || new Date()).getMonth();
  const year = (date || new Date()).getFullYear();
  var result = this._timeStampsOfAllPoints.some((date) =>
  date.getFullYear() == year && date.getMonth() == month && date.getDate() == day);

  return result;
};

public SetDate(event: any){
  if(event.target.value instanceof Date){
    this._selectedDate = event.target.value;
  }
}

}
