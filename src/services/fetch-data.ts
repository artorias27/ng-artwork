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
        return this.http.get<any>(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=8`).pipe(
            map(res => {
                return {
                    pagination: res.pagination,
                    data: res.data
                }
            })
        );
    }

    

}