import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpDebugInterceptor } from './pages/service/http-debug.interceptor';
import { appRoutes } from '../app.routes';
import { CoreModule } from './pages/auth/core/core.module';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(withInterceptors([HttpDebugInterceptor])),
        importProvidersFrom(CoreModule)
    ]
}; 




