#!env -S deno run --allow-write --allow-read

// boilerplate の中のプロジェクト名と説明文を変更するスクリプト
// 例: ./init.ts --name hogehoge --descrpition fugafuga

import { parseArgs } from "jsr:@std/cli@~1.0.1/parse-args";
const parsedArgs = parseArgs(Deno.args);

async function processDirectory(
  dirPath: string,
  name: string,
  description: string,
) {
  for (const entry of Deno.readDirSync(dirPath)) {
    const fullPath = `${dirPath}/${entry.name}`;
    const newPath = `${dirPath}/${entry.name.replace("boilerplate", name)}`;
    if (entry.isDirectory) {
      if (entry.name === ".git") {
        continue;
      }
      if (entry.name === "node_modules") {
        continue;
      }
      await processDirectory(fullPath, name, description); // 再帰的にディレクトリを処理
      if (fullPath !== newPath) {
        await Deno.rename(fullPath, newPath);
      }
    } else if (entry.isFile) {
      if (fullPath === "./init.ts") {
        continue;
      }
      if (fullPath !== newPath) {
        await Deno.rename(fullPath, newPath);
      }
      const content = await Deno.readTextFile(newPath);
      let newContent = content.replace(/boilerplate/g, name);
      if (description) {
        newContent = newContent.replace(
          /Superpractilisticexpermientocious\.?/g,
          description,
        );
      }
      if (content !== newContent) {
        await Deno.writeTextFile(newPath, newContent);
      }
    }
  }
}

async function main() {
  const name = parsedArgs["name"]?.trim();
  const description = parsedArgs["description"]?.trim();

  if (!name) {
    console.error("No name specified");
    Deno.exit(1);
  }

  await processDirectory(".", name, description);
}

main().catch((err) => {
  console.error("An error occurred:", err);
  Deno.exit(1);
});
