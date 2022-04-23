import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-art-grid',
  templateUrl: './art-grid.component.html',
  styleUrls: ['./art-grid.component.css']
})
export class ArtGridComponent implements OnInit {
  @Input() spin!: boolean;
  @Input() collection!: any[];
  constructor() { }

  ngOnInit(): void {
  }

}
