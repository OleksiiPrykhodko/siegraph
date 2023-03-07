import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphComponent } from './components/graph/graph.component';
import { GraphAccordionComponent } from './components/graph-accordion/graph-accordion.component';
import { GraphAccordionAggregatorComponent } from './components/graph-accordion-aggregator/graph-accordion-aggregator.component';

// Angular Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon';
import { FileInputComponent } from './components/file-input/file-input.component';


@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GraphAccordionComponent,
    GraphAccordionAggregatorComponent,
    FileInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
