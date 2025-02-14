import { Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { CtaComponent } from './components/cta/cta.component';

export const routes: Routes = [
    { path: '', component: HeroComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'contact', component: CtaComponent },
  { path: '**', redirectTo: '' }
];
