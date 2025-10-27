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
    // Extract plugin information from different formats
    if (pluginEntry.data && Array.isArray(pluginEntry.data)) {
        // Handle the format with data array
        return pluginEntry.data.map(plugin => ({
            name: plugin.name,
            version: plugin.version,
            author: plugin.maintainer || plugin.author
        }));
    } else if (pluginEntry.name) {
        // Handle direct plugin objects
        return [{
            name: pluginEntry.name,
            version: pluginEntry.version,
            author: pluginEntry.maintainer || pluginEntry.author
        }];
    }
    return [];
}

async function updateReadmePluginList(allPlugins) {
    try {
        // Extract all plugin information
        const pluginList = [];
        for (const entry of allPlugins) {
            const plugins = extractPluginInfo(entry);
            pluginList.push(...plugins);
        }

        // Generate the plugin list text
        const pluginLines = pluginList.map(plugin =>
            `- **${plugin.name}** - v${plugin.version} by ${plugin.author}`
        ).join('\n');

        // Read current README
        const readme = fs.readFileSync('README.md', 'utf8');

        // Replace the Current Plugins section
        const updatedReadme = readme.replace(
            /### Current Plugins:\n[\s\S]*?\n\nFor detailed information/,
            `### Current Plugins:\n${pluginLines}\n\nFor detailed information`
        );

        // Write updated README
        fs.writeFileSync('README.md', updatedReadme);
        console.log('📝 Updated README.md plugin list');

    } catch (error) {
        console.error('❌ Error updating README:', error);
    }
}

async function updateRepoJson() {
    try {
        // Read input files
        const repoLinks = JSON.parse(fs.readFileSync('repo-links.json', 'utf8'));
        const standaloneRepos = JSON.parse(fs.readFileSync('standalone-repos.json', 'utf8'));

        console.log(`Processing ${repoLinks.length} linked repositories...`);
        console.log(`Processing ${standaloneRepos.length} standalone repositories...`);

        // Create a simple array to hold all plugins
        const allPlugins = [];

        // Process linked repositories - fetch their repo.json and add to array
        for (const link of repoLinks) {
            console.log(`Processing linked repo: ${link.name}`);

            const repoData = await fetchRepoJson(link.repo_json_url);
            if (repoData && Array.isArray(repoData)) {
                // If it's an array, add each item
                allPlugins.push(...repoData);
            } else if (repoData) {
                // If it's a single object, add it
                allPlugins.push(repoData);
            }
        }

        // Process standalone repositories - add their data directly to array
        for (const standaloneRepo of standaloneRepos) {
            if (standaloneRepo.data && Array.isArray(standaloneRepo.data)) {
                // Add the data array items
                allPlugins.push({
                    version: standaloneRepo.version,
                    blocklist: standaloneRepo.blocklist,
                    data: standaloneRepo.data
                });
            } else {
                // Add the whole object if it's not in the expected format
                allPlugins.push(standaloneRepo);
            }
        }

        // Write the simple array to repo.json
        fs.writeFileSync('repo.json', JSON.stringify(allPlugins, null, 4));

        // Update README.md with current plugins
        await updateReadmePluginList(allPlugins);

        console.log('✅ Successfully updated repo.json and README.md');
        console.log(`   Total entries: ${allPlugins.length}`);

    } catch (error) {
        console.error('❌ Error updating repo.json:', error);
        process.exit(1);
    }
}

// Run the update
updateRepoJson();