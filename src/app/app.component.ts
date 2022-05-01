import { Component, OnInit } from '@angular/core';
import { FetchData } from 'src/services/fetch-data';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SpinnerService } from 'src/services/spinner.service';
import { map } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

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
    dropdownList: any[] = [];
    selectedItems: any[] = [];
    dropdownSettings: IDropdownSettings = {};

    constructor(private data: FetchData, public spinner: SpinnerService) {
        this.selectedItems = [];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'value',
            textField: 'label',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: false,
            enableCheckAll: false
        };
    }

    ngOnInit() {
        this.data.getCollection(this.page).subscribe(item => {
            console.log(item);
            this.count = item.pagination.total;
            this.perPage = item.pagination.limit;
            // get Artwork data
            this.getArtWorks(item.data).subscribe(arts => {
                this.collection = arts;
                console.log('Arts', this.collection)
                this.selectOptions = this.getOptions(this.collection);
            })
            // console.log('options ', this.selectOptions);
        })
    }
    // get Specific Fields 
    getArtWorks(artworks: any[]): Observable<Artwork[]> {
        let data$ = of(artworks); // Make observable array
        return data$.pipe(map((artworks: any[]) => artworks.map(artwork => ({
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
        }))));
    }

    getOptions(options: any[]) {
        let arr; let modOptions: any[] = [];
        let fetchedOptions: any[] = []; let temp: any = {};
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
            temp[ele] = (temp[ele] || 0) + 1
        })
        console.log('temp',temp);
        categories = Object.keys(temp);
        counts = Object.values(temp);
        for(let i = 0; i < categories.length; i++) { // push into array with desired fields
            modOptions.push({ value: categories[i], label: `${categories[i]} (${counts[i]})` });
        } 
        // transform to expected options[]
        // let vals = modOptions.map(i => i.value);
        // let filteredOptions = modOptions.filter(({ value }, index) => !vals.includes(value, index + 1));
        console.log('modOptions ', modOptions)
        return modOptions
    }

    onItemSelect(item: any) {
        console.log(item);
        console.log(this.selectedItems);
        let result = [...this.collection];
        if (!!this.selectedItems) {
            this.collection = this.collection.filter(art => {
                return art.style_title === this.selectedItems[0].value
            })
        } else {
            this.collection = [...result];
        }
    }

    prevPage() {
        this.page--;
    }

    nextPage() {
        this.page++;
    }

    goToPage(n: number) {
        // get data and modoptions from other page
        this.page = n;
        this.data.getCollection(n).subscribe(item => {
            console.log(item);
            this.count = item.pagination.total;
            this.perPage = item.pagination.limit;
            this.collection = item.data;
            this.selectOptions = this.getOptions(this.collection);
        })
    }
}

