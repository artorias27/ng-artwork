import { Component, OnInit } from '@angular/core';
import { FetchData } from 'src/services/fetch-data';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SpinnerService } from 'src/services/spinner.service';

export interface Artwork {
    id: number;
    title: string;
    date_start: number;
    date_end: number;
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
    collection: any[] = [];

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
            this.collection = item.data;
            this.selectOptions = this.getOptions(this.collection);
            console.log('options ', this.selectOptions);
        })
    }

    getOptions(options: any[]) {
        let arr; let modOptions: any[] = [];
        let fetchedOptions: any[] = [];
        // get all style_titles
        options.forEach(styles => {
            if (!!styles.style_titles) {
                arr = [...styles.style_titles];
                for (let i = 0; i < arr.length; i++) {
                    fetchedOptions.push(arr[i]);
                }
            }
        })
        console.log('fetched ', fetchedOptions)
        let count = 1; let display;
        for (let i = 0; i < fetchedOptions.length; i++) {
            for (let j = i; j < fetchedOptions.length; j++) {
                // avoid self compare
                if (i !== j) {
                    if (fetchedOptions[i] === fetchedOptions[j]) {
                        count++;
                        display = `${fetchedOptions[i]} (${count})`;
                        modOptions.push({ value: fetchedOptions[i], label: display });
                    }
                    else {
                        display = `${fetchedOptions[i]} (${count})`;
                        modOptions.push({ value: fetchedOptions[i], label: display })
                    }
                }
            }
        }
        // transform to expected options[]
        let vals = modOptions.map(i => i.value);
        let filteredOptions = modOptions.filter(({ value }, index) => !vals.includes(value, index + 1));
        console.log('modOptions ', modOptions)
        return filteredOptions
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

