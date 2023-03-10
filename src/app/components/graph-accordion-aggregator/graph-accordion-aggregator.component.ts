import { Component, ComponentRef, ViewChild, ViewContainerRef, Output, EventEmitter, OnInit} from '@angular/core';
import { GraphAccordionComponent } from '../graph-accordion/graph-accordion.component';
import { GraphPoint } from '../../models/graph/graph-point';
import { TagPoints } from '../../models/graph/tag-points';
import { FileLoadService } from 'src/app/services/file-load.service';

@Component({
  selector: 'app-graph-accordion-aggregator',
  templateUrl: './graph-accordion-aggregator.component.html',
  styleUrls: ['./graph-accordion-aggregator.component.scss']
})

export class GraphAccordionAggregatorComponent {

  @ViewChild('accordionsContainer', { read: ViewContainerRef }) private readonly _accordionsContainer: ViewContainerRef;

  private _file: File;
  private _fileReader: FileReader;
  private _archiveRecords: string[];
  private _uniqueTagsPoints: TagPoints[];
  private _graphAccordionRefs: ComponentRef<GraphAccordionComponent>[] = [];
  private _fileLoadedEventEmitter: EventEmitter<File>;

  constructor(private _fileLoadService: FileLoadService) {
    this._fileLoadedEventEmitter = _fileLoadService.FileLoadedEventEmitter;
  }

  ngOnInit(){
    this._fileLoadedEventEmitter.subscribe((file)=>this.SetFileOnLoad(file));
  }

  ngOnDestroy(){
    this._fileLoadedEventEmitter.unsubscribe();
   }

  public SetFileOnLoad(file: File){
    if(file != null && file != undefined){
      this._file = file;

      // Destroy all accordions if they exist.
      this.DestroyComponents(this._graphAccordionRefs);
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
        this._uniqueTagsPoints = this.GetUniqueTagsAndTheirPoints(this._archiveRecords);
        // Sort list by tag name.
        this.SortListOfTagsPoints(this._uniqueTagsPoints);
        this._uniqueTagsPoints.forEach(tagPoints => {
          this._graphAccordionRefs.push(this.InitChildGraphAccordion(tagPoints));
        });
      };
    }
  }

  private GetUniqueTagsAndTheirPoints(archiveRecords: string[]): TagPoints[]{
    var tagValuesPaires: TagPoints[] = [];
    archiveRecords.forEach((record)=>{
      var recordFields = record.split(",");
      var nameValue = recordFields[0].replace(/["\s$]/g, "");
      var xValue = recordFields[1].replace(/["]/g, "");
      var yValue = recordFields[2];
      var graphPoint = new GraphPoint(xValue, yValue);
      var oneOfTagPairs = tagValuesPaires.find((pair)=> pair.Name === nameValue);
      if(oneOfTagPairs === undefined){
        tagValuesPaires.push(new TagPoints(nameValue, [graphPoint]))
      }
      else{
        oneOfTagPairs?.Points.push(graphPoint);
      }
    });

    return tagValuesPaires;
  }

  private InitChildGraphAccordion(points: TagPoints): ComponentRef<GraphAccordionComponent>{
    var componentRef = this._accordionsContainer.createComponent(GraphAccordionComponent);
    var componentInstance = componentRef.instance;
    componentInstance.GraphPoints = points;
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  private SortListOfTagsPoints(listOfTagsPoints: TagPoints[]){
    // Move the HMI device shutdown data to the end of the list.
    if((listOfTagsPoints !== null) && (listOfTagsPoints.length > 0)){
      let hmiDeviceShutdownData = listOfTagsPoints.pop();
      listOfTagsPoints.sort((a, b) => a.Name.localeCompare(b.Name));
      listOfTagsPoints.push(hmiDeviceShutdownData!);
    }
  }

  private DestroyComponents<C>(components: ComponentRef<C>[]): boolean{
    if(components != undefined && components != null && components.length > 0){
      components.forEach((component) => component.destroy());
      return true;
    }
    return false;
  }

}
