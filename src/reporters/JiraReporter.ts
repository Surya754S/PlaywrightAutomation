import { createHash } from 'node:crypto';
import path from 'node:path';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { env } from '../config/env';
import { JiraClient } from '../integrations/jira/jira-client';

export default class JiraReporter implements Reporter {
  private readonly failures: Array<{ test: TestCase; result: TestResult }> = [];

  printsToStdio(): boolean {
    return false;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (test.outcome() === 'unexpected' && result.retry === test.retries) {
      this.failures.push({ test, result });
    }
  }

  async onEnd(): Promise<void> {
    if (!env.jira.enabled || this.failures.length === 0) return;

    const jira = new JiraClient();
    for (const { test, result } of this.failures) {
      try {
        await this.reportFailure(jira, test, result);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[jira] Could not report "${test.title}": ${message}`);
      }
    }
  }

  private async reportFailure(
    jira: JiraClient,
    test: TestCase,
    result: TestResult,
  ): Promise<void> {
    const relativeFile = path.relative(process.cwd(), test.location.file);
    const title = test.titlePath().slice(3).join(' > ');
    const fingerprint = `pw-${createHash('sha1')
      .update(`${relativeFile}::${title}`)
      .digest('hex')
      .slice(0, 10)}`;
    const runUrl = env.github.runId
      ? `${env.github.serverUrl}/${env.github.repository}/actions/runs/${env.github.runId}`
      : 'local run';
    const details = [
      `Test: ${title}`,
      `File: ${relativeFile}:${test.location.line}`,
      `Project: ${test.parent.project()?.name ?? 'unknown'}`,
      `Branch: ${env.github.refName}`,
      `Run: ${runUrl}`,
      '',
      result.error?.message ?? 'No error message',
    ].join('\n');

    const existingIssue = await jira.findOpenIssue(fingerprint);
    const issueKey = existingIssue
      ? existingIssue
      : await jira.createIssue(`[Automation] ${title}`, details, fingerprint);
    if (existingIssue) await jira.addComment(issueKey, details);

    for (const attachment of result.attachments) {
      if (
        attachment.path &&
        ['image/png', 'application/zip'].includes(attachment.contentType)
      ) {
        await jira.attach(issueKey, attachment.path);
      }
    }
    console.log(`[jira] ${existingIssue ? 'updated' : 'created'} ${issueKey}`);
  }
}