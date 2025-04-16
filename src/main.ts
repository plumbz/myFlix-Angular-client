import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Bootstraps the main Angular application module.
 * 
 * This is the entry point for the Angular app.
 * It initializes and launches the `AppModule` in a browser environment.
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error('Application bootstrap failed:', err));
