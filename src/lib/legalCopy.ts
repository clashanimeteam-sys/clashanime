import type { Locale } from "@/lib/types";

type LegalSection = { heading: string; body: string };

type LegalPageCopy = {
  title: string;
  updated: string;
  sections: LegalSection[];
};

const UPDATED = "Last updated: June 20, 2026";

const copy: Record<Locale, { terms: LegalPageCopy; dmca: LegalPageCopy }> = {
  en: {
    terms: {
      title: "Terms of Use",
      updated: UPDATED,
      sections: [
        {
          heading: "Original content only",
          body: "ClashAnime is for original anime edits and creator-owned clips. Re-uploading content from YouTube, TikTok, or other platforms without rights is prohibited.",
        },
        {
          heading: "Account responsibility",
          body: "You are responsible for activity on your account and for content you upload. We may remove content, restrict uploads, or suspend accounts that violate these terms.",
        },
        {
          heading: "Moderation",
          body: "Uploads may be scanned for duplicates and suspicious patterns. Non-verified channels require manual review before clips appear publicly.",
        },
        {
          heading: "Contact",
          body: "For legal or policy questions, use the Report Content or DMCA page on ClashAnime.com.",
        },
      ],
    },
    dmca: {
      title: "DMCA / Copyright",
      updated: UPDATED,
      sections: [
        {
          heading: "Reporting infringement",
          body: "If you believe content on ClashAnime infringes your copyright, submit a notice with:\n• Your name and contact email\n• The ClashAnime video URL or ID\n• Description of the copyrighted work\n• A statement of good faith belief\n• A statement that the information is accurate",
        },
        {
          heading: "Counter-notice",
          body: "If your content was removed in error, you may submit a counter-notice with the same details and a statement under penalty of perjury that removal was mistaken.",
        },
        {
          heading: "Repeat infringers",
          body: "Accounts that repeatedly upload infringing content may be permanently banned.",
        },
      ],
    },
  },
  ja: {
    terms: {
      title: "利用規約",
      updated: "最終更新: 2026年6月20日",
      sections: [
        {
          heading: "オリジナルコンテンツのみ",
          body: "ClashAnimeはオリジナルのアニメ編集と制作者自身のクリップ向けです。YouTube、TikTokなどからの無権限再アップロードは禁止です。",
        },
        {
          heading: "アカウントの責任",
          body: "アカウント上の活動とアップロード内容はユーザー自身の責任です。規約違反のコンテンツは削除、アップロード制限、またはアカウント停止の対象となります。",
        },
        {
          heading: "審査",
          body: "アップロードは重複や疑わしいパターンのスキャン対象です。未認証チャンネルは公開前に手動審査が必要です。",
        },
        {
          heading: "お問い合わせ",
          body: "法務・ポリシーに関する問い合わせは、Report Content または DMCA ページをご利用ください。",
        },
      ],
    },
    dmca: {
      title: "DMCA / 著作権",
      updated: "最終更新: 2026年6月20日",
      sections: [
        {
          heading: "侵害の報告",
          body: "ClashAnime上のコンテンツが著作権を侵害している場合、以下を含む通知を送信してください:\n• 氏名と連絡先メール\n• ClashAnimeの動画URLまたはID\n• 著作物の説明\n• 誠実な信念に基づく声明\n• 情報が正確である旨の声明",
        },
        {
          heading: "反論通知",
          body: "誤って削除された場合、同様の情報と誤削除である旨の声明を添えて反論通知を送信できます。",
        },
        {
          heading: "反復侵害者",
          body: "侵害コンテンツを繰り返しアップロードするアカウントは永久停止される場合があります。",
        },
      ],
    },
  },
  ar: {
    terms: {
      title: "شروط الاستخدام",
      updated: "آخر تحديث: 20 يونيو 2026",
      sections: [
        {
          heading: "محتوى أصلي فقط",
          body: "ClashAnime مخصص للمقاطع الأصلية ومونتاج الأنime. يُمنع إعادة رفع محتوى من YouTube أو TikTok أو منصات أخرى دون حقوق.",
        },
        {
          heading: "مسؤولية الحساب",
          body: "أنت مسؤول عن نشاط حسابك وعن المحتوى الذي ترفعه. قد نحذف المحتوى أو نقيّد الرفع أو نوقف الحسابات المخالفة.",
        },
        {
          heading: "المراجعة",
          body: "قد تُفحص المقاطع للتكرار والأنماط المشبوهة. القنوات غير الموثّقة تحتاج مراجعة يدوية قبل الظهور للعامة.",
        },
        {
          heading: "التواصل",
          body: "للأسئلة القانونية، استخدم صفحة الإبلاغ عن المحتوى أو DMCA على ClashAnime.com.",
        },
      ],
    },
    dmca: {
      title: "DMCA / حقوق النشر",
      updated: "آخر تحديث: 20 يونيو 2026",
      sections: [
        {
          heading: "الإبلاغ عن انتهاك",
          body: "إذا اعتقدت أن محتوى على ClashAnime ينتهك حقوقك، أرسل بلاغاً يتضمن:\n• اسمك وبريدك\n• رابط أو معرّف الفيدio\n• وصف العمل المحمي\n• بيان good faith\n• بيان بدقة المعلومات",
        },
        {
          heading: "إشعار مضاد",
          body: "إذا حُذف محتواك بالخطأ، يمكنك إرسال إشعار مضاد مع نفس التفاصيل وبيان أن الحذف كان خطأ.",
        },
        {
          heading: "المخالفون المتكررون",
          body: "الحسابات التي ترفع محتوى مسروقاً بشكل متكرر قد تُحظر نهائياً.",
        },
      ],
    },
  },
};

export function getTermsCopy(locale: Locale): LegalPageCopy {
  return copy[locale]?.terms ?? copy.en.terms;
}

export function getDmcaCopy(locale: Locale): LegalPageCopy {
  return copy[locale]?.dmca ?? copy.en.dmca;
}
