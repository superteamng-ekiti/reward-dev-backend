import axios from "axios"

export const fetchRepoPackage = async ({
  access_token,
  github_url,
  type
}: {
  access_token: string
  github_url: string
  type: "js" | "rs"
}) => {
  // Extract owner and repo from the full GitHub URL
  const match = github_url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error("Invalid GitHub URL format.")
  
  const [_, owner, repo] = match
  const fileName = type === "js" ? "package.json" : "Anchor.toml"

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    )

    const content = Buffer.from(response.data.content, "base64").toString("utf-8")
    return JSON.stringify(content)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching repo package:", error.response?.data || error.message)
      throw new Error(`Failed to fetch ${fileName}: ${error.response?.data?.message || error.message}`)
    }
    throw error
  }
}

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
