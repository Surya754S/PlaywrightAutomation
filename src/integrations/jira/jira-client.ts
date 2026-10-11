import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env';

type JiraIssueResponse = { key: string };
type JiraSearchResponse = { issues: JiraIssueResponse[] };

const document = (text: string) => ({
  type: 'doc',
  version: 1,
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: text.slice(0, 20_000) }],
  }],
});

export class JiraClient {
  private readonly baseUrl = env.jira.baseUrl.replace(/\/$/, '');
  private readonly authorization = `Basic ${Buffer.from(
    `${env.jira.email}:${env.jira.token}`,
  ).toString('base64')}`;

  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rest/api/3${endpoint}`, {
      method,
      headers: {
        Authorization: this.authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Jira ${method} ${endpoint} returned ${response.status}`);
    }
    return (response.status === 204 ? undefined : await response.json()) as T;
  }

  async findOpenIssue(fingerprint: string): Promise<string | undefined> {
    const jql = `project = "${env.jira.projectKey}" AND labels = "${fingerprint}" AND statusCategory != Done`;
    const result = await this.request<JiraSearchResponse>('POST', '/search/jql', {
      jql,
      fields: ['key'],
      maxResults: 1,
    });
    return result.issues[0]?.key;
  }

  async createIssue(summary: string, details: string, fingerprint: string): Promise<string> {
    const result = await this.request<JiraIssueResponse>('POST', '/issue', {
      fields: {
        project: { key: env.jira.projectKey },
        issuetype: { name: env.jira.issueType },
        summary: summary.slice(0, 250),
        description: document(details),
        labels: ['automation', 'playwright', fingerprint],
      },
    });
    return result.key;
  }

  async addComment(issueKey: string, text: string): Promise<void> {
    await this.request('POST', `/issue/${encodeURIComponent(issueKey)}/comment`, {
      body: document(text),
    });
  }

  async attach(issueKey: string, filePath: string): Promise<void> {
    const contents = new Uint8Array(await readFile(filePath));
    const form = new FormData();
    form.append('file', new Blob([contents]), path.basename(filePath));
    const response = await fetch(
      `${this.baseUrl}/rest/api/3/issue/${encodeURIComponent(issueKey)}/attachments`,
      {
        method: 'POST',
        headers: {
          Authorization: this.authorization,
          'X-Atlassian-Token': 'no-check',
        },
        body: form,
      },
    );
    if (!response.ok) {
      throw new Error(`Jira attachment upload returned ${response.status}`);
    }
  }
}