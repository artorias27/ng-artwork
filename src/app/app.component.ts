import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FetchData } from 'src/services/fetch-data';
import { SpinnerService } from 'src/services/spinner.service';

export interface Artwork {
    id: number;
    title: string;
    date_start: number;
    date_end: number;
    category_titles: [];
    style_title: string;
    material_titles: [];
    style_titles: [];
    image_id: string;
    artist_title: string;
    place_of_origin: string;
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    page: number = 1;
    count!: number;
    perPage!: number;
    collection: Artwork[] = [];

    selectOptions: any[] = [];
    selectedItems: any[] = [];
    copyCollection!: any[];

    constructor(private data: FetchData, public spinner: SpinnerService) {
    }

    ngOnInit() {
        this.data.getCollection(this.page).subscribe(item => {
            console.log(item);
            this.count = item.pagination.total;
            this.perPage = item.pagination.limit;
            // get Artwork data
            this.collection = this.mapArtWorks(item.data);
            this.copyCollection = [...this.collection];
            this.selectOptions = this.getOptions(this.collection);
            // console.log('options ', this.selectOptions);
        })
    }

    // get Specific Fields 
    mapArtWorks(artworks: any[]): Artwork[] {
        return artworks.map(artwork => ({
            id: artwork.id,
            title: artwork.title,
            date_start: artwork.date_start,
            date_end: artwork.date_end,
            category_titles: artwork.category_titles,
            style_title: artwork.style_title,
            material_titles: artwork.material_titles,
            style_titles: artwork.style_titles,
            image_id: artwork.image_id,
            artist_title: artwork.artist_title,
            place_of_origin: artwork.place_of_origin
        }))
    }

    getOptions(options: any[]) {
        let arr; let modOptions: any[] = [];
        let fetchedOptions: any[] = []; let dupli_Obj: any = {};
        let categories; let counts;
        // put all category_titles into One array
        options.forEach(styles => {
            if (!!styles.category_titles) {
                arr = [...styles.category_titles];
                for (let i = 0; i < arr.length; i++) {
                    fetchedOptions.push(arr[i]); // eg..['painting','pencil','pen']
                }
            }
        })
        console.log('fetched ', fetchedOptions)
        fetchedOptions.forEach(ele => {     
            dupli_Obj[ele] = (dupli_Obj[ele] || 0) + 1;     // { 'pen': 2, 'pencil': 3, 'painting': 1 }
        })
        // let obj = fetchedOptions.reduce((total, value) => {
        //     return { ...total, [value]: ([value] || 0 + 1) }
        // }, {})
        console.log('temp', dupli_Obj);
        categories = Object.keys(dupli_Obj);
        counts = Object.values(dupli_Obj);
        for (let i = 0; i < categories.length; i++) { // push into array with desired fields
            modOptions.push({ value: categories[i], label: `${categories[i]} (${counts[i]})` });
        }
        console.log('modOptions ', modOptions)
        return modOptions
    }

    onSelection(e: any) {
        this.collection = [...this.copyCollection];
        this.collection = this.collection.filter(artwork => {
            return e.some((ele: string, i: number, arr: []) => {
                return artwork.category_titles.includes(arr[i])
            })
        })
        // if nothing is selected, Repopulate the array with original data
        if(this.collection.length === 0) this.collection = [...this.copyCollection]
        console.log('mult ', this.collection)
    }

    prevPage() {
        this.page--;
        this.goToPage(this.page)
    }

    nextPage() {
        this.page++;
        this.goToPage(this.page)
    }

    goToPage(n: number) {
        // get data and modoptions from other page
        this.page = n;
        this.data.getCollection(n).subscribe(item => {
            console.log(item);
            this.count = item.pagination.total;
            this.perPage = item.pagination.limit;
            this.collection = this.mapArtWorks(item.data);
            this.copyCollection = [...this.collection];
            this.selectOptions = this.getOptions(this.collection);
        })
    }
}

