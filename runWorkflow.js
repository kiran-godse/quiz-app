const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    // Step 1: Get Latest Source Release Info
    const baseUrl = 'https://api.github.com/repos/your/repo';
    const releaseSuffix = 'releases/latest';
    const commitsSuffix = 'commits';

    let tag;
    let version;
    let timestamp;

    await exec.exec(`curl -L -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" "${baseUrl}/${releaseSuffix}"`, [], {
      listeners: {
        stdout: (data) => {
          tag = data.toString();
        },
      },
    });

    version = JSON.parse(tag).tag_name || 'main';
    core.setOutput('version', version);
    console.log(`version=${version}`);

    if (!version) {
      await exec.exec(`curl -L -H "Accept: application/vnd.github+json" -H "Authorization: Bearer your_token" -H "X-GitHub-Api-Version: 2022-11-28" "${baseUrl}/${commitsSuffix}"`, [], {
        listeners: {
          stdout: (data) => {
            const commits = JSON.parse(data.toString());
            timestamp = commits[0].commit.committer.date;
          },
        },
      });
    } else {
      timestamp = JSON.parse(tag).published_at;
    }

    core.setOutput('published_at', timestamp);
    console.log(`published_at=${timestamp}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
