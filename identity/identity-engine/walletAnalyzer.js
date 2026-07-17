import nodemailer from 'nodemailer';

// إعداد الناقل (استخدم كلمة مرور التطبيق من Google)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'abcd efgh ijkl mnop' // كلمة مرور التطبيق الخاصة بك
  }
});

export async function alertIfHighRisk(sybilScore, wallet) {
  if (sybilScore > 0.8) { // إذا كان خطر الـ Sybil مرتفع
    await transporter.sendMail({
      from: '"Sovereign Identity Engine" <your-email@gmail.com>',
      to: "your-email@gmail.com",
      subject: "⚠️ تنبيه: نشاط مشبوه مكتشف!",
      text: `المحفظة ${wallet} لديها تقييم خطر بنسبة ${sybilScore}`
    });
    console.log("تم إرسال التنبيه بنجاح!");
  }
}
