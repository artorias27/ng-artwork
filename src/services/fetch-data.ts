import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { forkJoin, mergeMap } from 'rxjs';

const url = "https://api.artic.edu/api/v1/artworks?page=1&limit=8";

@Injectable({
    providedIn: 'root',
})

export class FetchData {
    constructor(private http: HttpClient) { }

    getCollection(page: number) {
        // return this.http.get<any>(`https://api.artic.edu/api/v1/artists?page=${page}&limit=8`).pipe(
        //     map(res => { 
        //         console.log("reques ",res);
        //         let pagination_data = {
        //             total: res.pagination.total,
        //             limit: res.pagination.limit,
        //             image_id: res.data.artwork_ids[0]
        //         } 
        //         return pagination_data;
        //     }),
        //     mergeMap(data => {
        //         const image_details = this.http.get(`https://api.artic.edu/api/v1/artworks/${data.image_id}`);
        //         const getImage = this.http.get()
        //         return forkJoin([], [])
        //     })
        // );
        return this.http.get<any>(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=8`);
    }

    

}