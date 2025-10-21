# Moving Finora Project to a New Location

Since your OneDrive storage limit has been reached, follow these steps to move the project:

## Option 1: Move to Local Disk (Recommended)

### Step 1: Choose New Location
Pick a location with enough space:
- `C:\Projects\finora` (Local drive - fastest)
- `D:\finora` (External drive if available)
- `E:\Development\finora` (Any local drive with space)

### Step 2: Move the Project

```powershell
# 1. Open PowerShell as Administrator

# 2. Navigate to your current project location
cd "C:\Users\saini\OneDrive\Documents\finora"

# 3. Copy the entire project to new location
Copy-Item -Path "." -Destination "C:\Projects\finora" -Recurse -Force

# Verify it copied successfully
Get-ChildItem -Path "C:\Projects\finora" | head -5

# 4. Remove from OneDrive
Remove-Item -Path "C:\Users\saini\OneDrive\Documents\finora" -Recurse -Force
```

### Step 3: Update Git Remote (if needed)

```powershell
cd "C:\Projects\finora"
git remote -v  # Should show your GitHub remote
```

### Step 4: Open in VS Code

```powershell
code "C:\Projects\finora"
```

## Option 2: Move to External Drive

```powershell
# Similar process but to external drive
Copy-Item -Path "C:\Users\saini\OneDrive\Documents\finora" -Destination "E:\finora" -Recurse -Force
```

## Important Notes

✅ **Git history is preserved** - All your commits and history stay intact
✅ **No code changes needed** - Just moving the folder location
✅ **Node modules will be large** - If you copied `node_modules/`, you can delete it and run `npm install` again
✅ **Local env files preserved** - `.env.local` will move with the project

## Recommended Path

**Move to:** `C:\Projects\finora`

This gives you:
- Fast local disk access
- Plenty of space
- No OneDrive sync slowdown
- Professional development setup

## After Moving

1. Update VS Code workspace settings if needed
2. Update any batch/PowerShell scripts with new path
3. Test that `npm run build` still works
4. Verify Git still works: `git status`

---

Let me know which location you want to move to, and I'll help you execute the move!
