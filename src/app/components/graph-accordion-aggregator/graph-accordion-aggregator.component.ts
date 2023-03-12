import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { GraphAccordionComponent } from '../graph-accordion/graph-accordion.component';
import { GraphPoint } from '../../models/graph/graph-point';
import { TagPoints } from '../../models/graph/tag-points';
import { FileLoadService } from 'src/app/services/file-load.service';

@Component({
  selector: 'app-graph-accordion-aggregator',
  templateUrl: './graph-accordion-aggregator.component.html',
  styleUrls: ['./graph-accordion-aggregator.component.scss'],
})

export class GraphAccordionAggregatorComponent implements OnInit, OnDestroy {
  @ViewChild('accordionsContainer', { read: ViewContainerRef })
  private readonly _accordionsContainer: ViewContainerRef;

  private _file: File;
  private _fileReader: FileReader;
  private _archiveRecords: string[];
  private _uniqueTagsPoints: TagPoints[];
  private _graphAccordionRefs: ComponentRef<GraphAccordionComponent>[] = [];

  constructor(private _fileLoadService: FileLoadService) { }

  ngOnInit() {
    this._fileLoadService.subscribe((file) => this.setFileOnLoad(file));
  }

  ngOnDestroy() {
    this._fileLoadService.unsubscribe();
  }

  private setFileOnLoad(file: File): void {
    if (file) {
      this._file = file;

      // Destroy all accordions if they exist.
      this.destroyComponents(this._graphAccordionRefs);
      this._graphAccordionRefs = [];

      this._fileReader = new FileReader();
      this._fileReader.readAsText(this._file);
      this._fileReader.onload = () => {
        var fileData = this._fileReader.result;
        let fileRecordsArray = (<string>fileData).split(/\r\n|\n/);
        // Removing the archive table header from array.
        fileRecordsArray.shift();
        // Removing the archive service data from array.
        fileRecordsArray.pop();
        this._archiveRecords = fileRecordsArray;
        this._uniqueTagsPoints = this.getUniqueTagsAndTheirPoints(
          this._archiveRecords
        );
        // Sort list by tag name.
        this.sortListOfTagsPoints(this._uniqueTagsPoints);
        this._uniqueTagsPoints.forEach((tagPoints) => {
          this._graphAccordionRefs.push(
            this.initChildGraphAccordion(tagPoints)
          );
        });
      };
    }
  }

  private getUniqueTagsAndTheirPoints(archiveRecords: string[]): TagPoints[] {
    var tagValuesPaires: TagPoints[] = [];
    archiveRecords.forEach((record) => {
      var recordFields = record.split(',');
      // Remove unnecessary quotes from the tag name.
      var nameValue = recordFields[0].replace(/["\s$]/g, '');
      // Remove quotes from record timestamp.
      var xValue = recordFields[1].replace(/["]/g, '');
      var yValue = recordFields[2];
      var graphPoint = new GraphPoint(xValue, yValue);
      var oneOfTagPairs = tagValuesPaires.find(
        (pair) => pair.Name === nameValue
      );
      if (oneOfTagPairs) {
        oneOfTagPairs.Points.push(graphPoint);
      } else {
        tagValuesPaires.push(new TagPoints(nameValue, [graphPoint]));
      }
    });

    return tagValuesPaires;
  }

  private sortListOfTagsPoints(listOfTagsPoints: TagPoints[]): void {
    // Move the HMI device shutdown data to the end of the list.
    if (listOfTagsPoints?.length > 0) {
      let hmiDeviceShutdownData = listOfTagsPoints.pop();
      listOfTagsPoints.sort((a, b) => a.Name.localeCompare(b.Name));
      listOfTagsPoints.push(hmiDeviceShutdownData!);
    }
  }

  private initChildGraphAccordion(points: TagPoints): ComponentRef<GraphAccordionComponent> {
    var componentRef = this._accordionsContainer.createComponent(
      GraphAccordionComponent
    );
    componentRef.instance.GraphPoints = points;
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  private destroyComponents<C>(components: ComponentRef<C>[]): boolean {
    if (components?.length > 0) {
      components.forEach((component) => component.destroy());
      return true;
    }
    return false;
  }
}
