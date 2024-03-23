import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./manage/manage.component";
import { UploadComponent } from "./upload/upload.component";
import { AngularFireAuthGuard, redirectUnauthorizedTo } from "@angular/fire/compat/auth-guard";

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')

const routes: Routes = [
  {
    path: 'manage',
    title: 'Manage Uploads | Clipz',
    component: ManageComponent,
    data: {
      authOnly: true, // This can be used on components that should only be seen when logged in, so when the user logs out they are redirected, but if on the About pageetc., public pages, keep them there when they log out
      authGuardPipe: redirectUnauthorizedToHome
    },
    canActivate: [AngularFireAuthGuard] //adds Firebases's authentication guard, so that unauthorised users cannot access this specic route / component
  },
  {
    path: 'upload',
    title: 'Upload a video! | Clipz',
    component: UploadComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    },
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'manage-clips',
    redirectTo: 'manage'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
