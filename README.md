# @methrax/spin-wheel

An enterprise-grade, high-performance, and visually striking customizable canvas-free Fortune Spin Wheel component built natively for modern **Angular (v17+)** applications. 

Unlike legacy spin wheels that rely on massive DOM manipulation, complicated skewing matrices, or heavy HTML5 canvas rendering cycles, `@methrax/spin-wheel` utilizes native **GPU-accelerated CSS Conic Gradients** and **Angular Signals** to deliver flawless structural scaling, infinite multi-angle ticker placements, and sub-millisecond layout responsiveness.

---

## 🚀 Key Features

- **Zero Heavy DOM Nodes / Canvas Overhead:** Renders the entire segmented wheel using a single structural `conic-gradient` node element.
- **Fully Signals-Reactive Architecture:** Uses explicit, highly performant Angular Signals (`input.required`, `computed`, `signal`) for optimal change detection.
- **Universal Ticker Placement (Multi-Angle):** Place your pointer anywhere around the circular layout radius (0° to 360°) completely via CSS Design Tokens.
- **Continuous Elastic Forward Spins:** Smart continuous velocity mathematics guarantee the wheel will always speed forward seamlessly on sequential triggers rather than snapping backwards.
- **Comprehensive CSS Customization Engine:** Control every single aesthetic element (typography, spacing, borders, weights, shadows, and curve easing) directly using exposed CSS Variables.
- **ViewEncapsulation-Friendly Layout:** Built defensively with `ViewEncapsulation.None` for seamless cross-library deployments and global theme mapping.

---

## 📦 Installation

To drop the wheel into your workspace, install the package using your favorite package manager:

```bash
npm install @methrax/spin-wheel
# or
yarn add @methrax/spin-wheel
# or
pnpm add @methrax/spin-wheel

---

## 🛠️ Code Implementation

### 1. Component Interface & TypeScript (`methrax-spin-wheel.component.ts`)

```typescript
import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, ViewEncapsulation } from '@angular/core';

export interface WheelSector {
  id: string | number;
  label: string;
  color: string;
  textColor?: string;
}

@Component({
  selector: 'm-spin-wheel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="m-wheel-wrapper">
      
      <div class="m-wheel-pointer-anchor">
        <div class="m-wheel-pointer"></div>
      </div>

      <div 
        class="m-wheel-body"
        [style.background]="conicGradient()"
        [style.transform]="'rotate(' + currentRotation() + 'deg)'"
        [style.transition-duration.ms]="spinDuration()">
        
        @for (sector of sectors(); track sector.id; let i = $index) {
          <div class="m-sector-label-anchor" [style.transform]="labelTransforms()[i]">
            <span class="m-sector-label" [style.color]="sector.textColor || '#ffffff'">
              {{ sector.label }}
            </span>
          </div>
        }
      </div>

    </div>
  `,
  styleUrl: "./methrax-spin-wheel.css",
  encapsulation: ViewEncapsulation.None
})
export class MethraxSpinWheel {
  // --- Configurable Inputs (Signals) ---
  sectors = input.required<WheelSector[]>();
  spinDuration = input<number>(5000); // in milliseconds

  // --- Outputs ---
  spinStart = output<void>();
  spinComplete = output<WheelSector>();

  // --- Internal State (Signals) ---
  protected currentRotation = signal<number>(0);
  protected isSpinning = signal<boolean>(false);

  // --- Modern Computed Properties (No Skew Workarounds) ---
  protected sliceAngle = computed(() => {
    const total = this.sectors().length;
    return total > 0 ? 360 / total : 360;
  });

  // Generates the native multi-stop gradient segment background array
  protected conicGradient = computed(() => {
    const items = this.sectors();
    const total = items.length;
    if (total === 0) return 'radial-gradient(circle, #cbd5e1, #94a3b8)';
    
    const step = this.sliceAngle();
    const stops = items.map((item, i) => 
      \`\${item.color} \${i * step}deg \${(i + 1) * step}deg\`
    );
    return `conic-gradient(\${stops.join(', ')})`;
  });

  // Computes the perfectly balanced midpoint rotation angle for each text wrapper
  protected labelTransforms = computed(() => {
    const step = this.sliceAngle();
    return this.sectors().map((_, i) => {
      const midpointAngle = (i * step) + (step / 2);
      return `rotate(\${midpointAngle}deg)`;
    });
  });

  public spinToResult(winningId: string | number): void {
    if (this.isSpinning()) return;

    const index = this.sectors().findIndex(s => s.id === winningId);
    if (index === -1) {
      console.warn(`Sector ID "\${winningId}" not found.`);
      return;
    }

    this.executeSpin(index);
  }

  public spinRandom(): void {
    if (this.isSpinning()) return;

    const randomIndex = Math.floor(Math.random() * this.sectors().length);
    this.executeSpin(randomIndex);
  }

  private executeSpin(targetIndex: number): void {
    this.isSpinning.set(true);
    this.spinStart.emit();

    const totalSectors = this.sectors().length;
    const extraSpins = 5 * 360; // 5 full rotations for dramatic effect
    
    // Calculate precise angle to align chosen sector with the top pointer (0 degrees)
    const targetAngle = (totalSectors - targetIndex) * this.sliceAngle() - (this.sliceAngle() / 2);
    
    // Normalize existing rotation to keep spinning forward continuously
    const currentModulo = this.currentRotation() % 360;
    const nextRotation = this.currentRotation() + extraSpins + targetAngle - currentModulo;

    this.currentRotation.set(nextRotation);

    setTimeout(() => {
      this.isSpinning.set(false);
      this.spinComplete.emit(this.sectors()[targetIndex]);
    }, this.spinDuration());
  }
}

```

### 2. The Library Core Stylesheet (`methrax-spin-wheel.css`)

```css
:host {
  display: inline-block;
  position: relative;
  
  /* --- TOKENS & FALLBACK DEFAULTS --- */
  --m-wheel-border-size: 6px;
  --m-wheel-border-color: #222222;
  --m-wheel-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  
  --m-wheel-pointer-size: 16px;
  --m-wheel-pointer-color: #ef4444;
  --m-wheel-pointer-angle: 0deg; /* Overridable pointer anchor angle */
  
  --m-wheel-font-family: system-ui, -apple-system, sans-serif;
  --m-wheel-font-weight: 700;
  --m-wheel-font-size: 1rem;
  --m-wheel-letter-spacing: 0.5px;
  --m-wheel-timing-function: cubic-bezier(0.1, 1, 0.1, 1);
}

.m-wheel-wrapper {
  position: relative;
  width: var(--m-wheel-size, 350px);
  height: var(--m-wheel-size, 350px);
}

/* --- POINTER MATRIX --- */
.m-wheel-pointer-anchor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  display: block;
  transform-origin: center center;
  transform: rotate(var(--m-wheel-pointer-angle, 0deg));
}

.m-wheel-pointer {
  position: absolute;
  top: calc(-1 * var(--m-wheel-pointer-size, 16px));
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: var(--m-wheel-pointer-size, 16px) solid transparent;
  border-right: var(--m-wheel-pointer-size, 16px) solid transparent;
  border-top: calc(var(--m-wheel-pointer-size, 16px) * 1.75) solid var(--m-wheel-pointer-color, #ef4444);
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
}

/* --- WHEEL CONTAINER --- */
.m-wheel-body {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: var(--m-wheel-border-size, 6px) solid var(--m-wheel-border-color, #222222);
  box-shadow: var(--m-wheel-shadow, 0 8px 24px rgba(0, 0, 0, 0.15));
  transition-property: transform;
  transition-timing-function: var(--m-wheel-timing-function);
}

/* --- TEXT LABELS POSITIONING --- */
.m-sector-label-anchor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.m-sector-label {
  position: absolute;
  white-space: nowrap;
  font-family: var(--m-wheel-font-family, sans-serif);
  font-weight: var(--m-wheel-font-weight, 700);
  font-size: var(--m-wheel-font-size, 1rem);
  letter-spacing: var(--m-wheel-letter-spacing, 0.5px);
  
  /* Pushes text toward the perimeter relative to total size, then flips it outward */
  transform: translateY(calc(var(--m-wheel-size, 350px) * -0.36)) rotate(90deg);
}

```

---

## 🛠️ Usage & Consumer Integration

### 1. Registering the Standalone Component

Simply import it straight into your host application module or component metadata dependencies list:

```typescript
import { Component } from '@angular/core';
import { MethraxSpinWheel, WheelSector } from '@methrax/spin-wheel';

@Component({
  selector: 'app-rewards-dashboard',
  standalone: true,
  imports: [MethraxSpinWheel],
  templateUrl: './rewards-dashboard.component.html',
  styleUrls: ['./rewards-dashboard.component.css']
})
export class RewardsDashboardComponent {
  
  // Data array structure binding
  public prizeSectors: WheelSector[] = [
    { id: 'promo-10', label: '10% OFF', color: '#1e3a8a', textColor: '#ffffff' },
    { id: 'jackpot',  label: 'JACKPOT', color: '#b91c1c', textColor: '#fef08a' },
    { id: 'free-sh',  label: 'FREE SHIP', color: '#0d9488', textColor: '#ffffff' },
    { id: 'try-ag',   label: 'TRY AGAIN', color: '#4b5563', textColor: '#d1d5db' },
    { id: 'promo-50', label: '50% OFF', color: '#7c3aed', textColor: '#ffffff' },
    { id: 'bonus-pt', label: '100 PTS', color: '#ea580c', textColor: '#ffffff' }
  ];

  public onSpinStart(): void {
    console.log('The wheel animation context has started moving...');
  }

  public onSpinFinished(winner: WheelSector): void {
    console.log('Spin Sequence Resolved! Winner Payload Context:', winner);
    alert(`Congratulations! You won: ${winner.label}`);
  }
}

```

### 2. Declaring the Component Template

Bind your inputs, control pipelines, and completion outcome callbacks via standard Angular view elements:

```html
<div class="wheel-container">
  <m-spin-wheel 
    #wheel
    [sectors]="prizeSectors"
    [spinDuration]="4500"
    (spinStart)="onSpinStart()"
    (spinComplete)="onSpinFinished($event)">
  </m-spin-wheel>
  
  <div class="button-group">
    <button (click)="wheel.spinRandom()">Spin Randomly</button>
    
    <button (click)="wheel.spinToResult('jackpot')">Force Jackpot Win</button>
  </div>
</div>

```

---

## 🎛️ Component API Reference

### Inputs (`@Input` Signals)

| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| `sectors` | `WheelSector[]` | *Required* | An array of structural sectors dividing the wheel. Must pass at least 1 item. |
| `spinDuration` | `number` | `5000` | Total animation runtime in milliseconds from initial acceleration to full friction rest. |

### Outputs (`@Output` Event Emitters)

| Name | Event Payload Type | Description |
| --- | --- | --- |
| `spinStart` | `void` | Emitted instantly when a spin request is approved, right as animation kicks off. Useful for disabling interactive dashboards. |
| `spinComplete` | `WheelSector` | Emitted when the deceleration rotation curve hits 0 velocity, returning the winning sector data context structure. |

### Public Instance Methods

To programmatically spin the wheel, query a component reference pointer `<m-spin-wheel #wheel>` and execute either of these methods:

* **`spinRandom(): void`** Selects a random element index from your sector payload and fires an elastic multi-spin rotation sequence.
* **`spinToResult(winningId: string | number): void`** Accepts an explicit targeted slice ID value. Perfect for server-directed architectures where winning configurations are determined securely on back-end environments before execution.

---

## 🎨 Design Tokens API (CSS Variables)

`@methrax/spin-wheel` exposes an atomic suite of **CSS Custom Properties** on the element `:host` selector scope. You can override these variables globally in `styles.css` or scoped inside consumer element class contexts without requiring deep-piercing compiler properties like `::ng-deep`.

### Sizing, Borders & Deceleration Physics

| CSS Custom Variable Property | Default Fallback Value | Functional Impact Description |
| --- | --- | --- |
| `--m-wheel-size` | `350px` | Absolute dimensional width and height bounds for the rendering wheel body. |
| `--m-wheel-border-size` | `6px` | Stroke thickness line wrapping around the outer perimeter rim boundary. |
| `--m-wheel-border-color` | `#222222` | Color palette mapping applied across the outer structural layout border frame. |
| `--m-wheel-shadow` | `0 8px 24px rgba(0,0,0,0.15)` | Drop-shadow elevation context assigned down onto the complete component box layout. |
| `--m-wheel-timing-function` | `cubic-bezier(0.1, 1, 0.1, 1)` | Advanced deceleration velocity physics path matching professional friction properties. |

### Ticker Pointer Radius Metrics

| CSS Custom Variable Property | Default Fallback Value | Functional Impact Description |
| --- | --- | --- |
| `--m-wheel-pointer-size` | `16px` | Half-width size definition metric governing the arrow triangle layout. |
| `--m-wheel-pointer-color` | `#ef4444` | Aesthetic fill color painted onto the directional structural indicator arrow body. |
| `--m-wheel-pointer-angle` | `0deg` | **Absolute Angle Axis Position Offset.** Rotates and swings the indicator arrow completely around the center axis radius of the wheel frame. |

### Typography & Label Presentation

| CSS Custom Variable Property | Default Fallback Value | Functional Impact Description |
| --- | --- | --- |
| `--m-wheel-font-family` | `system-ui, sans-serif` | Font family assigned across internal text label element trees. |
| `--m-wheel-font-weight` | `700` | Font weight weight assigned across internal text label element trees. |
| `--m-wheel-font-size` | `1rem` | Font sizing layout parameter for sector text data fields. |
| `--m-wheel-letter-spacing` | `0.5px` | Visual character separation layout distance parameters. |

---

## 🚀 Theme Override Implementation Examples

### Example A: Advanced Neon Sidebar Ticker Positioning (90-Degree Shift)

Want your ticker arrow positioned flush against the absolute right center axis rather than pointing straight down from the ceiling? Simply update the `--m-wheel-pointer-angle` coordinate token:

```css
/* Inside your host application styles.css layer */
.arcade-neon-wheel {
  --m-wheel-size: 450px;
  --m-wheel-pointer-angle: 90deg;     /* Moves arrow cleanly to the 3-o'clock right edge pointing inward left */
  --m-wheel-pointer-color: #00ffff;    /* Striking Cyan ticker pointer tint */
  --m-wheel-border-color: #000000;
  --m-wheel-font-family: 'Courier New', monospace;
  --m-wheel-timing-function: cubic-bezier(0.25, 1, 0.5, 1); /* Quick elastic glide */
}

```

```html
<m-spin-wheel [sectors]="prizeSectors" class="arcade-neon-wheel"></m-spin-wheel>

```

### Example B: Rapid Inline Style Variations

For quick dynamic layout adjustments or variant split tests, pass customization properties directly over inline attributes on your template element block:

```html
<m-spin-wheel 
  [sectors]="prizeSectors"
  style="--m-wheel-size: 250px; --m-wheel-pointer-color: #be123c; --m-wheel-pointer-angle: 180deg;">
</m-spin-wheel>

```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the **Methrax Enterprise Architecture Core Group**. For bugs, implementation reviews, or core enhancement requests, please open an issue tracking card on our internal source registry.

```

```