import {LegalServices} from "@/services";
import {ApiFilingIF} from "@/interfaces";

export default {
  /** get filing history from API and, if successful, add to store */
  async getFilingHistoryFromApi({commit}, businessId) {
    return new Promise((resolve, reject) => {
      // businessId could be either the businessId or the tempRegNumber
      LegalServices.fetchFilings(businessId)
        .then((response) => {
          try {
            const filings = response.data.filings as ApiFilingIF[]
            commit('setFilingHistory', filings)
          } catch (error) {
            reject(error)
          }
        })
    })
  }
}
