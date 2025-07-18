import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth/auth.service";

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService:AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authService.getUser();
        if (route.data["role"].includes(user.userType)) {
            return true;
        }
        this.router.navigate(['/'], { queryParams: { error: "You are not authorised to do this function." }});
        return false;
    }
}
