const fs = require('fs');
const fetch = require('node-fetch');

async function fetchRepoJson(url) {
    try {
        console.log(`Fetching repo.json from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message);
        return null;
    }
}

function extractPluginInfo(pluginEntry) {
    if (pluginEntry.data && Array.isArray(pluginEntry.data)) {
        return pluginEntry.data.map(plugin => ({
            name: plugin.name,
            version: plugin.version,
            author: plugin.maintainer || plugin.author
        }));
    } else if (pluginEntry.name) {
        return [{
            name: pluginEntry.name,
            version: pluginEntry.version,
            author: pluginEntry.maintainer || pluginEntry.author
        }];
    }
    return [];
}

async function updateReadmePluginList(pluginDataArray) {
    try {
        const pluginLines = pluginDataArray.map(plugin => {
            const pluginName = plugin.website
                ? `[**${plugin.name}**](${plugin.website})`
                : `**${plugin.name}**`;
            return `- ${pluginName} - v${plugin.version} by ${plugin.maintainer || plugin.author}`;
        }).join('\n');

        const readme = fs.readFileSync('README.md', 'utf8');

        const updatedReadme = readme.replace(
            /(### Current Plugins:\n)([\s\S]*?)(\nFor detailed information)/,
            `$1${pluginLines}\n$3`
        );

        fs.writeFileSync('README.md', updatedReadme);

        console.log('📝 Updated README.md plugin list');

    } catch (error) {
        console.error('❌ Error updating README:', error);
    }
}

async function updateRepoJson() {
    try {
        const repoLinks = JSON.parse(fs.readFileSync('repo-links.json', 'utf8'));
        const standaloneRepos = JSON.parse(fs.readFileSync('standalone-repos.json', 'utf8'));

        console.log(`Processing ${repoLinks.length} linked repositories...`);
        console.log(`Processing ${standaloneRepos.length} standalone repositories...`);

        const allPluginData = [];

        for (const link of repoLinks) {
            console.log(`Processing linked repo: ${link.name}`);

            const repoData = await fetchRepoJson(link.repo_json_url);
            if (repoData && repoData.data && Array.isArray(repoData.data)) {
                allPluginData.push(...repoData.data);
            } else if (repoData && Array.isArray(repoData)) {
                allPluginData.push(...repoData);
            } else if (repoData) {
                allPluginData.push(repoData);
            }
        }

        for (const standaloneRepo of standaloneRepos) {
            if (standaloneRepo.data && Array.isArray(standaloneRepo.data)) {
                allPluginData.push(...standaloneRepo.data);
            }
        }

        const repoStructure = {
            version: "v1",
            blocklist: [],
            data: allPluginData
        };

        fs.writeFileSync('repo.json', JSON.stringify(repoStructure, null, 4));

        await updateReadmePluginList(allPluginData);

        console.log('✅ Successfully updated repo.json and README.md');
        console.log(`   Total plugins: ${allPluginData.length}`);

    } catch (error) {
        console.error('❌ Error updating repo.json:', error);
        process.exit(1);
    }
}

updateRepoJson();