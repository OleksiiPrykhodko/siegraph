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
  this._grupsOfPoints = this.SplitAllPointToGrups(this._allPoints, this._numberOfPointsDisplayedOnGraph);
}

@Input() public GraphPoints: TagPoints;

@ViewChild(GraphComponent) private ChildGraphComponent: GraphComponent;

public _tagName: string = "TagName";
private _allPoints: GraphPoint[] = [];
private _grupsOfPoints: GraphPoint[][];
private _numberOfPointsDisplayedOnGraph: number = 200;
private _indexOfDisplayedPointsGroup: number = 0;

private SplitAllPointToGrups(graphPoints: GraphPoint[], lengthOfGrup: number): GraphPoint[][]
{
  let groupsOfPoints: GraphPoint[][] = [];
  let numberOfGroups = Math.ceil(graphPoints.length/lengthOfGrup);
  for (let index = 0; index < numberOfGroups; index++) {
    groupsOfPoints.push(graphPoints.slice(index * lengthOfGrup, (index * lengthOfGrup) + lengthOfGrup));
  }
  return groupsOfPoints;
}

public GetFirstPoints(): GraphPoint[]{
  return this._grupsOfPoints[0];
}

public DisplayPreviousPoints(){
  if(this._indexOfDisplayedPointsGroup - 1 >= 0){
    --this._indexOfDisplayedPointsGroup;
    this.ChildGraphComponent.GraphCreatingEvent.emit(this._grupsOfPoints[this._indexOfDisplayedPointsGroup]);
  }
}

public DisplayNextPoints(){
  if(this._indexOfDisplayedPointsGroup + 1 < this._grupsOfPoints.length){
    ++this._indexOfDisplayedPointsGroup;
    this.ChildGraphComponent.GraphCreatingEvent.emit(this._grupsOfPoints[this._indexOfDisplayedPointsGroup]);
  }
}

}
