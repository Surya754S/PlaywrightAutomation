import 'dotenv/config';

const read = (key: string, fallback = ''): string => process.env[key] ?? fallback;

export const env = {
  baseUrl:
    read('PLAYWRIGHT_BASE_URL') || read('BASE_URL', 'https://automationexercise.com'),
  apiUrl:
    read('PLAYWRIGHT_API_URL') || read('API_URL', 'https://automationexercise.com'),
  apiIgnoreHttpsErrors: read('PLAYWRIGHT_API_IGNORE_HTTPS_ERRORS') === 'true',
  isCI: Boolean(process.env.CI),
  github: {
    runId: read('GITHUB_RUN_ID'),
    serverUrl: read('GITHUB_SERVER_URL'),
    repository: read('GITHUB_REPOSITORY'),
    refName: read('GITHUB_REF_NAME', 'local'),
  },
  jira: {
    enabled: read('JIRA_ENABLED') === 'true',
    baseUrl: read('JIRA_BASE_URL'),
    email: read('JIRA_EMAIL'),
    token: read('JIRA_API_TOKEN'),
    projectKey: read('JIRA_PROJECT_KEY'),
    issueType: read('JIRA_ISSUE_TYPE', 'Bug'),
  },
};