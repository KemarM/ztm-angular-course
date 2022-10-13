import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList()

  constructor() { }

  ngAfterContentInit(): void { //sometimes we need child content to be rendered after the parent's initial ngOnInit() is called, so we use ngAfterContentInit() function and import, and interface instead
    const activeTabs = this.tabs?.filter( //the optional chaining operator ' ? ' is placed after this.tabs, because TypeScript will through an error saying 'tabs' is possible undefined
      tab => tab.active
    )

    if(!activeTabs || activeTabs.length === 0){
      this.selectTab(this.tabs!.first) //Same as above, the ' ! ' is called the Bang! operator, where it tells the compiler to relax, no longer throwing an error saying 'tabs' may be undefined
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach(tab => {
      tab.active = false //this sets all tabs to fales/inactive for safety from duplication of active tabs
    })

    tab.active = true

    return false //this automatically prevents the default behaviour of clicking the tab, removing the "#" from the browser address bar, we can do it another way but capturing the event object and handling it from there
  }

}
