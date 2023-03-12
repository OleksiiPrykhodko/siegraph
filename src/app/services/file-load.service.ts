import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class FileLoadService {
  private FileLoadedEventEmitter: EventEmitter<File> = new EventEmitter<File>();

  public subscribe(next: (value: File) => void): void {
    this.FileLoadedEventEmitter.subscribe(next);
  }

  public emit(file: File): void {
    if (file) {
      this.FileLoadedEventEmitter.emit(file);
    }
  }

  public unsubscribe(): void {
    this.FileLoadedEventEmitter.unsubscribe();
  }
}
