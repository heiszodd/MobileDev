// apps/web/lib/github.ts

import { Codespace } from '@/types'

async function githubAPI(
  endpoint: string,
  accessToken: string,
  method: string = 'GET',
  body?: any
) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

export async function listCodespaces(accessToken: string): Promise<Codespace[]> {
  const data = await githubAPI('/user/codespaces', accessToken)
  return data.codespaces || []
}

export async function getCodespace(
  codespaceId: string,
  accessToken: string
): Promise<Codespace> {
  return githubAPI(`/user/codespaces/${codespaceId}`, accessToken)
}

export async function startCodespace(
  codespaceId: string,
  accessToken: string
): Promise<Codespace> {
  return githubAPI(
    `/user/codespaces/${codespaceId}/start`,
    accessToken,
    'POST'
  )
}

export async function stopCodespace(
  codespaceId: string,
  accessToken: string
): Promise<Codespace> {
  return githubAPI(
    `/user/codespaces/${codespaceId}/stop`,
    accessToken,
    'POST'
  )
}

export async function deleteCodespace(
  codespaceId: string,
  accessToken: string
): Promise<void> {
  return githubAPI(
    `/user/codespaces/${codespaceId}`,
    accessToken,
    'DELETE'
  )
}
