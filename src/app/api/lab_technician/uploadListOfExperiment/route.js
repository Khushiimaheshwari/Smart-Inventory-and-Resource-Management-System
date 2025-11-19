import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import { connectDB } from "../../utils/db";
import { Readable } from "stream";
import SubjectList from "../../../../models/Subject_List";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "public", "ListOfExperiment_uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const originalName = path.parse(file.originalname).name.replace(/\s+/g, "_"); 
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${originalName}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

export async function POST(req) {
  await connectDB();

  const arrayBuffer = await req.arrayBuffer();
  const stream = Readable.from(Buffer.from(arrayBuffer));

  const nodeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });

  const nodeRes = {
    setHeader: () => {},
    end: () => {},
  };

  try {
    await runMiddleware(nodeReq, nodeRes, upload.single("file"));

    const subjectId = nodeReq.headers["subject-id"];
    if (!subjectId) throw new Error("Missing subject-id header");

    const fileName = nodeReq.file.filename;

    await SubjectList.findByIdAndUpdate(subjectId, {
      Experiment_List: fileName,
      Status: "uploaded",
    });

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error("File Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, 
  },
};
