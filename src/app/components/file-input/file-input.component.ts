import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileLoadService } from '../../services/file-load.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})

export class FileInputComponent {

  public readonly _fakeFileInputID = "fakeFileInput";
  public readonly _fileExtension = ".csv";
  private _file: File;

  constructor(private _fileLoadService: FileLoadService) {
  }

  private setFileNameToInputField(inputId: string, value: string): void {
    var element = document.getElementById(inputId) as HTMLInputElement | null;
    if (element) {
      element.value = value;
    }
  }

  public getFileOnLoad(event: any): void {
    if (event?.target?.files?.length) {
      this._file = event.target.files[0];

      if (this._file?.name.endsWith(this._fileExtension)) {
        // Set file name to hidden input field.
        this.setFileNameToInputField(this._fakeFileInputID, this._file.name);
        if (this._fileLoadService) {
          this._fileLoadService.Emit(this._file);
        }
      }
      else {
        console.log("You try to send file with wrong extension. CSV files only!");
      }
    }
  }

}
