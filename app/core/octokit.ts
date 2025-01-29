// import axios from "axios";

// export const fetchRepoPackage = async ({
//   access_token,
//   github_url,
//   type
// }: {
//   access_token: string;
//   github_url: string;
//   type: "js" | "rs";
// }) => {
//   // Extract owner and repo from the full GitHub URL
//   const match = github_url.match(/github\.com\/([^/]+)\/([^/]+)/);
//   if (!match) throw new Error("Invalid GitHub URL format.");

//   const [_, owner, repo] = match;
//   const fileName = type === "js" ? "package.json" : "Anchor.toml";

//   try {
//     const response = await axios.get(
//       `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           Accept: "application/vnd.github.v3+json"
//         }
//       }
//     );

//     const content = Buffer.from(response.data.content, "base64").toString(
//       "utf-8"
//     );
//     return content;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(
//         "Error fetching repo package:",
//         error.response?.data || error.message
//       );
//       throw `Failed to fetch ${fileName}: ${
//         error.response?.data?.message || error.message
//       }`;
//     }
//     throw error;
//   }
// };

// // Usage
// // fetchRepoPackage(
// //   "",
// //   "https://github.com/Elijah699/solana-january-workshop"
// // )
// //   .then((res) => {
// //     console.log("Package.json Content:", res);
// //   })
// //   .catch((err) => {
// //     console.error("Error:", err.message);
// //   });

import axios from "axios";

export const fetchRepoPackage = async ({
  access_token,
  github_url,
  type
}: {
  access_token: string;
  github_url: string;
  type?: "js" | "rs"; // Make type optional
}) => {
  // Extract owner and repo from the full GitHub URL
  const match = github_url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error("Invalid GitHub URL format.");

  const [_, owner, repo] = match;

  try {
    // If no type is specified, fetch the dominant language of the repo
    if (!type) {
      const langResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/vnd.github.v3+json"
          }
        }
      );

      const languages = langResponse.data;
      const dominantLanguage = Object.keys(languages).reduce((a, b) =>
        languages[a] > languages[b] ? a : b
      );

      console.log(`Dominant language in the repo: ${dominantLanguage}`);

      if (["TypeScript", "JavaScript"].includes(dominantLanguage)) {
        type = "js";
      } else if (dominantLanguage === "Rust") {
        type = "rs";
      } else {
        throw new Error(
          `Unsupported dominant language: ${dominantLanguage}. Please specify a type.`
        );
      }
    }

    let fileName = type === "js" ? "package.json" : "Cargo.toml";

    // If Rust, check for Anchor.toml first
    if (type === "rs") {
      try {
        await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/Anchor.toml`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/vnd.github.v3+json"
            }
          }
        );
        console.log("Detected Anchor-based project.");
        fileName = "Anchor.toml";
      } catch {
        console.log("Anchor.toml not found, using Cargo.toml.");
      }
    }

    // Fetch the specified file
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );
    return { type, fileName, content };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching repo package:",
        error.response?.data || error.message
      );
      throw `Failed to fetch file: ${
        error.response?.data?.message || error.message
      }`;
    }
    throw error;
  }
};
