import {ApiFilingIF, FilingHistoryStateInterface} from "@/interfaces";

export default {
  setFilingHistory (state: FilingHistoryStateInterface, filings: Array<ApiFilingIF>) {
    state.filings = filings
  },
}
