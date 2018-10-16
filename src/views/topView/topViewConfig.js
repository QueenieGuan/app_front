import TopViewType from '../../common/topViewType';

export const ViewTemplate = {
  NONE: 'none',
  HOME: 'home'
}

export default {
  [TopViewType.INIT]: {
    viewName: 'init',
    template: ViewTemplate.HOME
  },
  [TopViewType.FUNCTION_CARD]: {
    viewName: 'functionCard',
    template: ViewTemplate.HOME
  },
  [TopViewType.MINE]: {
    viewName: 'mine',
    template: ViewTemplate.HOME
  },
  [TopViewType.GRID_SELECT]: {
    viewName: 'gridSelect',
    template: ViewTemplate.HOME
  },
  [TopViewType.LAZY_LOAD_LIST]: {
    viewName: 'lazyLoadList',
    template: ViewTemplate.HOME
  },
  [TopViewType.CANDIDATE_SELECT]: {
    viewName: 'candidateSelect',
    template: ViewTemplate.HOME
  },
  [TopViewType.HBGRID_SELECT]: {
    viewName: 'hbGridSelect',
    template: ViewTemplate.HOME
  },
  [TopViewType.LEAGUE_EVALUATE]: {
    viewName: 'leagueEvaluate',
    template: ViewTemplate.HOME
  },
  [TopViewType.REPORT]: {
    viewName: 'report',
    template: ViewTemplate.HOME
  }
}