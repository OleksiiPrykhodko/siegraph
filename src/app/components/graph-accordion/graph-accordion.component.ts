import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';
import { GraphPoint } from '../../models/graph/graph-point';
import { TagPoints } from 'src/app/models/graph/tag-points';
import { ScrollDirection } from 'src/app/models/common/scroll-direction';

@Component({
  selector: 'app-graph-accordion',
  templateUrl: './graph-accordion.component.html',
  styleUrls: ['./graph-accordion.component.scss']
})

export class GraphAccordionComponent implements OnInit {
  @Input() public _graphPoints: TagPoints;

  @ViewChild(GraphComponent) private _childGraphComponent: GraphComponent;

  private _tagName: string = 'TagName';
  private _allPoints: GraphPoint[] = [];
  private _timeStampsOfAllPoints: Date[] = [];
  private _indexOfFirstPointNowShowed: number = 0;
  private readonly _maxNumberOfShowedPoints: number = 20;
  private _selectedDate: Date;

  ngOnInit(): void {
    if(this._graphPoints){
      this._tagName = this._graphPoints.Name;
      this._allPoints = this._graphPoints.Points;
      this._graphPoints.Points?.forEach((point) => {
        var pointDate = new Date(point.X);
        if (pointDate.toString() !== "Invalid Date") {
          this._timeStampsOfAllPoints.push(pointDate);
        }
      });
    }
  }

  public getTagName(): string {
    return this._tagName;
  }

  public getFirstPointIndex(): number {
    return this._indexOfFirstPointNowShowed;
  }

  public getAllPointsNumber(): number {
    return this._allPoints.length;
  }

  public getLastShowedPointNumber(): number {
    return this._indexOfFirstPointNowShowed + this._maxNumberOfShowedPoints >
      this._allPoints.length
      ? this._allPoints.length
      : this._indexOfFirstPointNowShowed + this._maxNumberOfShowedPoints;
  }

  public getShowedPointsStatistic(): string {
    return `${this.getFirstPointIndex() + 1} - ${this.getLastShowedPointNumber()} / ${this.getAllPointsNumber()}`;
  }

  public checkPreviousButtonActivity(): boolean {
    return this._indexOfFirstPointNowShowed > 0;
  }

  public checkNextButtonActivity(): boolean {
    return (
      this._indexOfFirstPointNowShowed + this._maxNumberOfShowedPoints < this._allPoints.length
    );
  }

  private getNumberOfPoints(points: GraphPoint[], startIndex: number, numberOfPoints: number
  ): GraphPoint[] {
    return points.slice(startIndex, startIndex + numberOfPoints);
  }

  public getFirstInitPoints(): GraphPoint[] {
    return this.getNumberOfPoints(this._allPoints, 0, this._maxNumberOfShowedPoints);
  }

  public showPreviousPoints(): void {
    if (this._indexOfFirstPointNowShowed > 0) {
      if (this._indexOfFirstPointNowShowed - this._maxNumberOfShowedPoints < 0) {
        this._indexOfFirstPointNowShowed = 0;
      } else {
        this._indexOfFirstPointNowShowed -= this._maxNumberOfShowedPoints;
      }
      var pointsForShowing = this.getNumberOfPoints(
        this._allPoints,
        this._indexOfFirstPointNowShowed,
        this._maxNumberOfShowedPoints
      );
      this._childGraphComponent._showGraphEvent.emit(pointsForShowing);
      this._childGraphComponent._scrollGraphBoxEvent.emit(ScrollDirection.ToEnd);
    }
  }

  public showNextPoints(): void {
    if (
      this._indexOfFirstPointNowShowed + this._maxNumberOfShowedPoints < this._allPoints.length
      ) {
      this._indexOfFirstPointNowShowed += this._maxNumberOfShowedPoints;
      var pointsForShowing = this.getNumberOfPoints(
        this._allPoints,
        this._indexOfFirstPointNowShowed,
        this._maxNumberOfShowedPoints
      );
      this._childGraphComponent._showGraphEvent.emit(pointsForShowing);
      this._childGraphComponent._scrollGraphBoxEvent.emit(ScrollDirection.ToStart);
    }
  }

  public dateFilter = (date: Date | null): boolean => {
    const day = (date || new Date()).getDate();
    const month = (date || new Date()).getMonth();
    const year = (date || new Date()).getFullYear();
    var result = this._timeStampsOfAllPoints.some(
      (date) =>
        date.getFullYear() == year &&
        date.getMonth() == month &&
        date.getDate() == day
    );

    return result;
  };

  public setDate(event: any): void {
    if (event?.target?.value) {
      this._selectedDate = event.target.value;
      this.showSelectedDatePoints();
    }
  }

  public showSelectedDatePoints(): void {
    if (this._selectedDate && this._timeStampsOfAllPoints.length > 0){
      var indexOfFirstPointForSelectedDay =
        this._timeStampsOfAllPoints.findIndex(
          (date) =>
            date.getFullYear() == this._selectedDate.getFullYear() &&
            date.getMonth() == this._selectedDate.getMonth() &&
            date.getDate() == this._selectedDate.getDate()
        );
      if (indexOfFirstPointForSelectedDay >= 0) {
        this._indexOfFirstPointNowShowed = indexOfFirstPointForSelectedDay;
        var pointsForShowing = this.getNumberOfPoints(
          this._allPoints,
          indexOfFirstPointForSelectedDay,
          this._maxNumberOfShowedPoints
        );
        this._childGraphComponent._showGraphEvent.emit(pointsForShowing);
      }
    }
  }
}
