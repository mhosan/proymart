import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions, RequestInfo } from 'angular-in-memory-web-api';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

	createDb() {
		let tasks = [
			{ id: 1, text: 'Task #1', start_date: '2024-04-15 00:00', duration: 3, progress: 0.6 },
			{ id: 2, text: 'Task #2', start_date: '2024-04-18 00:00', duration: 3, progress: 0.4 }
		];
		let links = [
			{ id: 1, source: 1, target: 2, type: '0' }
		];
		return { tasks, links };
	}
	// Forzar siempre la cabecera Content-Type: application/json
	responseInterceptor(response: ResponseOptions, requestInfo: RequestInfo): ResponseOptions {
		response.headers = (response.headers instanceof HttpHeaders ? response.headers : new HttpHeaders());
		response.headers = response.headers.set('Content-Type', 'application/json');
		return response;
	}
}

