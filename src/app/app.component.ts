import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchData } from 'src/services/fetch-data';
import { Pager } from './pagination/pagination.component';

// export class Artwork {
    
//     id!: number; 
//     title!: string; 
//     date_start!: number; 
//     date_end!: number;
//     style_title!: string; 
//     material_titles!: [];
//     image_id!: string;
//     artist_title!: string;
// }
export interface Artwork {
    
    id: number; 
    title: string; 
    date_start: number; 
    date_end: number;
    style_title: string; 
    material_titles: [];
    image_id: string;
    artist_title: string;
    place_of_origin: string;
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    formGroup: FormGroup;

    // page: number = 1;
    // count: number = 210;
    // perPage: number = 10;

    page: number = 1;
    count!: number;
    perPage!: number;
    collection: Artwork[] = [];
    spin: boolean = false;

    constructor(private data: FetchData) {
        this.formGroup = new FormBuilder().group({
            name: ['', Validators.required],
            items: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            consent: [false, Validators.requiredTrue],
        });
    }

    ngOnInit() {
        this.spin = true;
        this.data.getCollection(this.page).subscribe(item => {
            console.log(item);
            this.count = item.pagination.total;
            this.perPage = item.pagination.limit;
            this.collection = item.data;
            console.log('collection ', this.collection);
            this.spin = this.collection ? false : true;
        })
    }

    // prevPage() {
    //     this.page--;
    // }

    // nextPage() {
    //     this.page++;
    // }

    // goToPage(n: pager) {
    //     this.page = n;
    //     console.log(n);
    //     this.data.getCollection(n).subscribe(item => {
    //         console.log(item);
    //         this.count = item.pagination.total;
    //         this.perPage = item.pagination.limit;
    //         this.collection = item.data;
    //     })
    // }

    goToPage(nextPager: any) {
        this.spin = true;
        this.collection = nextPager.data;
        this.spin = this.collection ? false : true;
        console.log('next page ', this.collection)
    }
}

