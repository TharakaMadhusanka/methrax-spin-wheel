import { Component, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MethraxSpinWheel } from '@methrax/spin-wheel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MethraxSpinWheel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-17');
    @ViewChildren('spinwheel') spinwheel = new QueryList<MethraxSpinWheel>();

  sectors = [{
    id: '1',
    label: 'One',
    color : '#1709d9'
  },
{
    id: '2',
    label: 'Two',
    color : '#fa4a39'
  },{
    id: '3',
    label: 'Three',
    color : '#32a852'
  },
{
    id: '4',
    label: 'Four',
    color : '#fae039'
  },
{
    id: '5',
    label: 'Five',
    color : '#32a852'
  },
{
    id: '6',
    label: 'Six',
    color : '#d909d5'
  },
{
    id: '7',
    label: 'Seven',
    color : '#9c2f43'
  }];

  spinRandom() {
    this.spinwheel.forEach(x => x.spinRandom());
  }
}
