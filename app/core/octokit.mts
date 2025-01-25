import { Octokit } from "octokit";

export const fetchRepoPackage = async (
  access_token: string,
  github_url: string,
  type: "js" | "rs"
) => {
  try {
    const octokit = new Octokit({ auth: access_token });

    // Extract owner and repo from the full GitHub URL
    const match = github_url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error("Invalid GitHub URL format.");
    }
    const [_, owner, repo] = match;

    // Fetch the content of package.json
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: type == "js" ? "package.json" : "Anchor.toml", // Path to the file in the repo
      ref: "main" // Branch name or commit SHA (optional)
    });

    // Decode Base64 content
    if (response.data && "content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );
      return JSON.stringify(content); // stringify JSON content
    } else {
      throw new Error("Failed to fetch package.json or no content available.");
    }
  } catch (error: any) {
    console.error("Error fetching package.json:", error.message);
    throw error;
  }
};

// Usage
// fetchRepoPackage(
//   "",
//   "https://github.com/Elijah699/solana-january-workshop"
// )
//   .then((res) => {
//     console.log("Package.json Content:", res);
//   })
//   .catch((err) => {
//     console.error("Error:", err.message);
//   });
