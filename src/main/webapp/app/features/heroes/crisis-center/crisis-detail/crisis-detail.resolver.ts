import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';

import { RESTService } from '../../../../core/services/rest.service';
import { Crisis } from '../../../../core/store/crisis/crisis.model';
import { slices } from '../../../../core/store/util';

@Injectable()
export class CrisisDetailResolver implements Resolve<Crisis> {
    constructor(private dataService: RESTService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Crisis> {
        const id = route.params['id'];

        return this.dataService.getEntity(slices.CRISIS, id).toPromise().then((crisis) => {
            if (crisis) {
                return crisis;
            } else { // id not found
                this.router.navigate(['/crisis-center']);
                return null;
            }
        });
    }
}
