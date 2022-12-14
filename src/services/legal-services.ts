// Libraries
import axios from '@/axios-auth'
import { ApiDocumentsIF, CommentIF, DocumentIF, NameRequestIF } from '@/interfaces'
import { DigitalCredentialTypes, FilingStatus, Roles } from '@/enums'

/**
 * Class that provides integration with the Legal API.
 */
export default class LegalServices {
  /**
   * Fetches business info.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the info from the response
   */
  static async fetchBusinessInfo (businessId: string): Promise<any> {
    const url = `businesses/${businessId}`
    return axios.get(url)
  }

  /**
   * Fetches tasks list.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the tasks from the response
   */
  static async fetchTasks (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/tasks`
    return axios.get(url)
  }

  /**
   * Fetches filings list.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the filings from the response
   */
  static async fetchFilings (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/filings`
    return axios.get(url)
  }

  /**
   * Fetches addresses.
   * See also Directors.fetchDirectors().
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the addresses from the response
   */
  static async fetchAddresses (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/addresses`
    return axios.get(url)
  }

  /**
   * Fetches parties list.
   * @param businessId the business identifier (aka entity inc no)
   * @param role optional role to filter parties response
   * @returns a promise to return the parties from the response
   */
  static async fetchParties (businessId: string, role: Roles = null): Promise<any> {
    let url = `businesses/${businessId}/parties`
    if (role) url += `?role=${role}`
    return axios.get(url)
  }

  /**
   * Fetches the draft Application filing.
   * This is a unique request using the temp reg number.
   * This assumes a single filing is returned.
   * @param tempRegNumber the temporary registration number
   * @returns a promise to return the filing from the response
   */
  static async fetchDraftApp (tempRegNumber: string): Promise<any> {
    const url = `businesses/${tempRegNumber}/filings`
    return axios.get(url)
      // workaround because data is at "response.data.data"
      .then(response => response?.data)
  }

  /**
   * Fetches a Name Request.
   * @param filingId the NR number
   * @returns a promise to return the NR data from the response
   */
  static async fetchNameRequest (nrNumber: string): Promise<NameRequestIF> {
    const url = `nameRequests/${nrNumber}`
    return axios.get(url)
      // workaround because data is at "response.data.data"
      .then(response => response?.data)
  }

  /**
   * Fetches a filing.
   * @param url the full URL to fetch the filing
   * @returns a promise to return the filing from the response
   */
  static async fetchFiling (url: string): Promise<any> {
    return axios.get(url)
      .then(response => {
        const filing = response?.data?.filing
        if (!filing) {
          // eslint-disable-next-line no-console
          console.log('fetchFiling() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
        return filing
      })
  }

  /**
   * Creates (posts) a filing.
   * @param businessId the business identifier (aka entity inc no)
   * @param filing the object body of the request
   * @param isDraft whether this is a draft or whether to also file this filing
   * @returns a promise to return the filing from the response
   */
  static async createFiling (businessId: string, filing: any, isDraft: boolean): Promise<any> {
    let url = `businesses/${businessId}/filings`
    if (isDraft) {
      url += '?draft=true'
    }
    return axios.post(url, { filing })
      .then(response => {
        const filing = response?.data?.filing
        if (!filing) {
          // eslint-disable-next-line no-console
          console.log('createFiling() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
        return filing
      })
  }

  /**
   * Updates (puts) a filing.
   * @param businessId the business identifier (aka entity inc no)
   * @param filing the object body of the request
   * @param filingId the filing identifier
   * @param isDraft whether this is a draft or whether to also file this filing
   * @returns a promise to return the filing from the response
   */
  static async updateFiling (businessId: string, filing: any, filingId: number, isDraft: boolean): Promise<any> {
    let url = `businesses/${businessId}/filings/${filingId}`
    if (isDraft) {
      url += '?draft=true'
    }
    return axios.put(url, { filing })
      .then(response => {
        const filing = response?.data?.filing
        if (!filing) {
          // eslint-disable-next-line no-console
          console.log('updateFiling() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
        return filing
      })
  }

  /**
   * Fetches comments array.
   * @param url the full URL to fetch the comments
   * @returns a promise to return the comments array from the response
   */
  static async fetchComments (url: string): Promise<CommentIF[]> {
    return axios.get(url)
      .then(response => {
        const comments = response?.data?.comments
        if (!comments) {
          // eslint-disable-next-line no-console
          console.log('fetchComments() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
        return comments
      })
  }

  /**
   * Fetches documents object.
   * @param url the full URL to fetch the documents
   * @returns a promise to return the documents object from the response
   */
  static async fetchDocuments (url: string): Promise<ApiDocumentsIF> {
    return axios.get(url)
      .then(response => {
        const documents = response?.data?.documents
        if (!documents) {
          // eslint-disable-next-line no-console
          console.log('fetchDocuments() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
        return documents
      })
  }

  /**
   * Fetches a document and prompts browser to open/save it.
   * @param document the document info object
   */
  static async fetchDocument (document: DocumentIF): Promise<any> {
    // safety checks
    if (!document?.link || !document?.filename) {
      throw new Error('Invalid parameters')
    }

    const config = {
      headers: { 'Accept': 'application/pdf' },
      responseType: 'blob' as 'json'
    }

    return axios.get(document.link, config).then(response => {
      if (!response) throw new Error('Null response')

      /* solution from https://github.com/axios/axios/issues/1392 */

      // it is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const blob = new Blob([response.data], { type: 'application/pdf' })

      // use Navigator.msSaveOrOpenBlob if available (possibly IE)
      // warning: this is now deprecated
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/msSaveOrOpenBlob
      if (window.navigator && window.navigator['msSaveOrOpenBlob']) {
        window.navigator['msSaveOrOpenBlob'](blob, document.filename)
      } else {
        // for other browsers, create a link pointing to the ObjectURL containing the blob
        const url = window.URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        window.document.body.appendChild(a)
        a.setAttribute('style', 'display: none')
        a.href = url
        a.download = document.filename
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }

      return response
    })
  }

  /** Checks if the specified business has any pending tasks.
   * @param businessId the business identifier (aka entity inc no)
   * @returns True if there are any non-NEW tasks, else False
   */
  static async hasPendingTasks (businessId: string): Promise<boolean> {
    return this.fetchTasks(businessId).then(response => {
      const tasks = response?.data?.tasks || []
      return tasks.some(task => {
        if (task?.task?.filing?.header) {
          if (task.task.filing.header.status !== FilingStatus.NEW) {
            return true
          }
        }
      })
    })
  }

  /** Business Digital Credential Helpers **/

  /**
   * Fetches digital credential information.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the credentials connection data
   */
  static async fetchCredentials (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/digitalCredentials`
    return axios.get(url)
      .catch(error => {
        console.log(error.message)
      })
  }

  /**
   * Creates a digital credentials invitation.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the invitation data
   */
  static async createCredentialInvitation (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/digitalCredentials/invitation`
    return axios.post(url)
      .catch(error => {
        console.log(error.message)
      })
  }

  /**
   * Fetches a digital credentials connection information.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the credentials connection data
   */
  static async fetchCredentialConnection (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/digitalCredentials/connection`
    return axios.get(url)
      .catch(error => {
        console.log(error.message)
      })
  }

  /**
   * Issue a digital credentials offer.
   * @param businessId The business identifier (aka entity inc no)
   * @param credentialType The credential offer type
   * @returns a promise to return the credentials connection data
   */
  static async issueCredentialOffer (businessId: string, credentialType: DigitalCredentialTypes): Promise<any> {
    const url = `businesses/${businessId}/digitalCredentials/${credentialType}`
    return axios.post(url)
      .catch(error => {
        console.log(error.message)
      })
  }
}