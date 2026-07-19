import { analyzeActivity } from "./analyzer/baseActivity.js"; // تأكد من المسار
import { detectSybil } from "./analyzer/sybilDetector.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'ali@example.com', pass: 'your-app-password' }
});

export async function runFullAnalysis(walletAddress) {
    try {
        console.log(`تحليل المحفظة: ${walletAddress}`);
        const activity = await analyzeActivity(walletAddress);
        const sybil = detectSybil({ activity });

        if (sybil.score > 0.8) {
            await transporter.sendMail({
                from: '"Identity Engine" <ali@example.com>',
                to: 'ali@example.com',
                subject: "⚠️ تنبيه أمني",
                text: `المحفظة ${walletAddress} خطر: ${sybil.score}`
            });
            console.log("خطر مكتشف! تم إرسال تنبيه.");
        }
        return { score: sybil.score };
    } catch (error) {
        console.error("خطأ في المحرك:", error);
    }
}
