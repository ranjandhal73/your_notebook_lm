import { NextRequest, NextResponse } from "next/server";
import path from "path";
// import { IncomingForm } from "formidable";
import {promises as fsPromises} from "fs";
// import { promisify } from "util";

// Required to parse form-data
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type");

  // Case 1: JSON body (for website / youtube links)
  if (contentType?.includes("application/json")) {
    try {
      const { data, type } = await req.json();

      if (!data || !type) {
        return NextResponse.json(
          { success: false, message: "Missing data or type" },
          { status: 400 }
        );
      }

      if (type === "website") {
        console.log("Website URL received:", data);
        // process website url
      } else if (type === "youtube") {
        console.log("YouTube URL received:", data);
        // process YouTube url
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid type for JSON input" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, message: `Processed ${type}` }, { status: 200 });
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return NextResponse.json(
        { success: false, message: "Invalid JSON format", error: String(error) },
        { status: 400 }
      );
    }
  }

  // Case 2: multipart/form-data (file upload)
  else if (contentType?.includes("multipart/form-data")) {
    try {
        const formData = await req.formData();
        console.log("FormData is:", formData);
        
        const file = formData.get("file");
        const typeField = formData.get("type");
        console.log("File is:", file)
        console.log(` _________ typeField is: ${typeField}`);

        if(!file || !(file instanceof File)){
            return NextResponse.json(
          { success: false, message: "No file uploaded" },
          { status: 400 }
        );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadsDir = "/tmp";
        const filePath = path.join(uploadsDir, file.name);
        const result = await fsPromises.writeFile(filePath, buffer)

        console.log("Array Buffer is:", arrayBuffer)
        // console.log(`Array Buffer is: ${JSON.stringify(arrayBuffer)}`)
        // console.log(`Buffer is: ${buffer}`)
        console.log(`filePath is: ${filePath}`)
        console.log("result is:", result);

        return NextResponse.json(
        { success: true, message: "File uploaded", filename: file.name, path: filePath },
        { status: 200 }
      );
    } catch (error) {
        console.error("FormData / file error:", error);
      return NextResponse.json(
        { success: false, message: "File upload failed", error: String(error) },
        { status: 500 }
      );
    }
  }

  // Invalid content type
  return NextResponse.json(
    { success: false, message: "Unsupported content type" },
    { status: 415 }
  );
}
