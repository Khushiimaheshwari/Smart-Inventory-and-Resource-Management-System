import QRCode from "qrcode";
import Assets from "../../../models/Asset";

export async function generateQRCodeForAsset(assetId, baseUrl) {
  const asset = await Assets.findById(assetId)
    .populate("PC_Name")
    .populate("Lab_Name");

  if (!asset) throw new Error("Asset not found");

  if (!asset.PC_Name._id) throw new Error("Asset PC reference missing");

  const qrPayload = {
    admin: `${baseUrl}/adminPanel/asset_management/asset/${asset.PC_Name._id}`,
    faculty: `${baseUrl}/facultyPanel/allAssets/asset/${asset.PC_Name._id}`,
    lab_technician: `${baseUrl}/lab_technicianPanel/asset_management/asset/${asset.PC_Name._id}`
  };

  const encoded = Buffer.from(JSON.stringify(qrPayload)).toString("base64");

  // QR code will open this universal redirect page
  const qrValue = `${baseUrl}/qrRedirect?data=${encoded}`;

  const qrImage = await QRCode.toDataURL(qrValue);

  asset.QR_Code = qrImage;
  await asset.save();

  return qrImage;
}