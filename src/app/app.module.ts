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


@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GraphAccordionComponent,
    GraphAccordionAggregatorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
