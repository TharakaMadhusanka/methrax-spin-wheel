# Methrax Spin Wheel

A highly customizable, lightweight, and framework-native **Angular 17+ Spin Wheel component** built with modern Angular features including:

- Standalone Components
- Angular Signals
- Signal Inputs / Outputs
- Computed State
- CSS Custom Properties (Design Tokens)
- No external dependencies

Create interactive prize wheels, decision wheels, random selectors, game wheels, and custom spinning experiences with complete styling control.

---

## Features

✅ Angular 17+ compatible  
✅ Standalone component architecture  
✅ Signal-based reactive state management  
✅ Fully customizable design tokens  
✅ Dynamic sector generation  
✅ Random spinning  
✅ Spin to specific result  
✅ Custom center pin  
✅ Custom sector colors  
✅ Custom label styling  
✅ Smooth configurable animations  
✅ Library consumer theme overrides  
✅ Zero third-party dependencies  

---

## Installation

Install the package using npm:

```bash
npm install @methrax/spin-wheel
````

---

## Usage

### Import Component

Since this library uses standalone components, import it directly into your Angular component.

```typescript
import { MethraxSpinWheel } from '@methrax/spin-wheel';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    MethraxSpinWheel
  ],
  templateUrl: './example.component.html'
})
export class ExampleComponent {

}
```

---

## Basic Example

### Component Template

```html
<m-spin-wheel
  [sectors]="wheelSectors"
  [numberOfSpinnings]="5"
  [spinDuration]="4000"
  (spinComplete)="onSpinComplete($event)">
</m-spin-wheel>
```

---

### Component Code

```typescript
import { Component } from '@angular/core';
import { WheelSector } from '@methrax/spin-wheel';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {

  wheelSectors: WheelSector[] = [
    {
      id: 1,
      label: 'Prize 1',
      color: '#ef4444'
    },
    {
      id: 2,
      label: 'Prize 2',
      color: '#22c55e'
    },
    {
      id: 3,
      label: 'Prize 3',
      color: '#3b82f6'
    },
    {
      id: 4,
      label: 'Prize 4',
      color: '#eab308'
    }
  ];


  onSpinComplete(result: WheelSector) {
    console.log('Winner:', result);
  }

}
```

---

# Component API

## Inputs

| Input               | Type            | Default   | Description                                  |
| ------------------- | --------------- | --------- | -------------------------------------------- |
| `sectors`           | `WheelSector[]` | Required  | Wheel sector configuration                   |
| `numberOfSpinnings` | `number`        | `2`       | Number of complete rotations before stopping |
| `spinDuration`      | `number`        | `5000`    | Animation duration in milliseconds           |
| `centerPinLabel`    | `string`        | undefined | Text displayed inside center pin             |
| `showCenterPin`     | `boolean`       | `false`   | Display center pin                           |

---

## Outputs

| Output         | Type          | Description                     |
| -------------- | ------------- | ------------------------------- |
| `spinStart`    | `void`        | Fired when spinning starts      |
| `spinComplete` | `WheelSector` | Fired when wheel reaches result |

---

# Public Methods

The component exposes methods that can be accessed using Angular ViewChild.

---

## Spin To Specific Result

```typescript
@ViewChild(MethraxSpinWheel)
wheel!: MethraxSpinWheel;


spinWinner() {
  this.wheel.spinToResult(2);
}
```

The wheel will rotate and stop on the sector matching the provided ID.

---

## Spin Randomly

```typescript
spinRandom() {
  this.wheel.spinRandom();
}
```

Selects a random sector and animates the wheel.

---

# Sector Model

```typescript
export interface WheelSector {

  id: string | number;

  label: string;

  color: string;

  textColor?: string;

}
```

Example:

```typescript
{
  id: "gold",
  label: "Gold Prize",
  color: "#facc15",
  textColor: "#000000"
}
```

---

# Customization

The component exposes CSS Custom Properties allowing complete theme customization.

Override tokens from the consumer application:

```css
m-spin-wheel {

  --m-wheel-size: 450px;

  --m-wheel-border-size: 8px;
  --m-wheel-border-color: #111827;

  --m-wheel-shadow:
    0 15px 40px rgba(0,0,0,0.25);


  --m-wheel-pointer-color: #dc2626;


  --m-wheel-label-font-size: 18px;
  --m-wheel-label-font-weight: 800;


  --m-wheel-center-pin-size: 80px;
  --m-wheel-center-pin-background: #ffffff;
  --m-wheel-center-pin-color: #111827;

}
```

---

# Available CSS Design Tokens

## Wheel

| Token                     | Description    |
| ------------------------- | -------------- |
| `--m-wheel-size`          | Wheel diameter |
| `--m-wheel-border-size`   | Border width   |
| `--m-wheel-border-color`  | Border color   |
| `--m-wheel-shadow`        | Wheel shadow   |
| `--m-wheel-border-radius` | Wheel radius   |

---

## Animation

| Token                                  | Description         |
| -------------------------------------- | ------------------- |
| `--m-wheel-transition-duration`        | Animation duration  |
| `--m-wheel-transition-timing-function` | CSS easing function |

---

## Pointer

| Token                      | Description      |
| -------------------------- | ---------------- |
| `--m-wheel-pointer-size`   | Pointer size     |
| `--m-wheel-pointer-color`  | Pointer color    |
| `--m-wheel-pointer-angle`  | Pointer rotation |
| `--m-wheel-pointer-shadow` | Pointer shadow   |

---

## Labels

| Token                            | Description                |
| -------------------------------- | -------------------------- |
| `--m-wheel-label-font-family`    | Label font                 |
| `--m-wheel-label-font-size`      | Label size                 |
| `--m-wheel-label-font-weight`    | Label weight               |
| `--m-wheel-label-letter-spacing` | Letter spacing             |
| `--m-wheel-label-offset`         | Label distance from center |
| `--m-wheel-label-rotation`       | Label rotation             |

---

## Center Pin

| Token                               | Description    |
| ----------------------------------- | -------------- |
| `--m-wheel-center-pin-size`         | Pin diameter   |
| `--m-wheel-center-pin-background`   | Pin background |
| `--m-wheel-center-pin-color`        | Text color     |
| `--m-wheel-center-pin-border-width` | Border size    |
| `--m-wheel-center-pin-border-color` | Border color   |
| `--m-wheel-center-pin-shadow`       | Shadow         |

---

# Browser Support

Supported browsers:

* Chrome
* Edge
* Firefox
* Safari

Requires:

```
Angular >= 17
```

---

# Architecture

The component is built using modern Angular principles:

```
MethraxSpinWheel

├── Signal Inputs
│
├── Computed State
│   ├── Slice Calculation
│   ├── Gradient Generation
│   └── Label Positioning
│
├── Animation Engine
│
├── CSS Token System
│
└── Public Component API
```

---

# Design Philosophy

The component follows these principles:

* **Configuration over modification**
* **CSS variables over style overrides**
* **Signals over RxJS for local state**
* **Standalone Angular architecture**
* **Zero dependency footprint**

---

# Development

Clone repository:

```bash
git clone https://github.com/methrax/spin-wheel.git
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm start
```

Build library:

```bash
ng build
```

---

# License

MIT License

Copyright (c) Methrax

---

# Author

**Tharaka Madhusanka @ Methrax**

Built with ❤️ using Angular 22
