import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphComponent } from './components/graph/graph.component';
import { GraphAccordionComponent } from './components/graph-accordion/graph-accordion.component';
import { GraphAccordionAggregatorComponent } from './components/graph-accordion-aggregator/graph-accordion-aggregator.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GraphAccordionComponent,
    GraphAccordionAggregatorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
