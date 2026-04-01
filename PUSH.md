# How to push this project to GitHub (Windows)

This repository already includes a helper script `push_to_github.ps1` to initialize the repo, add a remote, commit, and push.

Run from the project root `c:\Users\Win10\Desktop\PORTFOLIO`.

PowerShell (recommended):

```powershell
# If you get an ExecutionPolicy error, run PowerShell as Administrator once and allow script execution for this session:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# Then run the script
.\push_to_github.ps1
```

Notes:
- The script uses HTTPS remote by default. If you prefer SSH, edit the `$Remote` parameter at the top of `push_to_github.ps1`.
- You will be prompted for credentials if using HTTPS, or the push will use your SSH key if configured.
- If a remote named `origin` already exists, the script will not overwrite it — update or remove the existing remote manually if needed:

```powershell
git remote remove origin
# then re-run the script
.\push_to_github.ps1
```

If you'd like, I can:
- Update the script to accept an SSH remote as a parameter.
- Run additional checks (lint or basic HTML validation) before committing.
- Help connect the repo to Vercel after you push.
