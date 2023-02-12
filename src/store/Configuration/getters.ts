import { ConfigurationStateIF } from '@/interfaces'

export default {
  getAuthWebUrl (state: ConfigurationStateIF): string {
    return state.configuration.AUTH_WEB_URL
  },

  getRegHomeUrl (state: ConfigurationStateIF): string {
    return state.configuration.REGISTRY_HOME_URL
  },

  getBusinessUrl (state: ConfigurationStateIF): string {
    return state.configuration.BUSINESSES_URL
  },

  getCreateUrl (state: ConfigurationStateIF): string {
    return state.configuration.BUSINESS_CREATE_URL
  },

  getEditUrl (state: ConfigurationStateIF): string {
    return state.configuration.BUSINESS_EDIT_URL
  },

  getLegalApiUrl (state: ConfigurationStateIF): string {
    const root = state.configuration
    return root.LEGAL_API_URL + root.LEGAL_API_VERSION_2 + '/'
  },

  getAuthApiUrl (state: ConfigurationStateIF): string {
    return state.configuration.AUTH_API_URL + state.configuration.AUTH_API_VERSION + '/'
  },

  getPayApiUrl (state: ConfigurationStateIF): string {
    return state.configuration.PAY_API_URL + state.configuration.PAY_API_VERSION + '/'
  },

  getStatusApiUrl (state: ConfigurationStateIF): string {
    return state.configuration.STATUS_API_URL + state.configuration.STATUS_API_VERSION
  },

  getKeycloakConfigPath (state: ConfigurationStateIF): string {
    return state.configuration.KEYCLOAK_CONFIG_PATH
  },

  getSiteminderLogoutUrl (state: ConfigurationStateIF): string {
    return state.configuration.SITEMINDER_LOGOUT_URL
  },

  getHotJarId (state: ConfigurationStateIF): string {
    return state.configuration.HOTJAR_ID
  },

  getAddressCompleteKey (state: ConfigurationStateIF): string {
    return state.configuration.ADDRESS_COMPLETE_KEY
  },

  /** Get Launch Darkly Client ID */
  getBusinessFilingLdClientId (state: ConfigurationStateIF): string {
    return state.configuration.BUSINESS_FILING_LD_CLIENT_ID
  },

  getSentryDsn (state: ConfigurationStateIF): string {
    return state.configuration.SENTRY_DSN
  },

  getSentryEnable (state: ConfigurationStateIF): string {
    return state.configuration.SENTRY_ENABLE
  }
}
