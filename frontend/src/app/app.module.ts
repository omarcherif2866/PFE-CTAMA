import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Ajoutez ceci

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { CountUpModule } from 'ngx-countup';
import { IconsService } from './components/common/icons/icons.service';
import { ContactComponent } from './components/pages/contact/contact.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { About3Component } from './components/pages/about3/about3.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavbarStyleOneComponent } from './components/common/navbar-style-one/navbar-style-one.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppLayoutModule } from './dashboard/layout/app.layout.module';
import { ProfilModule } from './dashboard/esprit/components/profil/profil.module';
import { UIkitModule } from './dashboard/esprit/components/uikit/uikit.module';
import { ClientsModule } from './dashboard/esprit/components/clients/clients.module';
import { ActualiteModule } from './dashboard/esprit/components/actualite/actualite.module';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { BlogDetailsComponent } from './components/pages/blog-details/blog-details.component';
import { PcRepairDemoComponent } from './components/pages/pc-repair-demo/pc-repair-demo.component';
import { ActualitesComponent } from './components/pages/actualites/actualites.component';
import { AutomobileComponent } from './components/pages/particulier/automobile/automobile.component';
import { HabitationComponent } from './components/pages/particulier/habitation/habitation.component';
import { AgriculteursComponent } from './components/pages/agriculteurs/agriculteurs.component';
import { GreleComponent } from './components/pages/agriculteurs/grele/grele.component';
import { IncendieComponent } from './components/pages/agriculteurs/incendie/incendie.component';
import { MultirisqueSerresComponent } from './components/pages/agriculteurs/multirisque-serres/multirisque-serres.component';
import { BetailComponent } from './components/pages/agriculteurs/betail/betail.component';
import { AgriculteurCivilComponent } from './components/pages/agriculteurs/agriculteur-civil/agriculteur-civil.component';
import { ApricoleComponent } from './components/pages/agriculteurs/apricole/apricole.component';
import { FrigoComponent } from './components/pages/agriculteurs/frigo/frigo.component';
import { PecheComponent } from './components/pages/agriculteurs/peche/peche.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AgenceComponent } from './components/pages/agence/agence.component';
import { BriseGlaceModule } from './dashboard/esprit/components/brise-glace/brise-glace.module';
import { DommageCollisionModule } from './dashboard/esprit/components/dommage-collision/dommage-collision.module';
import { ToutRisqueModule } from './dashboard/esprit/components/tout-risque/tout-risque.module';
import { GestionnaireModule } from './dashboard/esprit/components/gestionnaire/gestionnaire.module';
import { DocumentsModule } from './dashboard/esprit/components/documents/documents.module';
import { ConstatModule } from './dashboard/esprit/components/constat/constat.module';
import { SinistreModule } from './dashboard/esprit/components/sinistre/sinistre.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PcRepairDemoComponent,
    NavbarStyleOneComponent,
    ContactComponent,
    NotFoundComponent,
    ComingSoonComponent,
    About3Component,
    SignupComponent,
    SigninComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    BlogDetailsComponent,
    ActualitesComponent,
    AutomobileComponent,
    HabitationComponent,
    AgriculteursComponent,
    GreleComponent,
    IncendieComponent,
    MultirisqueSerresComponent,
    BetailComponent,
    AgriculteurCivilComponent,
    ApricoleComponent,
    FrigoComponent,
    PecheComponent,
    AgenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule,
    NgxScrollTopModule,
    IconsService,
    CountUpModule,
    HttpClientModule,
    RouterModule, // Ajoutez ceci
    ReactiveFormsModule,
    AppLayoutModule, 
    ClientsModule,
    ActualiteModule,
    ProfilModule,
    UIkitModule,
    BrowserAnimationsModule ,
    DialogModule,
    ButtonModule,
    BriseGlaceModule,
    DommageCollisionModule,
    ToutRisqueModule,
    GestionnaireModule,  
    DocumentsModule,
    ConstatModule,
    SinistreModule
  ],
  providers: [        { provide: LocationStrategy, useClass: PathLocationStrategy },
],

  bootstrap: [AppComponent]
})
export class AppModule { }
