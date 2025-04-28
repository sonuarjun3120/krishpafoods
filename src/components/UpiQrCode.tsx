
import React, { useEffect, useRef } from "react";
import { QrCode } from "lucide-react";

interface UpiQrCodeProps {
  amount: number;
  upiId: string;
  merchantName?: string;
}

const UpiQrCode = ({ amount, upiId, merchantName = "Krishpa Homemade Pickles" }: UpiQrCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        // Import QRCode.js only on client-side
        const QRCodeLib = await import("qrcode");
        
        if (qrRef.current) {
          // Clear previous QR code
          qrRef.current.innerHTML = "";
          
          // Format the UPI URL with transaction details
          const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Krishpa Pickles order`)}`;
          
          // Generate QR code on canvas
          await QRCodeLib.toCanvas(qrRef.current, upiUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF"
            }
          });
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateQrCode();
  }, [amount, upiId, merchantName]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-md shadow-sm border">
        <div ref={qrRef} className="flex justify-center">
          {/* QR code will be rendered here */}
          <div className="flex items-center justify-center h-[200px] w-[200px] bg-gray-100">
            <QrCode size={72} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Scan to pay ₹{amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500">UPI ID: {upiId}</p>
        <p className="text-xs text-gray-500 mt-1">Or use UPI app to pay</p>
      </div>
    </div>
  );
};

export default UpiQrCode;
