import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class FileLoadService {
  private FileLoadedEventEmitter: EventEmitter<File> = new EventEmitter<File>();

  public Subscribe(next: (value: File) => void): void {
    this.FileLoadedEventEmitter.subscribe(next);
  }

  public Emit(file: File): void {
    if (file) {
      this.FileLoadedEventEmitter.emit(file);
    }
  }

  public Unsubscribe(): void {
    this.FileLoadedEventEmitter.unsubscribe();
  }
}
