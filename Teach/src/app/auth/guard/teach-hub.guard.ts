import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const teachHubGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log(route?.url)
  if (authService.isAuthenticated()) {
    // Vérifiez si route.url et route.url[0] sont définis avant d'accéder à path
    const firstRoutePath = route?.url?.[0]?.path;
    console.log(route?.url?.[0]?.path)

    if (firstRoutePath && localStorage.getItem("role") === "etudiant" && (
      firstRoutePath === "cours/add" ||
      firstRoutePath === "cours/update" ||
      firstRoutePath === "devoirs/add" ||
      firstRoutePath === "sous-groupe" ||
      firstRoutePath === "etudiants")) {
        
      console.log("3");
      router.navigate(['/auth/login']);
      return false;
    } else {
      return true;
    }
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
}
