export type KycCountry = {
  code: string;
  dialCode: string;
  flag: string;
  nameEn: string;
  nameAr: string;
  nameJa: string;
};

export const KYC_COUNTRIES: KycCountry[] = [
  { code: "SA", dialCode: "+966", flag: "🇸🇦", nameEn: "Saudi Arabia", nameAr: "السعودية", nameJa: "サウジアラビア" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", nameEn: "United Arab Emirates", nameAr: "الإمارات", nameJa: "UAE" },
  { code: "EG", dialCode: "+20", flag: "🇪🇬", nameEn: "Egypt", nameAr: "مصر", nameJa: "エジプト" },
  { code: "JO", dialCode: "+962", flag: "🇯🇴", nameEn: "Jordan", nameAr: "الأردن", nameJa: "ヨルダン" },
  { code: "KW", dialCode: "+965", flag: "🇰🇼", nameEn: "Kuwait", nameAr: "الكويت", nameJa: "クウェート" },
  { code: "QA", dialCode: "+974", flag: "🇶🇦", nameEn: "Qatar", nameAr: "قطر", nameJa: "カタール" },
  { code: "BH", dialCode: "+973", flag: "🇧🇭", nameEn: "Bahrain", nameAr: "البحرين", nameJa: "バーレーン" },
  { code: "OM", dialCode: "+968", flag: "🇴🇲", nameEn: "Oman", nameAr: "عُمان", nameJa: "オマーン" },
  { code: "IQ", dialCode: "+964", flag: "🇮🇶", nameEn: "Iraq", nameAr: "العراق", nameJa: "イラク" },
  { code: "LB", dialCode: "+961", flag: "🇱🇧", nameEn: "Lebanon", nameAr: "لبنان", nameJa: "レバノン" },
  { code: "SY", dialCode: "+963", flag: "🇸🇾", nameEn: "Syria", nameAr: "سوريا", nameJa: "シリア" },
  { code: "PS", dialCode: "+970", flag: "🇵🇸", nameEn: "Palestine", nameAr: "فلسطين", nameJa: "パレスチナ" },
  { code: "MA", dialCode: "+212", flag: "🇲🇦", nameEn: "Morocco", nameAr: "المغرب", nameJa: "モロッコ" },
  { code: "DZ", dialCode: "+213", flag: "🇩🇿", nameEn: "Algeria", nameAr: "الجزائر", nameJa: "アルジェリア" },
  { code: "TN", dialCode: "+216", flag: "🇹🇳", nameEn: "Tunisia", nameAr: "تونس", nameJa: "チュニジア" },
  { code: "LY", dialCode: "+218", flag: "🇱🇾", nameEn: "Libya", nameAr: "ليبيا", nameJa: "リビア" },
  { code: "SD", dialCode: "+249", flag: "🇸🇩", nameEn: "Sudan", nameAr: "السودان", nameJa: "スーダン" },
  { code: "YE", dialCode: "+967", flag: "🇾🇪", nameEn: "Yemen", nameAr: "اليمن", nameJa: "イエメン" },
  { code: "TR", dialCode: "+90", flag: "🇹🇷", nameEn: "Turkey", nameAr: "تركيا", nameJa: "トルコ" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", nameEn: "United States", nameAr: "الولايات المتحدة", nameJa: "アメリカ" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", nameEn: "United Kingdom", nameAr: "بريطانيا", nameJa: "イギリス" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪", nameEn: "Germany", nameAr: "ألمانيا", nameJa: "ドイツ" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷", nameEn: "France", nameAr: "فرنسا", nameJa: "フランス" },
  { code: "IT", dialCode: "+39", flag: "🇮🇹", nameEn: "Italy", nameAr: "إيطاليا", nameJa: "イタリア" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸", nameEn: "Spain", nameAr: "إسبانيا", nameJa: "スペイン" },
  { code: "NL", dialCode: "+31", flag: "🇳🇱", nameEn: "Netherlands", nameAr: "هولندا", nameJa: "オランダ" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦", nameEn: "Canada", nameAr: "كندا", nameJa: "カナダ" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺", nameEn: "Australia", nameAr: "أستراليا", nameJa: "オーストラリア" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵", nameEn: "Japan", nameAr: "اليابان", nameJa: "日本" },
  { code: "KR", dialCode: "+82", flag: "🇰🇷", nameEn: "South Korea", nameAr: "كوريا الجنوبية", nameJa: "韓国" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳", nameEn: "India", nameAr: "الهند", nameJa: "インド" },
  { code: "PK", dialCode: "+92", flag: "🇵🇰", nameEn: "Pakistan", nameAr: "باكستان", nameJa: "パキスタン" },
  { code: "BD", dialCode: "+880", flag: "🇧🇩", nameEn: "Bangladesh", nameAr: "بنغلاديش", nameJa: "バングラデシュ" },
  { code: "MY", dialCode: "+60", flag: "🇲🇾", nameEn: "Malaysia", nameAr: "ماليزيا", nameJa: "マレーシア" },
  { code: "ID", dialCode: "+62", flag: "🇮🇩", nameEn: "Indonesia", nameAr: "إندونيسيا", nameJa: "インドネシア" },
  { code: "PH", dialCode: "+63", flag: "🇵🇭", nameEn: "Philippines", nameAr: "الفلبين", nameJa: "フィリピン" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷", nameEn: "Brazil", nameAr: "البرازيل", nameJa: "ブラジル" },
  { code: "MX", dialCode: "+52", flag: "🇲🇽", nameEn: "Mexico", nameAr: "المكسيك", nameJa: "メキシコ" },
];

export const DEFAULT_KYC_COUNTRY = KYC_COUNTRIES[0]!;

export function getKycCountryByCode(code: string): KycCountry | undefined {
  return KYC_COUNTRIES.find((country) => country.code === code);
}

export function getKycCountryLabel(country: KycCountry, locale: string): string {
  if (locale === "ar") return country.nameAr;
  if (locale === "ja") return country.nameJa;
  return country.nameEn;
}

export function buildFullPhoneNumber(country: KycCountry, localNumber: string): string {
  const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  return `+${dialDigits}${digits}`;
}
