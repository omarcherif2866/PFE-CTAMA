import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { About3Component } from './components/pages/about3/about3.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { AppLayoutComponent } from './dashboard/layout/app.layout.component';
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
import { AgenceComponent } from './components/pages/agence/agence.component';

const routes: Routes = [
    { path: '', component: PcRepairDemoComponent },
    { path: 'signup', component: SignupComponent},
    { path: 'signin', component: SigninComponent},
    { path: 'index-4', component: PcRepairDemoComponent },
    { path: 'agence', component: AgenceComponent },
    { path: 'a_propos', component: About3Component },
    { path: 'blog-details/:id', component: BlogDetailsComponent },
    { path: 'coming-soon', component: ComingSoonComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'actualites', component: ActualitesComponent },
    { path: 'particuliers/assurance-automobile', component: AutomobileComponent },
    { path: 'particuliers/assurance-multirisques-habitation', component: HabitationComponent },
    { path: 'agriculteurs', component: AgriculteursComponent },
    { path: 'agriculteurs/assurance-grele', component: GreleComponent },
    { path: 'agriculteurs/assurance-incendie-recolte', component: IncendieComponent },
    { path: 'agriculteurs/assurance-mutirisques-serres', component: MultirisqueSerresComponent },
    { path: 'agriculteurs/assurance-betails', component: BetailComponent },
    { path: 'agriculteurs/assurance-responsabilite-civile-agriculteurs', component: AgriculteurCivilComponent },
    { path: 'agriculteurs/assurance-multirisques-apicole', component: ApricoleComponent },
    { path: 'agriculteurs/assurance-chambres-frigorifiques', component: FrigoComponent },
    { path: 'agriculteurs/assurance-corp-navire-de-peche', component: PecheComponent },








    { path :"forgetpassword", component :ForgotPasswordComponent},
    { path :"resetPassword/:id", component :ResetPasswordComponent},



        {
            path: '', component: AppLayoutComponent,
            children: [
                { path: 'dashboard', loadChildren: () => import('./dashboard/esprit/components/uikit/charts/chartsdemo.module').then(m => m.ChartsDemoModule) },
                { path: 'clients', loadChildren: () => import('./dashboard/esprit/components/clients/clients.module').then(m => m.ClientsModule) },
                { path: 'uikit', loadChildren: () => import('./dashboard/esprit/components/uikit/uikit.module').then(m => m.UIkitModule) },
                { path: 'profil/:id', loadChildren: () => import('./dashboard/esprit/components/profil/profil.module').then(m => m.ProfilModule) },
                { path: 'actualite', loadChildren: () => import('./dashboard/esprit/components/actualite/actualite.module').then(m => m.ActualiteModule) },
                { path: 'voiture', loadChildren: () => import('./dashboard/esprit/components/voiture/voiture.module').then(m => m.VoitureModule) },
                { path: 'constat', loadChildren: () => import('./dashboard/esprit/components/constat/constat.module').then(m => m.ConstatModule) },
                { path: 'agences', loadChildren: () => import('./dashboard/esprit/components/agence/agence.module').then(m => m.AgenceModule) },
                { path: 'brise-glaces', loadChildren: () => import('./dashboard/esprit/components/brise-glace/brise-glace.module').then(m => m.BriseGlaceModule) },
                { path: 'dommage-collision', loadChildren: () => import('./dashboard/esprit/components/dommage-collision/dommage-collision.module').then(m => m.DommageCollisionModule) },
                { path: 'tout-risque', loadChildren: () => import('./dashboard/esprit/components/tout-risque/tout-risque.module').then(m => m.ToutRisqueModule) },
                { path: 'addExpert', loadChildren: () => import('./dashboard/esprit/components/expert/expert.module').then(m => m.ExpertModule) },
                { path: 'affectExpertToClient', loadChildren: () => import('./dashboard/esprit/components/affect-expert-to-client/affect-expert-to-client.module').then(m => m.AffectExpertToClientModule) },
                { path: 'documents', loadChildren: () => import('./dashboard/esprit/components/documents/documents.module').then(m => m.DocumentsModule) },
                { path: 'sinistres', loadChildren: () => import('./dashboard/esprit/components/sinistre/sinistre.module').then(m => m.SinistreModule) },
                { path: 'image_sinistres', loadChildren: () => import('./dashboard/esprit/components/image-sinistre/image-sinistre.module').then(m => m.ImageSinistreModule) },
                { path: 'devis_sinistres', loadChildren: () => import('./dashboard/esprit/components/devis-sinistre/devis-sinistre.module').then(m => m.DevisSinistreModule) },
                { path: 'addEmplyee', loadChildren: () => import('./dashboard/esprit/components/gestionnaire/gestionnaire.module').then(m => m.GestionnaireModule) },
                { path: 'rendez-vous', loadChildren: () => import('./dashboard/esprit/components/rdv/rdv.module').then(m => m.RdvModule) },
                { path: 'expertise/:id', loadChildren: () => import('./dashboard/esprit/components/rapport-expertise/rapport-expertise.module').then(m => m.RapportExpertiseModule) },



            ]
        },

    //  { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' },




    { path: '**', component: NotFoundComponent } ,
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }