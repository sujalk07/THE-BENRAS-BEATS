import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateCertificatePDF(
  memberName: string,
  durationText: string
): Promise<Buffer> {
  const templateUrl = process.env.CERTIFICATE_TEMPLATE_URL!;

  const templateRes = await fetch(templateUrl);
  const templateBytes = await templateRes.arrayBuffer();

  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(templateBytes);
  const { width, height } = pngImage.scale(1);

  const page = pdfDoc.addPage([width, height]);
  page.drawImage(pngImage, { x: 0, y: 0, width, height });

  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const darkBrown = rgb(0.15, 0.08, 0.02);

  // Member Name box — approximate center position, adjust these fractions if misaligned
  const nameFontSize = Math.round(height * 0.032);
  const nameWidth = font.widthOfTextAtSize(memberName, nameFontSize);
  page.drawText(memberName, {
    x: width * 0.5 - nameWidth / 2,
    y: height * (1 - 0.6079),
    size: nameFontSize,
    font,
    color: darkBrown,
  });

  // Membership Duration box
  const durFontSize = Math.round(height * 0.028);
  const durWidth = font.widthOfTextAtSize(durationText, durFontSize);
  page.drawText(durationText, {
    x: width * 0.5 - durWidth / 2,
    y: height * (1 - 0.7589),
    size: durFontSize,
    font,
    color: darkBrown,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}