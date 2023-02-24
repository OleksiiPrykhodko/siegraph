import { GraphPoint } from './graph-point';

export class TagPoints{
  public readonly Name: string;
  public readonly Points: GraphPoint[];

  constructor(tagName: string, points: GraphPoint[]) {
    this.Name = tagName;
    this.Points = points;
  }

}
