import { Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { TestimonialsComponent } from './components/legal/testimonials/testimonials.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { CtaComponent } from './components/cta/cta.component';
import { PrivacidadComponent } from './components/legal/privacidad/privacidad.component';
import { TerminosComponent } from './components/legal/terminos/terminos.component';
import { AdminComponent } from './components/admin/admin.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { LlmComponent } from './components/llm/llm.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginPageComponent } from './components/auth/login-page.component';
import { IaComponent } from './components/ia/ia.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'contact', component: CtaComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'terminos', component: TerminosComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  { path: 'mapa', component: MapaComponent},
  { path: 'llm', component: LlmComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'ia', component: IaComponent },
  { path: '**', redirectTo: '' }
];
