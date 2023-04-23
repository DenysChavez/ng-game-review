import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  public sort: string | any;
  public games: Array<Game> | any;
  private routeSub: Subscription | any;
  private gameSub: Subscription | any;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) { }
  
  ngOnInit(): void { 
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }
  
  searchGames(sort: string, search?: string) {
    this.gameSub = this.httpService.getGameList(sort, search)
      .subscribe((gameList: ApiResponse<Game>) => {
        this.games = gameList.results;
        // console.log(this.games)
      });
  }

  openGameDetails(id: string) {
    this.router.navigate(['details', id])
  }

  ngOnDestroy() {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
