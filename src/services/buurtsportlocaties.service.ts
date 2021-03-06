import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SportCategory } from './../models/enums';
import { Location } from './../models/location';

@Injectable()
export class BuurtsportLocatiesService {
	private apiUrl: string = 'https://datatank.stad.gent/4/cultuursportvrijetijd/buurtsportlocaties.json';

	constructor(private http: Http) {}

	getBuursportLocaties(sport: SportCategory): Promise<Location[]> {
		const filter = this.getFilter(sport);
		return this.http.get(this.apiUrl)
						.toPromise()
						.then(response => {
							return response.json().features
										   .filter((f: any) => f.properties.Sport === filter)
										   .map((f: any) => this.convertToLocation(f));
						})
						.catch(this.handleError);
	}

	getFilter(sport: SportCategory): string {
		switch (sport) {
			case SportCategory.Basketball:
				return 'Basketbal';
			case SportCategory.Pingpong:
				return 'Pingpong';
			case SportCategory.Football:
				return 'Buurtvoetbal';
			case SportCategory.Fitness:
				return 'Fitnesstoestellen';
			case SportCategory.Skate:
				return 'Skate';
			case SportCategory.Volleyball:
				return 'Volleybal';
			default:
				return '';
		}
	}

	convertToLocation(json: any): Location {
		const id = json.id;	
		const name = json.properties.Naam;	
		const sport = this.getSportCategory(json.properties.Sport);
		const coordinates = json.geometry.coordinates;
		const lat = coordinates[1];
		const long = coordinates[0];
		return new Location(id, name, sport, { lat, long });
	}

	getSportCategory(sport: string): SportCategory {
		switch(sport) {
			case 'Basketbal':
				return SportCategory.Basketball;
			case 'Pingpong':
				return SportCategory.Pingpong;
			case 'Buurtvoetbal':
				return SportCategory.Football;
			case 'Fitnesstoestellen':
				return SportCategory.Fitness;
			case 'Skate':
				return SportCategory.Skate;
			case 'Volleybal':
				return SportCategory.Volleyball;
		}
	}

	handleError(error: any) {
		console.log('Error occured: ', error);
		return Promise.reject(error.message || error);
	}
}
