import QRCode from "qrcode";
import Assets from "../../../models/Asset";

export async function generateQRCodeForAsset(assetId, baseUrl) {
  const asset = await Assets.findById(assetId)
    .populate("PC_Name")
    .populate("Lab_Name");

  if (!asset) throw new Error("Asset not found");
  console.log(asset.PC_Name._id);

  const qrValue = `${baseUrl}/adminPanel/asset_management/asset/${asset.PC_Name._id}`;
  const qrImage = await QRCode.toDataURL(qrValue);

  asset.QR_Code = qrImage;
  await asset.save();

  return qrImage;
}
