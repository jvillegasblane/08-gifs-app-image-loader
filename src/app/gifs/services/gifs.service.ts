import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_BASE_URL = 'https://api.giphy.com/v1/gifs';
const GIPHY_API_KEY = 'XrjP4YakCxmjQSLQ4FkQX6RZaDk3qrbp';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagsHistory: string[] = [];
  public gifsList: Gif[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    // To lowercase to prevent misscases
    tag = tag.toLowerCase();

    // When a tag is inserted and already exists then
    if (this._tagsHistory.includes(tag)) {
      // Remove the old tag and keep the rest
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    // Add the new tag to the first element of the array
    this._tagsHistory.unshift(tag);

    // Always keep a history o maximum ten elements
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    const temp = localStorage.getItem('history');
    if (temp) {
      this._tagsHistory = JSON.parse(temp);
      if (this._tagsHistory.length !== 0) {
        this.searchTag(this._tagsHistory[0]);
      }
    }
  }

  public searchTag(tag: string): void {
    if (tag.length !== 0) {
      this.organizeHistory(tag);

      const giphyParams = new HttpParams()
        .set('api_key', GIPHY_API_KEY)
        .set('q', tag)
        .set('limit', 10);

      this.http
        .get<SearchResponse>(`${GIPHY_API_BASE_URL}/search`, {
          params: giphyParams,
        })
        .subscribe((resp) => {
          this.gifsList = resp.data;

          // console.log('🐧 ~ GifsService ~ .subscribe ~ resp.data:', resp.data);
        });
    }
  }
}
