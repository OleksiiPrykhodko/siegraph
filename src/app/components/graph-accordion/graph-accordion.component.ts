import { Component } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';
import { GraphPoint } from '../../models/graph/graph-point';


@Component({
  selector: 'app-graph-accordion',
  templateUrl: './graph-accordion.component.html',
  styleUrls: ['./graph-accordion.component.scss']
})
export class GraphAccordionComponent {

public _tagName: string = "TagName";
public _points: GraphPoint[] = [new GraphPoint("2/10/2023 5:45:20 PM",2147383648),
new GraphPoint('2/10/2023 5:45:25 PM', 99543251),
new GraphPoint('2/10/2023 5:45:30 PM', 395567546),
new GraphPoint("2/10/2023 5:45:35 PM", 1234234234),
new GraphPoint("2/10/2023 5:45:40 PM", 223459235),
new GraphPoint("2/10/2023 5:45:45 PM", 323549993),
new GraphPoint("2/10/2023 5:45:50 PM", 234592359),
new GraphPoint("2/10/2023 5:45:55 PM", 93239845),
new GraphPoint("2/10/2023 5:46:00 PM", 523499752),
new GraphPoint("2/10/2023 5:46:05 PM", 223633342)];

// 10 = 2147383648, 99543251, 395567546, 1234234234, 223459235, 323549993, 234592359, 93239845, 523499752, 223633342
}
