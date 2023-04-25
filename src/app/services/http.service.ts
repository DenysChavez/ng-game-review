import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { ApiResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(
    ordering: string,
    search?: string)
    : Observable<ApiResponse<Game>> {
    
    let params = new HttpParams().set('ordering', ordering);

    if (search) {
      params = new HttpParams().set('search', search).set('ordering', ordering);
    } 

    return this.http.get<ApiResponse<Game>>(`https://api.rawg.io/api/games?key=aac98732cf3445d48ccdf07a246b3a98`, { params: params });
    
  }


  getGameDetailsFromHttp(id: string): Observable<Game> {

    const gameInfoRequest = this.http.get(`https://api.rawg.io/api/games/${id}?key=aac98732cf3445d48ccdf07a246b3a98`);

    const gameTrailersRequest = this.http.get(`https://api.rawg.io/api/games/${id}/movies?key=aac98732cf3445d48ccdf07a246b3a98`);

    return forkJoin({
      gameInfoRequest, gameTrailersRequest
    }).pipe(map((resp: any) => {
      return {
        ...resp['gameInfoRequest'],
        trailers: resp['gameTrailersRequest'].results
      }
    }))
  }
}