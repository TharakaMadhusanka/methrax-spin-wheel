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
      `${item.color} ${i * step}deg ${(i + 1) * step}deg`
    );
    return `conic-gradient(${stops.join(', ')})`;
  });

  // Computes the perfectly balanced midpoint rotation angle for each text wrapper
  protected labelTransforms = computed(() => {
    const step = this.sliceAngle();
    return this.sectors().map((_, i) => {
      const midpointAngle = (i * step) + (step / 2);
      return `rotate(${midpointAngle}deg)`;
    });
  });

  public spinToResult(winningId: string | number): void {
    if (this.isSpinning()) return;

    const index = this.sectors().findIndex(s => s.id === winningId);
    if (index === -1) {
      console.warn(`Sector ID "${winningId}" not found.`);
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