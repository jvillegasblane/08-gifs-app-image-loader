import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-lazy-image',
  templateUrl: './lazy-image.component.html',
})
export class LazyImageComponent {
  @Input()
  public url!: string;

  @Input()
  public alt: string = '';

  public hasLoaded: boolean = false;

  ngOnInit() {
    if (!this.url) throw new Error('Image URL property is required');
  }

  onLoad(): void {
    setTimeout(() => {
      this.hasLoaded = true;
    }, 200);
  }
}
