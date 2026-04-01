param(
  [string]$Remote = "https://github.com/CyberCodezilla/sahil_rane_portfolio.git",
  [string]$Branch = "main",
  [string]$Message = "Initial commit: add portfolio site"
)

Set-Location -Path $PSScriptRoot

try {
  if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..."
    git init | Out-Null
    git branch -M $Branch | Out-Null
  } else {
    Write-Host ".git folder found — using existing repository."
  }

  $remotes = git remote
  if (-not ($remotes -match '^origin$')) {
    Write-Host "Adding remote origin: $Remote"
    git remote add origin $Remote
  } else {
    Write-Host "Remote 'origin' already exists."
  }

  Write-Host "Staging files..."
  git add .

  # Only commit if there are staged changes
  $status = git status --porcelain
  if ($status) {
    Write-Host "Committing changes..."
    git commit -m $Message
  } else {
    Write-Host "No changes to commit."
  }

  Write-Host "Pushing to origin/$Branch..."
  git push -u origin $Branch

  Write-Host "Done. If push failed, check your GitHub permissions or authenticate (HTTPS credentials or SSH key)."
} catch {
  Write-Error "An error occurred: $_"
  exit 1
}