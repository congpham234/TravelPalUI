import EndpointProvider, { GoPal } from 'gopalapimodel'
import { getDefaultApiToken } from './tokenutil'
import { checkEnvVariables } from './commonutil'

// Function to create the API client with a fresh token
async function createApiClient(): Promise<GoPal> {
  const apiToken = await getDefaultApiToken()
  // Get the stage and region from environment variables safely
  const stage = process.env.REACT_APP_STAGE || ''
  const region = process.env.REACT_APP_AWS_REGION || ''
  return new GoPal({
    BASE: EndpointProvider.getEndpoint(stage, region),
    TOKEN: apiToken,
  })
}

// Encapsulate client initialization and token refresh in an async function
async function initializeApiClient() {
  checkEnvVariables(['REACT_APP_STAGE', 'REACT_APP_AWS_REGION'])
  apiClient = await createApiClient()
  scheduleTokenRefresh()
}

// Schedule token refresh every 10 minutes and recreate the apiClient
function scheduleTokenRefresh() {
  setInterval(async () => {
    try {
      console.log('Refreshing token and recreating API client...')
      apiClient = await createApiClient()
      console.log('API client refreshed successfully!')
    } catch (error) {
      console.error('Failed to refresh API client:', error)
    }
  }, 1800000) // 1800000 ms = 30 minutes
}

// Global variable to hold the API client
let apiClient: GoPal | undefined

initializeApiClient().catch((error) => {
  console.error('Failed to initialize the API client:', error)
})

// Define apiClient as an object with methods
const apiClientWrapper = {
  getBeer: async () => {
    if (!apiClient) {
      throw new Error('ApiClient is not initialized or is unavailable.')
    }
    return await apiClient.default.getBeer()
  },

  searchDestination: async (query: string) => {
    if (!apiClient) {
      throw new Error('ApiClient is not initialized or is unavailable.')
    }
    return await apiClient.default.searchDestination(query)
  },
}

export { apiClientWrapper as apiClient }
