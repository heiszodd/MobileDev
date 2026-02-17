// apps/relay/src/auth.js

export async function validateGitHubToken(token) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      return { valid: false, error: 'Invalid token' }
    }

    const user = await response.json()
    return { valid: true, user }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

export async function getCodespaceConnection(codespaceId, token) {
  try {
    const response = await fetch(
      `https://api.github.com/user/codespaces/${codespaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      return { success: false, error: 'Codespace not found' }
    }

    const codespace = await response.json()
    return { success: true, codespace }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
