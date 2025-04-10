import { BuildTool } from './build-tool.enum';
import { Framework } from './framework.enum';

export enum Ressources {
  ESLINT = 'https://eslint.org/',
  ESLINT_ANGULAR = 'https://github.com/angular-eslint/angular-eslint',
  ESLINT_REACT = 'https://www.npmjs.com/package/eslint-plugin-react',
  ESLINT_VUE = 'https://eslint.vuejs.org/user-guide/',
}

export const frameworkToRessourcesMap = new Map<Framework, Ressources>([
  [Framework.NONE, Ressources.ESLINT],
  [Framework.ANGULAR, Ressources.ESLINT_ANGULAR],
  [Framework.REACT, Ressources.ESLINT_REACT],
  [Framework.VUE, Ressources.ESLINT_VUE],
]);

export enum RessourcesBuildTool {
  NX = 'https://nx.dev/nx-api/eslint',
}

export const buildToolToRessourcesMap = new Map<BuildTool, RessourcesBuildTool | undefined>([
  [BuildTool.NX, RessourcesBuildTool.NX],
  [BuildTool.NONE, undefined]
]);
