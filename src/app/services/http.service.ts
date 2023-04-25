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

    return this.http.get<ApiResponse<Game>>(`https://api.rawg.io/api/games?key=${env.API_KEY}`, { params: params });
    
  }


  getGameDetailsFromHttp(id: string): Observable<Game> {

    const gameInfoRequest = this.http.get(`https://api.rawg.io/api/games/${id}?key=${env.API_KEY}`);

    const gameTrailersRequest = this.http.get(`https://api.rawg.io/api/games/${id}/movies?key=${env.API_KEY}`);

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