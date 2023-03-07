import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileLoadService {

  public FileLoadedEventEmitter: EventEmitter<File> = new EventEmitter<File>();

  constructor() { }

}
