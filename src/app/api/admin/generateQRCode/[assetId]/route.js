import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { connectDB } from "../../../utils/db";
import Assets from "../../../../../models/Asset";

export async function POST(_, { params }) {
  try {
    await connectDB();
    const { assetId } = params;

    const asset = await Assets.findById(assetId)
      .populate("PC_Name")
      .populate("Lab_Name");

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    if (!asset.PC_Name || !asset.PC_Name._id) {
      return NextResponse.json(
        { error: "Asset missing PC reference" },
        { status: 400 }
      );
    }

    if (!asset.Asset_Name) {
      return NextResponse.json(
        { error: "Asset name missing" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL;

    const qrValue = `${baseUrl}/adminPanel/asset_management/asset/${asset.PC_Name._id}`;

    const qrImage = await QRCode.toDataURL(qrValue);

    asset.QR_Code = qrImage;
    await asset.save();

    return NextResponse.json({
      success: true,
      message: "QR Code generated successfully",
      redirectURL: qrValue,
      QR_Code: qrImage,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
