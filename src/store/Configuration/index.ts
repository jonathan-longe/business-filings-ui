import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { state } from './state'

/**
 * Configures and returns Vuex Store.
 */
export default {
  actions: actions,
  getters: getters,
  mutations: mutations,
  state: state
}