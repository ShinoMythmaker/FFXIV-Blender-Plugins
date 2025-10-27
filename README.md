# FFXIV Blender Plugins Master Repository

A curated collection of Blender plugins for Final Fantasy XIV modding and asset management. This repository serves as a central hub that automatically aggregates information from multiple plugin repositories.

## Installation

You can install Aetherblend using Blender's new Repository feature for easy updates.

1. In Blender, go to **Edit > Preferences > Get Extensions**
2. Select the **Repositories** Drop-down-menu (top right)
3. Click "**Add Remote Repository**"
4. Paste the following URL for the repo:
   ```
   https://raw.githubusercontent.com/ShinoMythmaker/FFXIV-Blender-Plugins/refs/heads/main/repo.json
   ```
6. Click **Check for Updates on Startup**.
7. Click **Create**.
8. Search for Aetherblend and install.

Blender will now keep Aetherblend up to date automatically!

<img width="705" height="299" alt="image" src="https://github.com/user-attachments/assets/b4bb6db9-a31b-441f-9c28-601fc93b21fe" />




### Current Plugins:
- **MekTools** - v1.9.3 by Shino Mythmaker
- **AetherBlend** - v0.0.8 by Shino Mythmaker
- **Yet Another Addon** - v1.0.4 by Aleks
- **Meddle Tools** - v0.1.2 by PassiveModding

For detailed information about each plugin including download links, compatibility, and features, check the `repo.json` file.



### Adding Your Repository

**Option 1: Repository with repo.json (Recommended)**

1. Create a `repo.json` file in your repository root with the following structure:
```json
{
  "name": "Your Plugin Name",
  "description": "Brief description of your plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "category": "utility",
  "blender_version_min": "3.0.0",
  "download_url": "https://github.com/owner/repo/releases/latest/download/addon.zip",
  "install_instructions": "Installation instructions",
  "tags": ["ffxiv", "blender", "plugin"]
}
```

2. Add your repository to `repo-links.json`:
```json
{
  "name": "Your Plugin Name",
  "repository": "owner/repository-name",
  "description": "Brief description",
  "category": "utility",
  "repo_json_url": "https://raw.githubusercontent.com/owner/repository-name/main/repo.json"
}
```

**Option 2: Standalone Repository**

Add your repository to `standalone-repos.json` with complete metadata:
```json
{
  "name": "Your Plugin Name",
  "repository": "owner/repository-name",
  "description": "Brief description",
  "category": "utility",
  "author": "Your Name",
  "version": "1.0.0",
  "blender_version_min": "3.0.0",
  "download_url": "https://github.com/owner/repo/releases/latest/download/addon.zip",
  "install_instructions": "Installation instructions",
  "tags": ["ffxiv", "blender", "plugin"]
}
```

### repo.json Schema

```json
{
  "name": "string (required)",
  "description": "string (required)", 
  "version": "string (required)",
  "author": "string (required)",
  "category": "import|export|utility|animation|material|other",
  "blender_version_min": "string (e.g., '3.0.0')",
  "blender_version_max": "string (optional)",
  "download_url": "string (direct download link)",
  "homepage": "string (optional)",
  "documentation": "string (optional)",
  "install_instructions": "string",
  "tags": ["array", "of", "strings"],
  "license": "string (optional)",
  "dependencies": ["array", "of", "dependencies"]
}
```

## 🤝 Contributing

1. **Adding Plugins**: Submit a PR with additions to `repo-links.json` or `standalone-repos.json`

## 📜 License

This master repository is licensed under [MIT License](LICENSE.md).

Individual plugins retain their respective licenses - check each plugin's repository for specific licensing information.

---

*This repository is automatically updated every 6 hours, on new releases, or when repository files are modified. Last update information is available in `repo.json`.*
