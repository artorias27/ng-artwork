import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FetchData } from 'src/services/fetch-data';

export interface Pager {
  // count: number;
  data?: [ { artwork_ids: [0], title: string } ];
  pagination?: { total: number, limit: number };
  // perPage: number;
  
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() page: number = 1;
  @Input() count!: number;
  @Input() perPage!: number;
  @Output() pagerEvent = new EventEmitter<{}>();
  newPager!: any;

  constructor(private data: FetchData) { }

  ngOnInit(): void {
  }

  prevPage() {
    this.page--;
  }

  nextPage() {
    this.page++;
  }

  goToPage(n: number) {
    this.page = n;
    console.log(n);
    this.data.getCollection(n).subscribe(item => {
      console.log(item);
      this.count = item.pagination.total;
      this.perPage = item.pagination.limit;
      this.newPager = {
        count: this.count,
        perPage: this.perPage,
        data: item.data
      }
      this.pagerEvent.emit(this.newPager);
    })
  }

}
