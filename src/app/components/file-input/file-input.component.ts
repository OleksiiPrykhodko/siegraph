import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FileLoadService } from '../../services/file-load.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})

export class FileInputComponent {

  private _fileLoadedEvent: EventEmitter<File>;
  public readonly _fakeFileInputID = "fakeFileInput";
  public readonly _fileExtension = ".csv";
  private _file: File;

  constructor(private _fileLoadService: FileLoadService) {
    this._fileLoadedEvent = _fileLoadService.FileLoadedEventEmitter;
  }

  private SetFileNameToInputField(inputId: string, value: string){
    var element = document.getElementById(inputId) as HTMLInputElement | null;
    if(element != null){
      element.value = value;
    }
  }

  public GetFileOnLoad(event: any){
    if(event != null && event != undefined && event.target.files.length > 0){
      this._file = event.target.files[0];

      if(this._file instanceof File && this._file.name.endsWith(this._fileExtension)){
        // set file name to hidden input field
        this.SetFileNameToInputField(this._fakeFileInputID, this._file.name);
        if(this._fileLoadedEvent != null && this._fileLoadedEvent != undefined){
          this._fileLoadedEvent.emit(this._file);
        }
      }
      else{
        console.log("You try to send file with wrong extension. CSV files only!");
      }
    }
  }

}
