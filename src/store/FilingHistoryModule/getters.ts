import {ApiFilingIF, FilingHistoryStateInterface} from "@/interfaces";

export default {
  getFilings (state: FilingHistoryStateInterface): ApiFilingIF[] {
    return state.filings
  },

  countFilings (state: FilingHistoryStateInterface) {
    return state.filings.length
  },


}
