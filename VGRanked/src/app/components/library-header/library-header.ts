import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-library-header',
  standalone: true,
  imports: [],
  templateUrl: './library-header.html',
  styleUrl: './library-header.css',
})
export class LibraryHeader {
  @Input() eyebrow = 'EXPLORA Y DESCUBRE';
  @Input() title = '';
  @Input() description = '';
  @Input() count = 0;
  @Input() countLabel = 'elementos encontrados';
}

