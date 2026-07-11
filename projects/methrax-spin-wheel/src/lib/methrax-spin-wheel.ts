import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';

export interface WheelSector {
  id: string | number;
  label: string;
  color: string;
  textColor?: string;
}

@Component({
  selector: 'm-spin-wheel',
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
          <div class="m-wheel-sector-label-anchor" [style.transform]="labelTransforms()[i]">
            <span class="m-wheel-sector-label" [style.color]="sector.textColor || '#ffffff'">
              {{ sector.label }}
            </span>
          </div>
        }

        @if(showCenterPin()) {
          <div class="m-wheel-center-pin">{{centerPinLabel()}}</div>
        }
      </div>

    </div>
  `,
  styleUrl: "./methrax-spin-wheel.css",
})
export class MethraxSpinWheel {
  //#region Configurable Inputs
  sectors = input.required<WheelSector[]>();
  numberOfSpinnings = input<number>(2); // number of spins to animate spinning
  spinDuration = input<number>(5000); // in milliseconds
  centerPinLabel = input<string>();
  showCenterPin = input<boolean>(false);
  //#endregion

  //#region Outputs
  spinStart = output<void>();
  spinComplete = output<WheelSector>();
  //#endregion

  //#region Public Component Accessible Methods 
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
  //#endregion

  protected currentRotation = signal<number>(0);
  protected isSpinning = signal<boolean>(false);

  protected sliceAngle = computed(() => {
    const total = this.sectors().length;
    return total > 0 ? 360 / total : 360;
  });

  protected conicGradient = computed(() => {
    const items = this.sectors();
    const total = items.length;
    if (total === 0) return 'radial-gradient(circle, #cbd5e1, #94a3b8)';
    
    const angle = this.sliceAngle();
    const stops = items.map((item: { color: any; }, i: number) => 
      `${item.color} ${i * angle}deg ${(i + 1) * angle}deg`
    );
    return `conic-gradient(${stops.join(', ')})`;
  });

  protected labelTransforms = computed(() => {
    const angle = this.sliceAngle();
    return this.sectors().map((_, i) => {
      const midpointAngle = (i * angle) + (angle / 2);
      return `rotate(${midpointAngle}deg)`;
    });
  });

  private executeSpin(targetIndex: number): void {
    this.isSpinning.set(true);
    this.spinStart.emit();

    const totalSectors = this.sectors().length;
    const extraSpins = this.numberOfSpinnings() * 360;
    
    const targetAngle = (totalSectors - targetIndex) * this.sliceAngle() - (this.sliceAngle() / 2);
    
    const currentModulo = this.currentRotation() % 360;
    const nextRotation = this.currentRotation() + extraSpins + targetAngle - currentModulo;

    this.currentRotation.set(nextRotation);

    setTimeout(() => {
      this.isSpinning.set(false);
      this.spinComplete.emit(this.sectors()[targetIndex]);
    }, this.spinDuration());
  }
}