import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileLoadService {

  public FileLoadedEventEmitter: EventEmitter<File> = new EventEmitter<File>();

  constructor() { }

  public Subscribe(next: ((value: File) => void)){
   this.FileLoadedEventEmitter.subscribe(next);
  }

  public Emit(file: File){
    if(file != null){
      this.FileLoadedEventEmitter.emit(file);
    }
  }

  public Unsubscribe(){
    this.FileLoadedEventEmitter.unsubscribe();
  }

}
