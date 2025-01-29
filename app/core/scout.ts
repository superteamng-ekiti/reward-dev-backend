import toml from "@iarna/toml";
import { awardPointsJS, awardPointsRS } from "../utils/globals";
import UserSchema, { IJavascript, IRust } from "../Schema/User.schema";

interface CargoToml {
  dependencies?: Record<string, string | object>;
}
// testing

export const scout = async (
  type: "rs" | "js",
  git_url: string,
  stringified_document: string,
  last_checked: Date,
  points: number,
  id: string
): Promise<IJavascript | IRust> => {
  try {
    if (type == "js") {
      let package_json;
      try {
        package_json = JSON.parse(stringified_document);
      } catch (error) {
        throw new Error("Invalid JSON document provided: " + error);
      }

      const scoutData = {
        "@reown/appkit": !!package_json.dependencies?.["@reown/appkit"],
        "@reown/appkit-adapter-solana":
          !!package_json.dependencies?.["@reown/appkit-adapter-solana"],
        "@solana/wallet-adapter-wallets":
          !!package_json.dependencies?.["@solana/wallet-adapter-wallets"],
        "@solana/web3.js": !!package_json.dependencies?.["@solana/web3.js"],
        "@solana/spl-token": !!package_json.dependencies?.["@solana/spl-token"],
        "@solana/wallet-adapter-base":
          !!package_json.dependencies?.["@solana/wallet-adapter-base"],
        "@solana/wallet-adapter-react":
          !!package_json.dependencies?.["@solana/wallet-adapter-react"],
        "@solana/wallet-adapter-react-ui":
          !!package_json.dependencies?.["@solana/wallet-adapter-react-ui"]
      };

      const javascript_interface: IJavascript = {
        git_url,
        last_checked,
        package_json: scoutData,
        points
      };

      const points_awarded = awardPointsJS(javascript_interface);
      if (!points_awarded || typeof points_awarded !== "object") {
        throw new Error("Invalid points_awarded structure.");
      }

      if (points_awarded.points == 0) throw "no points awarded";

      const user = await UserSchema.findById(id);
      const user_js_scouts = user?.current_scout?.javascript || [];

      const existing_scout = user_js_scouts.findIndex(
        (e) => e.git_url === git_url
      );

      if (existing_scout !== -1) {
        user_js_scouts[existing_scout] = points_awarded;
      } else {
        user_js_scouts.push(points_awarded);
      }

      const new_user_scout = await UserSchema.findByIdAndUpdate(
        id,
        { "current_scout.javascript": user_js_scouts },
        { new: true }
      );

      const saved_scout = new_user_scout?.current_scout?.javascript?.findIndex(
        (e) => e.git_url === git_url
      );

      console.log(saved_scout);
      await doCalculatePoints(id);

      if (saved_scout !== -1) {
        if (new_user_scout?.current_scout.javascript) {
          return new_user_scout?.current_scout.javascript[saved_scout || 0];
        }
      } else {
        throw new Error("Something went wrong assigning your JS points.");
      }
    } else if (type == "rs") {
      const cargo_toml: CargoToml = toml.parse(stringified_document);

      console.log("========");
      console.log(cargo_toml.dependencies);
      const dependencies = cargo_toml.dependencies || {};

      const scoutData = {
        solana_sdk: !!dependencies["solana_sdk"],
        anchor_lang: !!dependencies["anchor_lang"],
        spl_token: !!dependencies["spl_token"]
      };

      let rust_interface: IRust = {
        git_url,
        last_checked,
        cargo_toml: scoutData,
        points
      };

      const points_awarded = awardPointsRS(rust_interface);
      if (!points_awarded || typeof points_awarded !== "object") {
        throw new Error("Invalid points_awarded structure.");
      }

      if (points_awarded.points == 0) throw "no points awarded";

      const user = await UserSchema.findById(id);
      const user_rs_scouts = user?.current_scout?.rust || [];

      const existing_scout = user_rs_scouts.findIndex(
        (e) => e.git_url === git_url
      );

      if (existing_scout !== -1) {
        user_rs_scouts[existing_scout] = points_awarded;
      } else {
        user_rs_scouts.push(points_awarded);
      }

      const new_user_scout = await UserSchema.findByIdAndUpdate(
        id,
        { "current_scout.rust": user_rs_scouts },
        { new: true }
      );

      const saved_scout = new_user_scout?.current_scout?.rust?.findIndex(
        (e) => e.git_url === git_url
      );
      console.log(saved_scout);

      await doCalculatePoints(id);

      if (saved_scout !== -1) {
        if (new_user_scout?.current_scout.rust) {
          return new_user_scout?.current_scout.rust[saved_scout || 0];
        }
      } else {
        throw new Error("Something went wrong assigning your RS points.");
      }
    }

    throw new Error("Invalid language type: must be 'rs' or 'js'.");
  } catch (error) {
    console.error("Error in scout function:", error);
    throw new Error("Error occurred: " + error);
  }
};

const doCalculatePoints = async (id: string) => {
  const user_details = await UserSchema.findById(id);
  if (!user_details) {
    throw new Error("User not found");
  }

  let total_points = 0;

  const user_packages_js = user_details?.current_scout?.javascript || [];
  const user_packages_rs = user_details?.current_scout?.rust || [];

  // Process JavaScript packages asynchronously
  for (const e of user_packages_js) {
    total_points += await processPointsAsync(e.points); // Example of async logic
  }

  // Process Rust packages asynchronously
  for (const f of user_packages_rs) {
    total_points += await processPointsAsync(f.points); // Example of async logic
  }

  console.log("user total points ", total_points);

  // Update the user's total points
  return await UserSchema.findByIdAndUpdate(id, { points: total_points });
};

// Example of an asynchronous function for processing points (if needed)
const processPointsAsync = async (points: number): Promise<number> => {
  // Simulate some async processing, e.g., fetching additional data
  return new Promise((resolve) => setTimeout(() => resolve(points), 10)); // Simulate delay
};

const json = {
  name: "superteam-ekiti-fun",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc -b && vite build",
    lint: "eslint .",
    preview: "vite preview"
  },
  dependencies: {
    "@radix-ui/react-slot": "^1.1.1",
    "@reown/appkit": "^1.6.4",
    "@reown/appkit-adapter-solana": "^1.6.4",
    "@reown/appkit-adapter-wagmi": "^1.6.4",
    "@solana/wallet-adapter-wallets": "^0.19.32",
    "@tanstack/react-query": "^5.64.1",
    "@tanstack/react-table": "^8.20.6",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    "lucide-react": "^0.473.0",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.3",
    "react-router-dom": "^7.1.3",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    viem: "^2.22.9",
    "vite-plugin-svgr": "^4.3.0",
    wagmi: "^2.14.8",
    zustand: "^5.0.3"
  },
  devDependencies: {
    "@eslint/js": "^9.17.0",
    "@types/node": "^22.10.7",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    autoprefixer: "^10.4.20",
    eslint: "^9.17.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    globals: "^15.14.0",
    postcss: "^8.5.1",
    tailwindcss: "^3.4.17",
    typescript: "~5.6.2",
    "typescript-eslint": "^8.18.2",
    vite: "^6.0.5"
  }
};

// console.log("testing package_json");
// console.log(
//   scout(
//     "js",
//     "urllrrl",
//     JSON.stringify(json),
//     new Date(),
//     20,
//     "679271e318dff2447abac93d"
//   )
//     .then((res) => console.log(res))
//     .catch((error) => console.log("errrr " + error))
// );

const tomll = `[package]
name = "superteam-ekiti-fun"
version = "0.0.0"
authors = ["Your Name <youremail@example.com>"]
edition = "2021"
publish = false

[dependencies]
solana-program = "1.9.9"
anchor_lang = "4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
borsh = "0.9.0"
thiserror = "1.0"
solana_sdk = "2.3.5"

[dev-dependencies]
solana-test-validator = "1.9.9"
mockall = "0.10"`;

// console.log("testing toml");
// console.log(
//   scout("rs", "urllrrddl", tomll, new Date(), 20, "679271e318dff2447abac93d")
//     .then((res) => console.log(res))
//     .catch((error) => console.log("errrr " + error))
// );
