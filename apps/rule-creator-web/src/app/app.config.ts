import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { NgxsActionsExecutingModule } from '@ngxs-labs/actions-executing';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { RuleCreatorState } from './state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      NgxsModule.forRoot([RuleCreatorState], {
        developmentMode: true,
      })
    ),
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: false,
      })
    ),
    importProvidersFrom(NgxsActionsExecutingModule.forRoot()),
    importProvidersFrom(NgxsFormPluginModule.forRoot()),
    provideHttpClient(),
  ],
};
