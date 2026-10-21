import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export default function HomePage() {
  const html = fs.readFileSync(path.join(process.cwd(), "content/home.html"), "utf8");
  return (
    <div
      className="demo-witryna"
      data-motion="standard"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
