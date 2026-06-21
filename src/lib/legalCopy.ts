import type { Locale } from "@/lib/types";

type LegalSection = { heading: string; body: string };

export type LegalPageCopy = {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

const UPDATED_EN = "Last updated: June 21, 2026";
const UPDATED_AR = "آخر تحديث: 21 يونيو 2026";
const UPDATED_JA = "最終更新: 2026年6月21日";

const CONTACT_BLOCK_EN =
  "ClashAnime.com\nDesignated DMCA Agent: ClashAnime Legal\nDMCA: dmca@clashanime.com\nPrivacy: privacy@clashanime.com\nSupport: support@clashanime.com";

const CONTACT_BLOCK_AR =
  "ClashAnime.com\nالوكيل المعيّن لـ DMCA: ClashAnime Legal\nDMCA: dmca@clashanime.com\nالخصوصية: privacy@clashanime.com\nالدعم: support@clashanime.com";

type LegalBundle = {
  terms: LegalPageCopy;
  privacy: LegalPageCopy;
  community: LegalPageCopy;
  dmca: LegalPageCopy;
};

const en: LegalBundle = {
  terms: {
    title: "Terms of Use",
    updated: UPDATED_EN,
    intro:
      "These Terms govern your use of ClashAnime.com. By using the platform, you accept full responsibility for your account and uploads.",
    sections: [
      {
        heading: "1. Acceptance",
        body: "By accessing ClashAnime.com, creating an account, signing in with Google/GitHub/Facebook, or uploading content, you agree to these Terms of Use, our Privacy Policy, Community Guidelines, and DMCA Policy. If you do not agree, you must stop using the service immediately.",
      },
      {
        heading: "2. Eligibility",
        body: "You must be at least 13 years old (or the minimum digital consent age in your country). If you are under 18, you confirm that a parent or legal guardian has reviewed and approved your use of ClashAnime.",
      },
      {
        heading: "3. What ClashAnime is",
        body: "ClashAnime is a user-generated content platform for original anime duel clips and creator edits. We provide hosting, discovery, and community features. We do not claim ownership of your uploads, but we may remove content that violates these Terms or applicable law.",
      },
      {
        heading: "4. Original content only",
        body: "ClashAnime is not a re-upload site. You may not post:\n• Full episodes or scenes ripped without authorization\n• Content copied from YouTube, TikTok, Instagram, or other platforms\n• Compilations you did not create\n• Content you do not have rights to distribute\n\nUploading stolen or unauthorized content may result in immediate removal, account suspension, and legal action by rights holders.",
      },
      {
        heading: "5. Your responsibility for content",
        body: "You are solely responsible for every video, thumbnail, title, comment, Community post, attached image, and profile detail you publish. This includes:\n• Ensuring you own or have permission to use all audio, video, images, and text\n• Complying with copyright, trademark, and privacy laws in your country and ours\n• Keeping Community posts strictly anime-related as required by our Community Guidelines\n• The accuracy of titles and descriptions\n• Any harm caused by content you upload or comments you post\n\nClashAnime does not pre-screen all content before upload. Automated scans and human review reduce risk but do not eliminate it. You—not ClashAnime—bear primary legal responsibility for your uploads and posts.",
      },
      {
        heading: "6. License you grant to ClashAnime",
        body: "You retain ownership of your content. By uploading, you grant ClashAnime a non-exclusive, worldwide, royalty-free license to host, store, reproduce, transcode, display, distribute, and promote your content solely to operate, improve, and market the platform. This license ends when your content is deleted, except for reasonable backup copies and records required by law.",
      },
      {
        heading: "7. Account security",
        body: "You are responsible for:\n• Keeping your login credentials secure\n• All activity under your account\n• Notifying us promptly at support@clashanime.com if you suspect unauthorized access\n\nWe are not liable for losses caused by your failure to protect your account.",
      },
      {
        heading: "8. Prohibited conduct",
        body: "You may not:\n• Upload infringing, illegal, or harmful content\n• Harass, threaten, or dox other users\n• Use bots, fake accounts, or engagement manipulation\n• Attempt to bypass moderation, fingerprints, or security controls\n• Scrape, reverse engineer, or overload our systems\n• Impersonate others or misrepresent your affiliation\n• Use ClashAnime for spam, malware, or fraud\n• Submit false identity or payout information (KYC fraud)",
      },
      {
        heading: "9. Moderation and review",
        body: "Uploads may be fingerprinted, scanned for duplicates, and reviewed by staff. Non-verified channels typically require manual approval before clips appear publicly. Verified channels may receive faster approval when scans pass, but verification does not waive your legal responsibilities.\n\nStaff decisions (approve, reject, delete, verify, ban) are logged in our moderation audit log for accountability.",
      },
      {
        heading: "10. Our right to remove content",
        body: "We may remove, restrict, or reject any content or account at any time if we believe it violates these Terms, our guidelines, a valid DMCA notice, or poses legal or community risk. We are not obligated to host any specific content.",
      },
      {
        heading: "11. Platform disclaimer",
        body: 'ClashAnime is provided "as is" and "as available." We do not guarantee uninterrupted service, error-free uploads, or that all infringing content will be detected. User content does not reflect ClashAnime\'s views. We are not a party to disputes between users and rights holders except as required by law.',
      },
      {
        heading: "12. Limitation of liability",
        body: "To the maximum extent permitted by law, ClashAnime and its operators shall not be liable for indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or reputational harm arising from your use of the service or user content.\n\nOur total liability for any claim related to the service shall not exceed the greater of (a) USD $100 or (b) the amount you paid us in the 12 months before the claim (typically zero for free accounts).",
      },
      {
        heading: "13. Indemnification",
        body: "You agree to defend, indemnify, and hold harmless ClashAnime, its operators, and moderators from any claims, damages, losses, or expenses (including reasonable legal fees) arising from:\n• Your content or conduct\n• Your violation of these Terms\n• Your infringement of third-party rights\n• Any dispute between you and another user or rights holder",
      },
      {
        heading: "14. Copyright complaints",
        body: "Rights holders should use our DMCA process at /dmca or email dmca@clashanime.com. We respond to valid notices and may terminate repeat infringers.",
      },
      {
        heading: "15. Termination",
        body: "We may suspend or permanently ban accounts that violate these Terms, receive repeated complaints, or create legal risk. You may request account deletion via support@clashanime.com. Some records (moderation logs, DMCA notices) may be retained as required by law.",
      },
      {
        heading: "16. Changes to these Terms",
        body: "We may update these Terms. Continued use after the updated date constitutes acceptance. Material changes will be posted on this page.",
      },
      {
        heading: "17. Governing law",
        body: "These Terms are governed by applicable law in the jurisdiction where ClashAnime operates, without regard to conflict-of-law principles. Disputes should first be reported to support@clashanime.com.",
      },
      {
        heading: "18. ClashCoins payouts, KYC, and anti-fraud",
        body: "ClashCoins wallet balances may be converted from hunter points and withdrawn subject to manual review.\n\nIdentity verification (KYC):\n• One-time KYC is required per account before any payout is sent\n• You must submit your legal name, phone number, and full address\n• False, misleading, stolen, or third-party identity data is fraud and may result in balance forfeiture, payout rejection, and permanent account termination\n• We may request additional verification at any time\n\nAnti-fraud controls:\n• Unusual point gains, duplicate accounts, or mismatched payout details may trigger review or blocks\n• Payouts via bank transfer, PayPal, or USDT are processed manually, typically within 24–72 hours after approval\n• ClashAnime may refuse, delay, reverse, or report suspicious payouts to comply with law and protect users",
      },
      {
        heading: "19. Contact",
        body: `Legal and terms questions:\n${CONTACT_BLOCK_EN}`,
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: UPDATED_EN,
    intro:
      "This Privacy Policy explains how ClashAnime collects, uses, stores, and protects your information when you use clashanime.com.",
    sections: [
      {
        heading: "1. Who we are",
        body: "ClashAnime.com is an anime duel video platform. For privacy inquiries contact privacy@clashanime.com.",
      },
      {
        heading: "2. Information we collect",
        body: "Account information:\n• Email address\n• Username, display name, bio\n• Profile and banner images\n• OAuth provider (Google, GitHub, Facebook) and provider user ID\n\nContent you create:\n• Uploaded videos, thumbnails, titles\n• Comments, likes, follows, shares\n• Reports you submit\n\nUsage and technical data:\n• Views, upload timestamps, moderation status\n• Browser type, device category, language preference\n• IP address and request logs (via hosting provider)\n• Session tokens and authentication cookies\n\nLocal storage:\n• Theme (light/dark), locale, UI preferences",
      },
      {
        heading: "3. How we use your information",
        body: "We use data to:\n• Create and authenticate your account\n• Host, display, and rank videos in the feed\n• Moderate content and enforce Community Guidelines\n• Respond to reports and DMCA notices\n• Prevent abuse, spam, and duplicate re-uploads\n• Improve performance and fix bugs\n• Comply with legal obligations\n\nWe do not sell your personal information to third parties.",
      },
      {
        heading: "4. Legal bases (where applicable)",
        body: "Depending on your region, we process data based on:\n• Contract: to provide the service you requested\n• Legitimate interests: security, moderation, fraud prevention\n• Legal obligation: responding to lawful requests\n• Consent: where required for optional features",
      },
      {
        heading: "5. Third-party services",
        body: "We rely on:\n• Supabase — database, authentication, file storage\n• Vercel — website hosting and CDN\n• Google / GitHub / Facebook — OAuth sign-in\n\nThese providers process data under their own privacy policies. We choose providers with strong security practices.",
      },
      {
        heading: "6. Content moderation data",
        body: "Uploaded videos may be fingerprinted (file hash, perceptual hash, thumbnail hash) to detect duplicates and likely re-uploads. Staff moderation actions are logged with timestamp, action type, and staff ID for audit and legal compliance.",
      },
      {
        heading: "7. Data sharing",
        body: "We may share information:\n• With service providers who help operate ClashAnime\n• When required by law, court order, or valid DMCA notice\n• To protect rights, safety, and security of users and the platform\n\nWe do not share your private account data with other users except what you choose to make public (username, profile, public videos).",
      },
      {
        heading: "8. Data retention",
        body: "We retain account and content data while your account is active. When you delete content or your account, we remove it from public view. Backups may persist for a limited period. Moderation logs, abuse reports, and DMCA records may be kept longer to comply with law and prevent repeat violations.",
      },
      {
        heading: "9. Security",
        body: "We use industry-standard measures including encrypted connections (HTTPS), access controls, and row-level database security. No system is 100% secure. Report suspected breaches to privacy@clashanime.com.",
      },
      {
        heading: "10. Your rights",
        body: "Depending on your location you may have the right to:\n• Access a copy of your personal data\n• Correct inaccurate data\n• Request deletion (subject to legal retention)\n• Object to or restrict certain processing\n• Data portability (where applicable)\n\nContact privacy@clashanime.com. EU/UK users may lodge a complaint with their local data protection authority.",
      },
      {
        heading: "11. International transfers",
        body: "Your data may be processed in countries where our providers operate. We take steps to ensure appropriate safeguards where required.",
      },
      {
        heading: "12. Children",
        body: "ClashAnime is not directed at children under 13. We do not knowingly collect personal data from children under 13. Contact privacy@clashanime.com to request deletion.",
      },
      {
        heading: "13. Changes",
        body: "We may update this Privacy Policy. The \"Last updated\" date at the top reflects the latest version. Continued use after changes means you accept the updated policy.",
      },
      {
        heading: "14. Payout identity verification (KYC)",
        body: "When you request ClashCoins withdrawals we may collect and store:\n• Legal name, phone number, and mailing address\n• Optional WhatsApp contact preference\n• Payout destination details linked to your request\n\nWe use this information solely to prevent fraud, comply with legal obligations, and process payouts. Access is restricted to authorized staff. KYC records may be retained longer than general account data where required for anti-fraud, tax, or legal compliance.",
      },
      {
        heading: "15. Contact",
        body: `Privacy inquiries:\n${CONTACT_BLOCK_EN}`,
      },
    ],
  },
  community: {
    title: "Community Guidelines",
    updated: UPDATED_EN,
    intro:
      "These guidelines define acceptable behavior on ClashAnime. Community posts must be anime-related only. Violations may result in content removal or account action.",
    sections: [
      {
        heading: "1. Our mission",
        body: "ClashAnime celebrates original anime duel edits and creator-owned clips. We exist to showcase creativity—not to redistribute content from other platforms.",
      },
      {
        heading: "2. Original content only",
        body: "Upload only work you created or have explicit rights to publish. Do not:\n• Re-upload YouTube, TikTok, or Instagram videos\n• Post raw episodes or unedited scenes\n• Steal another creator's edit and claim it as yours\n• Use watermarks or credits to hide unauthorized use",
      },
      {
        heading: "3. Your legal responsibility",
        body: "Even creative edits may include copyrighted anime footage or music. You—not ClashAnime—are responsible for ensuring your upload complies with copyright and fair use rules in your jurisdiction. When in doubt, do not upload.",
      },
      {
        heading: "4. Respect the community",
        body: "Treat others with respect. Prohibited behavior includes harassment, hate speech, slurs, threats, bullying, doxing, and targeted abuse in videos, comments, usernames, or channel branding.",
      },
      {
        heading: "5. Honest presentation",
        body: "Do not use misleading titles, fake \"exclusive\" claims, or impersonation. Do not pretend to be another creator, studio, or ClashAnime staff.",
      },
      {
        heading: "6. No spam or manipulation",
        body: "Do not use bots, fake accounts, click farms, or coordinated engagement to manipulate the trending grid. Do not flood the platform with duplicate or near-duplicate uploads.",
      },
      {
        heading: "7. Safe and lawful content",
        body: "Do not upload illegal content, malware links, non-consensual imagery, or sexual content involving minors. Graphic violence must comply with applicable laws and community standards.",
      },
      {
        heading: "8. Review queue",
        body: "Uploads from non-verified channels enter manual review. Clips may be approved, rejected, or sent back for review. Verified status is earned by trust and can be revoked for violations.",
      },
      {
        heading: "9. Reporting violations",
        body: "See stolen content? Use /report with the video URL and explanation. For Community posts, use the in-post Report button or /report. Rights holders should use /dmca for formal copyright notices.",
      },
      {
        heading: "10. Community feed — anime only (mandatory)",
        body: "Every post in the Community section must relate to anime, manga, anime games, fan art, cosplay, or creator content within the anime space.\n\nStrictly prohibited in Community posts, comments, and images:\n• Political, religious, or news content unrelated to anime\n• Adult, sexual, or pornographic material of any kind\n• Gambling, scams, spam, or unrelated advertising\n• Real-world violence or gruesome content outside anime context\n• Personal drama, dating, or topics unrelated to anime\n\nBy publishing a Community post, you confirm that your text and any attached image comply with this rule. Violations may be removed without warning, reported to staff, and may lead to account restrictions or bans.",
      },
      {
        heading: "11. Consequences",
        body: "Violations may lead to:\n• Content removal\n• Upload restrictions\n• Loss of channel verification\n• Temporary suspension\n• Permanent account ban\n• Referral to rights holders or authorities where required",
      },
    ],
  },
  dmca: {
    title: "DMCA / Copyright Policy",
    updated: UPDATED_EN,
    intro:
      "ClashAnime respects intellectual property rights and responds to valid copyright notices under the DMCA and similar laws.",
    sections: [
      {
        heading: "1. Designated agent (17 U.S.C. § 512)",
        body: `ClashAnime has designated an agent to receive copyright infringement notifications:\n\n${CONTACT_BLOCK_EN}`,
      },
      {
        heading: "2. Our role",
        body: "ClashAnime is a hosting platform. We do not create user uploads. We act on valid takedown notices and maintain a repeat-infringer policy. We are not responsible for user content unless required by applicable law.",
      },
      {
        heading: "3. Takedown notice requirements",
        body: "Your written notice must include:\n• Your physical or electronic signature\n• Identification of the copyrighted work claimed to be infringed\n• The specific ClashAnime video URL or video ID\n• Your name, address, telephone, and email\n• A statement that you have a good-faith belief the use is not authorized\n• A statement, under penalty of perjury, that the information is accurate and you are authorized to act on behalf of the rights holder",
      },
      {
        heading: "4. How to submit",
        body: "Email dmca@clashanime.com with subject line \"DMCA Takedown Notice\" or use /report with all required details. Incomplete notices may delay processing.",
      },
      {
        heading: "5. Our response",
        body: "Upon receiving a valid notice, we may remove or disable access to the identified content and notify the uploader when appropriate. We log takedown actions in our moderation system.",
      },
      {
        heading: "6. Counter-notice",
        body: "If your content was removed in error, send a counter-notice to dmca@clashanime.com including:\n• Your signature\n• Identification of removed content and its location before removal\n• A statement under penalty of perjury that removal was mistaken\n• Your consent to jurisdiction of the appropriate court\n• Your contact information\n\nWe may restore content after the statutory waiting period unless the complainant files court action.",
      },
      {
        heading: "7. Repeat infringers",
        body: "Accounts that repeatedly upload infringing content may be permanently terminated.",
      },
      {
        heading: "8. False claims",
        body: "Knowingly submitting false infringement notices may expose you to liability under 17 U.S.C. § 512(f) or equivalent laws.",
      },
    ],
  },
};

const ar: LegalBundle = {
  terms: {
    title: "شروط الاستخدام",
    updated: UPDATED_AR,
    intro:
      "تحكم هذه الشروط استخدامك لـ ClashAnime.com. باستخدام المنصة، تقبل مسؤوليتك الكاملة عن حسابك وكل ما ترفعه.",
    sections: [
      {
        heading: "1. الموافقة والالتزام",
        body: "بزيارة ClashAnime.com أو إنشاء حساب أو تسجيل الدخول عبر Google/GitHub/Facebook أو رفع أي محتوى، فإنك توافق على:\n• شروط الاستخدام هذه\n• سياسة الخصوصية (/privacy)\n• إرشادات المجتمع (/community-guidelines)\n• سياسة DMCA (/dmca)\n\nإذا لم توافق، يجب التوقف عن استخدام الخدمة فوراً.",
      },
      {
        heading: "2. الأهلية",
        body: "يجب أن يكون عمرك 13 عاماً على الأقل (أو الحد الأدنى للسن في بلدك). إذا كنت دون 18 عاماً، فأنت تؤكد أن ولي أمرك أو وصيك القانوني اطلع على هذه الشروط ووافق على استخدامك للمنصة.",
      },
      {
        heading: "3. ما هي ClashAnime",
        body: "ClashAnime منصة محتوى ينشئه المستخدمون (UGC) لمقاطع anime duel وتحريرات المبدعين. نوفر الاستضافة، الاكتشاف، والتفاعل المجتمعي. لا ندّعي ملكية ما ترفعه، لكننا قد نحذف أي محتوى يخالف هذه الشروط أو القانون.",
      },
      {
        heading: "4. محتوى أصلي فقط",
        body: "ClashAnime ليست موقع re-upload. يُمنع رفع:\n• حلقات كاملة أو مشاهد مُستخرَجة دون إذن\n• محتوى منسوخ من YouTube أو TikTok أو Instagram أو منصات أخرى\n• تجميعات (compilations) لم تنشئها أنت\n• أي محتوى لا تملك حق نشره\n\nرفع محتوى مسروق أو غير مصرّح قد يؤدي إلى حذف فوري، إيقاف الحساب، وإجراءات قانونية من أصحاب الحقوق.",
      },
      {
        heading: "5. مسؤوليتك عن المحتوى",
        body: "أنت وحدك المسؤول عن كل فيديو، صورة مصغرة، عنوان، تعليق، منشور مجتمع، صورة مرفقة، ووصف قناة تنشره. تشمل مسؤوليتك:\n• التأكد أنك تملك أو لديك إذن لاستخدام الصوت والفيديو والصور والنص\n• الالتزام بقوانين حقوق النشر والعلامات التجارية والخصوصية\n• أن تكون منشورات المجتمع مرتبطة بالأنمي فقط كما تفرض إرشادات المجتمع\n• صحة العناوين والأوصاف\n• أي ضرر ينتج عن محتواك أو تعليقاتك\n\nClashAnime لا تراجع كل المحتوى قبل الرفع. المسؤولية القانونية الأساسية تقع عليك—وليس على ClashAnime—عن ما ترفعه وتنشره.",
      },
      {
        heading: "6. ترخيص المحتوى للمنصة",
        body: "تحتفظ بملكية محتواك. برفعك له، تمنح ClashAnime ترخيصاً غير حصري، عالمياً، ومجانياً لاستضافة، تخزين، نسخ، عرض، توزيع، وترويج محتواك حصراً لتشغيل المنصة وتحسينها. ينتهي الترخيص عند حذف المحتوى، باستثناء نسخ احتياطية معقولة وسجلات مطلوبة قانوناً.",
      },
      {
        heading: "7. أمان الحساب",
        body: "أنت مسؤول عن:\n• حماية بيانات تسجيل الدخول\n• كل نشاط يتم عبر حسابك\n• إبلاغنا فوراً على support@clashanime.com عند الاشتباه بوصول غير مصرّح\n\nلا نتحمل مسؤولية الخسائر الناتجة عن إهمالك في حماية حسابك.",
      },
      {
        heading: "8. سلوك محظور",
        body: "يُمنع:\n• رفع محتوى مخالف، غير قانوني، أو ضار\n• التحرش، التهديد، أو doxing\n• استخدام بوتات أو حسابات وهمية أو تلاعب بالتفاعل\n• تجاوز المراجعة أو البصمات أو أنظمة الأمان\n• scraping أو reverse engineering أو إرهاق الخوادم\n• انتحال شخصية الآخرين\n• spam أو malware أو احتيال\n• تقديم معلومات هوية أو سحب مزيفة (احتيال KYC)",
      },
      {
        heading: "9. المراجعة والاعتماد",
        body: "قد تُبصَم الرفوعات وتُفحص للتكرار وتُراجع من قبل الفريق. القنوات غير الموثّقة تحتاج عادة موافقة يدوية قبل الظهور للعامة. القنوات الموثّقة قد تحصل على موافقة أسرع عند نجاح الفحص، لكن التوثيق لا يلغي مسؤوليتك القانونية.\n\nقرارات الفريق (موافقة، رفض، حذف، توثيق، حظر) تُسجَّل في سجل المراجعة (/admin/moderation-log) للشفافية.",
      },
      {
        heading: "10. حقنا في إزالة المحتوى",
        body: "يجوز لنا حذف أو تقييد أو رفض أي محتوى أو حساب في أي وقت إذا خالف هذه الشروط، أو الإرشادات، أو إشعار DMCA صالح، أو يشكّل خطراً قانونياً أو مجتمعياً. لسنا ملزمين باستضافة أي محتوى محدد.",
      },
      {
        heading: "11. إخلاء مسؤولية المنصة",
        body: 'تُقدَّم ClashAnime "كما هي" و"حسب التوفر". لا نضمن خدمة دون انقطاع، أو رفعاً خالياً من الأخطاء، أو اكتشاف كل محتوى مخالف. محتوى المستخدمين لا يعكس آراء ClashAnime. لسنا طرفاً في نزاعات بين المستخدمين وأصحاب الحقوق إلا حيث يقتضي القانون.',
      },
      {
        heading: "12. حدود المسؤولية",
        body: "إلى أقصى حد يسمح به القانون، لا تتحمل ClashAnime ومشغّلوها مسؤولية الأضرار غير المباشرة أو العرضية أو الخاصة أو التبعية، بما في ذلك فقدان الأرباح أو البيانات أو السمعة الناتج عن استخدامك للخدمة أو محتوى المستخدمين.\n\nالحد الأقصى لمسؤوليتنا الإجمالية عن أي مطالبة لا يتجاوز الأكبر بين (أ) 100 دولار أمريكي أو (ب) ما دفعته لنا خلال 12 شهراً السابقة (عادة صفر للحسابات المجانية).",
      },
      {
        heading: "13. التعويض",
        body: "توافق على الدفاع عن ClashAnime ومشغّليها ومشرفيها وتعويضهم عن أي مطالبات أو أضرار أو خسائر أو مصاريف (بما في ذلك أتعاب محاماة معقولة) ناتجة عن:\n• محتواك أو سلوكك\n• مخالفتك لهذه الشروط\n• انتهاكك لحقوق طرف ثالث\n• أي نزاع بينك وبين مستخدم آخر أو صاحب حقوق",
      },
      {
        heading: "14. بلاغات حقوق النشر",
        body: "على أصحاب الحقوق استخدام /dmca أو مراسلة dmca@clashanime.com. نستجيب للإشعارات الصالحة وقد نوقف المخالفين المتكررين.",
      },
      {
        heading: "15. إنهاء الحساب",
        body: "قد نوقف أو نحظر حسابك مؤقتاً أو نهائياً عند مخالفة الشروط، أو تكرار الشكاوى، أو إنشاء مخاطر قانونية. يمكنك طلب حذف الحساب عبر support@clashanime.com. قد نحتفظ بسجلات المراجعة وإشعارات DMCA كما يقتضي القانون.",
      },
      {
        heading: "16. تعديل الشروط",
        body: "قد نحدّث هذه الشروط. استمرارك في الاستخدام بعد تاريخ التحديث يعني قبولك. التغييرات الجوهرية تُنشر في هذه الصفحة.",
      },
      {
        heading: "17. القانون الواجب التطبيق",
        body: "تخضع هذه الشروط للقوانين المعمول بها في الاختصاص الذي تعمل فيه ClashAnime. يُفضَّل إبلاغنا أولاً عبر support@clashanime.com قبل أي إجراء قانوني.",
      },
      {
        heading: "18. سحوبات ClashCoins وKYC ومكافحة الاحتيال",
        body: "رصيد ClashCoins قابل للتحويل من نقاط الصياد والسحب بعد مراجعة يدوية.\n\nإثبات الهوية (KYC):\n• KYC لمرة واحدة لكل حساب مطلوب قبل أي سحب\n• يجب إرسال الاسم القانوني ورقم هاتف وعنوان كامل\n• البيانات المزيفة أو المضللة أو المسروقة أو لطرف ثالث احتيال وقد تؤدي لمصادرة الرصيد ورفض السحب وإغلاق الحساب\n• قد نطلب تحققاً إضافياً في أي وقت\n\nمكافحة الاحتيال:\n• المكاسب غير الاعتيادية للنقاط أو الحسابات المكررة أو بيانات سحب متضاربة قد تُعلّق للمراجعة\n• السحب عبر تحويل بنكي أو PayPal أو USDT يدوياً، عادة خلال ٢٤–٧٢ ساعة بعد الموافقة\n• قد نرفض أو نؤجل أو نعكس السحوبات المشبوهة للامتثال للقانون وحماية المستخدمين",
      },
      {
        heading: "19. التواصل",
        body: `أسئلة قانونية وشروط:\n${CONTACT_BLOCK_AR}`,
      },
    ],
  },
  privacy: {
    title: "سياسة الخصوصية",
    updated: UPDATED_AR,
    intro:
      "توضّح هذه السياسة كيف تجمع ClashAnime معلوماتك وتستخدمها وتخزّنها وتحميها عند استخدام clashanime.com.",
    sections: [
      {
        heading: "1. من نحن",
        body: "ClashAnime.com منصة فيديوهات anime duel. للاستفسارات: privacy@clashanime.com",
      },
      {
        heading: "2. البيانات التي نجمعها",
        body: "معلومات الحساب:\n• البريد الإلكتروني\n• اسم المستخدم، الاسم المعروض، السيرة\n• صورة الملف والبانر\n• مزود OAuth (Google, GitHub, Facebook) ومعرّفه\n\nالمحتوى الذي تنشئه:\n• الفيديوهات، الصور المصغرة، العناوين\n• التعليقات، الإعجابات، المتابعات، المشاركات\n• البلاغات التي ترسلها\n\nبيانات الاستخدام والتقنية:\n• المشاهدات، تواريخ الرفع، حالة المراجعة\n• نوع المتصفح، فئة الجهاز، اللغة\n• عنوان IP وسجلات الطلبات (عبر مزود الاستضافة)\n• رموز الجلسة وcookies المصادقة\n\nالتخزين المحلي:\n• السمة (فاتح/داكن)، اللغة، تفضيلات الواجهة",
      },
      {
        heading: "3. كيف نستخدم بياناتك",
        body: "نستخدم البيانات من أجل:\n• إنشاء حسابك والمصادقة\n• استضافة وعرض وترتيب الفيديوهات\n• مراجعة المحتوى وتطبيق الإرشادات\n• الرد على البلاغات وإشعارات DMCA\n• منع الإساءة والspam وإعادة الرفع\n• تحسين الأداء وإصلاح الأخطاء\n• الامتثال للالتزامات القانونية\n\nلا نبيع معلوماتك الشخصية لأطراف ثالثة.",
      },
      {
        heading: "4. الأساس القانوني (حيث ينطبق)",
        body: "حسب منطقتك، نعالج البيانات بناءً على:\n• تنفيذ العقد: لتقديم الخدمة\n• المصلحة المشروعة: الأمان، المراجعة، منع الاحتيال\n• الالتزام القانوني: الاستجابة للطلبات الرسمية\n• الموافقة: للميزات الاختيارية عند الحاجة",
      },
      {
        heading: "5. خدمات طرف ثالث",
        body: "نعتمد على:\n• Supabase — قاعدة البيانات، المصادقة، التخزين\n• Vercel — استضافة الموقع وCDN\n• Google / GitHub / Facebook — تسجيل الدخول\n\nهذه الجهات تعالج البيانات وفق سياساتها. نختار مزودين بممارسات أمان قوية.",
      },
      {
        heading: "6. بيانات المراجعة والأمان",
        body: "قد تُبصَم الفيديوهات (file hash, perceptual hash, thumb hash) لاكتشاف التكرار وإعادة الرفع. تُسجَّل قرارات المراجعة مع الوقت ونوع الإجراء وهوية الموظف للامتثال والتدقيق.",
      },
      {
        heading: "7. مشاركة البيانات",
        body: "قد نشارك المعلومات:\n• مع مزودي الخدمة الذين يساعدون في تشغيل ClashAnime\n• عندما يقتضي القانون أو أمر محكمة أو إشعار DMCA صالح\n• لحماية حقوق وأمان المستخدمين والمنصة\n\nلا نشارك بيانات حسابك الخاصة مع مستخدمين آخرين إلا ما تجعله عاماً (اسم المستخدم، الملف، الفيديوهات العامة).",
      },
      {
        heading: "8. الاحتفاظ بالبيانات",
        body: "نحتفظ ببيانات الحساب والمحتوى طالما حسابك نشط. عند حذف المحتوى أو الحساب، نزيله من العرض العام. قد تبقى نسخ احتياطية لفترة محدودة. سجلات المراجعة والبلاغات وDMCA قد تُحفظ أطول للامتثال ومنع التكرار.",
      },
      {
        heading: "9. الأمان",
        body: "نستخدم HTTPS، ضوابط وصول، وأمان على مستوى قاعدة البيانات. لا يوجد نظام آمن 100%. أبلغ عن اختراقات مشتبه بها على privacy@clashanime.com.",
      },
      {
        heading: "10. حقوقك",
        body: "حسب موقعك قد يحق لك:\n• الوصول لنسخة من بياناتك\n• تصحيح البيانات غير الدقيقة\n• طلب الحذف (مع الاحتفاظ القانوني)\n• الاعتراض أو تقييد بعض المعالجة\n• نقل البيانات (حيث ينطبق)\n\nراسل privacy@clashanime.com. مستخدمو EU/UK قد يتقدمون لسلطة حماية البيانات المحلية.",
      },
      {
        heading: "11. النقل الدولي",
        body: "قد تُعالَج بياناتك في دول حيث يعمل مزودونا. نتخذ خطوات لضمان ضمانات مناسبة حيث مطلوب.",
      },
      {
        heading: "12. الأطفال",
        body: "ClashAnime غير موجهة لمن دون 13 عاماً. لا نجمع عن قصد بيانات أطفال دون 13. تواصل معنا لطلب الحذف.",
      },
      {
        heading: "13. التغييرات",
        body: "قد نحدّث هذه السياسة. تاريخ \"آخر تحديث\" أعلى الصفحة يعكس النسخة الحالية. استمرارك بعد التغيير يعني قبولك.",
      },
      {
        heading: "14. إثبات الهوية للسحب (KYC)",
        body: "عند طلب سحب ClashCoins قد نجمع ونحفظ:\n• الاسم القانوني ورقم الهاتف والعنوان\n• تفضيل التواصل عبر واتساب (اختياري)\n• تفاصيل وجهة السحب المرتبطة بالطلب\n\nنستخدم هذه البيانات فقط لمنع الاحتيال والامتثال القانوني ومعالجة السحوبات. الوصول محصور بالموظفين المخوّلين. قد نحتفظ بسجلات KYC مدة أطول للامتثال لمكافحة الاحتيال والضرائب والقانون.",
      },
      {
        heading: "15. التواصل",
        body: `استفسارات الخصوصية:\n${CONTACT_BLOCK_AR}`,
      },
    ],
  },
  community: {
    title: "إرشادات المجتمع",
    updated: UPDATED_AR,
    intro:
      "تحدّد هذه الإرشادات السلوك المقبول على ClashAnime. منشورات المجتمع يجب أن تكون مرتبطة بالأنمي فقط. المخالفات قد تؤدي إلى حذف المحتوى أو إجراءات على الحساب.",
    sections: [
      {
        heading: "1. رسالتنا",
        body: "ClashAnime تحتفي بتحريرات anime duel الأصلية ومقاطع المبدعين. هدفنا الإبداع—وليس إعادة توزيع محتوى من منصات أخرى.",
      },
      {
        heading: "2. محتوى أصلي فقط",
        body: "ارفع فقط ما أنشأته أو لديك حق نشره صراحة. لا:\n• re-upload من YouTube أو TikTok أو Instagram\n• حلقات خام أو مشاهد غير مُحرَّرة\n• سرقة montage مبدع آخر\n• إخفاء الاستخدام غير المصرّح بعلامات مائية",
      },
      {
        heading: "3. مسؤوليتك القانونية",
        body: "حتى التحريرات الإبداعية قد تتضمن مشاهد أو موسيقى محمية. أنت—وليس ClashAnime—مسؤول عن امتثال رفعك لقوانين حقوق النشر والاستخدام العادل في بلدك. عند الشك، لا ترفع.",
      },
      {
        heading: "4. احترام المجتمع",
        body: "عامل الآخرين باحترام. يُمنع التحرش، خطاب الكراهية، الشتائم، التهديد، التنمر، doxing، والإساءة الموجّهة في الفيديوهات أو التعليقات أو أسماء المستخدمين.",
      },
      {
        heading: "5. صدق العرض",
        body: "لا تستخدم عناوين مضلِّلة أو ادعاءات \"حصري\" كاذبة أو انتحال شخصية. لا تتظاهر بأنك مبدع آخر أو استوديو أو موظف ClashAnime.",
      },
      {
        heading: "6. لا spam ولا تلاعب",
        body: "لا تستخدم بوتات أو حسابات وهمية أو تفاعلاً مزيفاً للتلاعب بالشبكة. لا تغرق المنصة برفوعات مكررة أو شبه مكررة.",
      },
      {
        heading: "7. محتوى آمن وقانوني",
        body: "لا ترفع محتوى غير قانوني أو روابط برمجيات خبيثة أو صوراً دون موافقة أو محتوى جنسياً يتعلق بالقُصّر. العنف الصريح يجب أن يلتزم بالقوانين.",
      },
      {
        heading: "8. قائمة المراجعة",
        body: "رفعات القنوات غير الموثّقة تدخل مراجعة يدوية. قد تُوافق أو تُرفض أو تُعاد للمراجعة. التوثيق يُكتسب بالثقة ويُلغى عند المخالفة.",
      },
      {
        heading: "9. الإبلاغ",
        body: "رأيت محتوى مسروقاً؟ استخدم /report مع رابط الفيديو. لمنشورات المجتمع، استخدم زر الإبلاغ في المنشور. أصحاب الحقوق يستخدمون /dmca للإشعارات الرسمية.",
      },
      {
        heading: "10. المجتمع — أنمي فقط (إلزامي)",
        body: "كل منشور في صفحة المجتمع يجب أن يرتبط بالأنمي أو المانga أو ألعاب الأنمي أو فن المعجبين أو cosplay أو محتوى المبدعين ضمن عالم الأنمي.\n\nيُمنع منعاً باتاً في المنشورات والتعليقات والصور:\n• محتوى سياسي أو ديني أو أخبار خارج موضوع الأنمي\n• أي محتوى إباحي أو جنسي\n• قمار، احتيال، spam، أو إعلانات غير مرتبطة\n• عنف واقعي أو مشاهد مروّعة خارج سياق الأنمي\n• دراما شخصية أو مواضيع لا علاقة لها بالأنمي\n\nبالنشر في المجتمع، تؤكد التزامك بهذه القاعدة. المخالفات قد تُحذف دون إنذار وتؤدي إلى تقييد الحساب أو حظره.",
      },
      {
        heading: "11. العقوبات",
        body: "قد تؤدي المخالفات إلى:\n• حذف المحتوى\n• تقييد الرفع\n• إلغاء توثيق القناة\n• إيقاف مؤقت\n• حظر دائم\n• إحالة لأصحاب الحقوق أو الجهات المختصة",
      },
    ],
  },
  dmca: {
    title: "DMCA / حقوق النشر",
    updated: UPDATED_AR,
    intro:
      "ClashAnime تحترم حقوق الملكية الفكرية وتستجيب للإشعارات الصالحة بموجب DMCA والقوانين المماثلة.",
    sections: [
      {
        heading: "1. الوكيل المعيّن (17 U.S.C. § 512)",
        body: `عيّنت ClashAnime وكيلاً لاستلام إشعارات انتهاك حقوق النشر:\n\n${CONTACT_BLOCK_AR}`,
      },
      {
        heading: "2. دورنا",
        body: "ClashAnime منصة استضافة. لا ننشئ محتوى المستخدمين. نتصرف بناءً على إشعارات حذف صالحة ونطبّق سياسة المخالفين المتكررين. لسنا مسؤولين عن محتوى المستخدمين إلا حيث يقتضي القانون.",
      },
      {
        heading: "3. متطلبات إشعار الحذف",
        body: "يجب أن يتضمن إشعارك الكتابي:\n• توقيعك الفعلي أو الإلكتروني\n• تحديد العمل المحمي بحقوق النشر\n• رابط الفيديو أو معرّفه على ClashAnime\n• اسمك، عنوانك، هاتفك، وبريدك\n• بيان good faith أن الاستخدام غير مصرّح\n• بيان تحت طائلة الحنث باليمين أن المعلومات دقيقة وأنك مخوّل للتصرف",
      },
      {
        heading: "4. كيفية الإرسال",
        body: "راسل dmca@clashanime.com بعنوان \"DMCA Takedown Notice\" أو استخدم /report مع كل التفاصيل. الإشعارات الناقصة قد تتأخر.",
      },
      {
        heading: "5. استجابتنا",
        body: "عند استلام إشعار صالح، قد نحذف أو نعطّل الوصول للمحتوى المحدد ونُبلّغ الرافع عند الاقتضاء. نسجّل إجراءات الحذف في نظام المراجعة.",
      },
      {
        heading: "6. الإشعار المضاد",
        body: "إذا حُذف محتواك بالخطأ، أرسل إشعاراً مضاداً إلى dmca@clashanime.com يتضمن:\n• توقيعك\n• تحديد المحتوى المحذوف وموقعه قبل الحذف\n• بيان تحت طائلة الحنث أن الحذف كان خطأ\n• موافقتك على اختصاص المحكمة المناسبة\n• بيانات الاتصال\n\nقد نستعيد المحتوى بعد المدة القانونية ما لم يرفع المشتكي دعوى.",
      },
      {
        heading: "7. المخالفون المتكررون",
        body: "الحسابات التي ترفع محتوى مخالفاً بشكل متكرر قد تُحظر نهائياً.",
      },
      {
        heading: "8. البلاغات الكاذبة",
        body: "تقديم إشعارات انتهاك كاذبة عن قصد قد يعرّضك للمسؤولية بموجب 17 U.S.C. § 512(f) أو قوانين مماثلة.",
      },
    ],
  },
};

const ja: LegalBundle = {
  terms: {
    title: "利用規約",
    updated: UPDATED_JA,
    intro: "本規約はClashAnime.comの利用条件です。アカウントとアップロード内容について、ユーザー自身が責任を負います。",
    sections: en.terms.sections.map((section, index) => {
      const jaHeadings = [
        "1. 同意",
        "2. 対象年齢",
        "3. サービスの性質",
        "4. オリジナルコンテンツのみ",
        "5. コンテンツに対するユーザーの責任",
        "6. ClashAnimeへのライセンス",
        "7. アカウントセキュリティ",
        "8. 禁止行為",
        "9. 審査と承認",
        "10. 削除権",
        "11. 免責事項",
        "12. 責任の制限",
        "13. 補償",
        "14. 著作権申立",
        "15. 終了",
        "16. 規約の変更",
        "17. 準拠法",
        "18. ClashCoins出金・KYC・不正防止",
        "19. お問い合わせ",
      ];
      const jaBodies = [
        "ClashAnime.comの利用、アカウント作成、OAuthログイン、コンテンツのアップロードにより、本規約、プライバシーポリシー、コミュニティガイドライン、DMCAポリシーに同意したものとみなします。",
        "13歳以上（または各国の最低年齢）である必要があります。18歳未満の場合は保護者の同意が必要です。",
        "ClashAnimeはUGC型のアニメデュエル動画プラットフォームです。ホスティングと発見機能を提供しますが、規約違反コンテンツは削除できます。",
        "YouTube、TikTok、Instagram等からの無権限再アップロード、エピソードの丸ごと投稿、権利のないコンピレーションは禁止です。",
        "アップロード、サムネイル、タイトル、コメント、プロフィール内容について、ユーザー自身が法的責任を負います。権利確認、法令遵守、他者への損害防止はユーザーの義務です。自動審査はリスク低減のみで、責任は免れません。",
        "コンテンツの所有権はユーザーに帰属します。運営に必要な範囲で非独占的な利用許諾を付与します。",
        "ログイン情報の管理、不正利用の防止、疑わしいアクセスの報告はユーザーの責任です。",
        "侵害コンテンツ、嫌がらせ、ボット、審査回避、スクレイピング、なりすまし、スパム、虚偽KYC等は禁止です。",
        "指紋化・重複検知・手動審査を行います。未認証チャンネルは公開前審査が必要です。スタッフの判断は監査ログに記録されます。",
        "規約・ガイドライン・DMCA・リスクに基づき、いつでもコンテンツやアカウントを削除・制限できます。",
        "本サービスは「現状のまま」提供されます。完全な侵害検知や無停止を保証しません。",
        "法令で許される最大限、間接損害等について当社の責任を制限します。",
        "ユーザーのコンテンツ・行為・規約違反・第三者権利侵害に起因する請求から当社を免責し、補償することに同意します。",
        "権利者は/dmcaまたはdmca@clashanime.comをご利用ください。",
        "違反・反復侵害・法的リスクによりアカウント停止の可能性があります。",
        "規約は更新される場合があります。更新後の利用は同意とみなされます。",
        "準拠法に従い、まずsupport@clashanime.comへご連絡ください。",
        "ClashCoins残高の出金にはアカウントごとに1回のKYC（氏名・電話・住所）が必要です。虚偽情報は不正とみなし、残高没収や永久停止の対象となります。出金は承認後24〜72時間以内に手動処理されます。",
        "dmca@clashanime.com / privacy@clashanime.com / support@clashanime.com",
      ];
      return { heading: jaHeadings[index] ?? section.heading, body: jaBodies[index] ?? section.body };
    }),
  },
  privacy: {
    title: "プライバシーポリシー",
    updated: UPDATED_JA,
    intro: "ClashAnimeが収集・利用・保護する情報について説明します。",
    sections: [
      { heading: "1. 運営者", body: "ClashAnime.com — お問い合わせ: privacy@clashanime.com" },
      {
        heading: "2. 収集する情報",
        body: "アカウント（メール、ユーザー名、OAuth）、コンテンツ（動画、コメント、いいね）、利用状況（視聴、IP、ログ）、Cookie/ローカルストレージ（言語、テーマ）。",
      },
      {
        heading: "3. 利用目的",
        body: "認証、ホスティング、フィード表示、モデレーション、不正防止、サービス改善、法令遵守。個人情報の販売は行いません。",
      },
      { heading: "4. 法的根拠", body: "契約履行、正当な利益、法的義務、同意（該当時）に基づき処理します。" },
      { heading: "5. 第三者", body: "Supabase、Vercel、Google/GitHub/Facebook OAuthを使用します。" },
      { heading: "6. モデレーション", body: "指紋化とスタッフ監査ログを保持する場合があります。" },
      { heading: "7. 共有", body: "運営提供者、法令要請、安全確保の場合に限り共有します。" },
      { heading: "8. 保持", body: "アカウント存続中は保持。削除後もバックアップやDMCA記録が残る場合があります。" },
      { heading: "9. セキュリティ", body: "HTTPSとアクセス制御を使用。侵害の疑いはprivacy@clashanime.comへ。" },
      { heading: "10. 権利", body: "アクセス、訂正、削除等をprivacy@clashanime.comへ請求できます。" },
      { heading: "11. 国際移転", body: "提供者所在国で処理される場合があります。" },
      { heading: "12. 児童", body: "13歳未満を対象としていません。" },
      { heading: "13. 変更", body: "本ページの更新日が最新版を示します。" },
      {
        heading: "14. 出金KYC（本人確認）",
        body: "ClashCoins出金時に、氏名、電話番号、住所、WhatsApp連絡希望、送金先情報を収集・保存する場合があります。不正防止、法令遵守、出金処理のみに使用し、権限のあるスタッフのみがアクセスできます。",
      },
      { heading: "15. 連絡先", body: "privacy@clashanime.com" },
    ],
  },
  community: {
    title: "コミュニティガイドライン",
    updated: UPDATED_JA,
    intro: "ClashAnimeで許容される行動を定義します。コミュニティ投稿はアニメ関連のみ必須です。",
    sections: [
      { heading: "1. 目的", body: "オリジナルのアニメデュエルクリップのためのコミュニティです。" },
      { heading: "2. オリジナルのみ", body: "再アップロード、エピソード盗用、他クリエイターの盗用は禁止。" },
      { heading: "3. 法的責任", body: "著作権・フェアユースの確認はユーザーの責任です。" },
      { heading: "4. 尊重", body: "嫌がらせ、ヘイト、脅迫、doxingは禁止。" },
      { heading: "5. 正直な表示", body: "誤解を招くタイトルやなりすましは禁止。" },
      { heading: "6. スパム禁止", body: "ボットや不正エンゲージメント操作は禁止。" },
      { heading: "7. 安全", body: "違法コンテンツ、児童に関する不適切コンテンツは禁止。" },
      { heading: "8. 審査", body: "未認証チャンネルは審査キューに入ります。" },
      { heading: "9. 報告", body: "動画は /report、コミュニティ投稿は投稿内の報告ボタンをご利用ください。" },
      {
        heading: "10. コミュニティ — アニメのみ（必須）",
        body: "コミュニティの投稿はアニメ、漫画、アニメゲーム、ファンアート、コスプレ、またはアニメ領域のクリエイター内容に限定されます。\n\n禁止：政治・宗教・非アニメニュース、成人/性的コンテンツ、ギャンブル・詐欺・spam、非アニメの個人 drama など。投稿時に本ルールへの同意が必要です。",
      },
      { heading: "11. 制裁", body: "削除、制限、認証取消、停止、永久BANの対象となります。" },
    ],
  },
  dmca: {
    title: "DMCA / 著作権",
    updated: UPDATED_JA,
    intro: "ClashAnimeは知的財産権を尊重し、有効な著作権通知に対応します。",
    sections: [
      { heading: "1. 指定代理人", body: "ClashAnime Legal — dmca@clashanime.com" },
      { heading: "2. 役割", body: "ホスティングプラットフォームとして、有効な削除通知に対応します。" },
      { heading: "3. 削除通知", body: "署名、著作物の特定、動画URL、連絡先、good faith声明、宣誓声明が必要です。" },
      { heading: "4. 提出", body: "dmca@clashanime.com または /report" },
      { heading: "5. 対応", body: "有効な通知に基づきコンテンツを削除または無効化します。" },
      { heading: "6. 反論通知", body: "誤削除の場合、反論通知を送信できます。" },
      { heading: "7. 反復侵害者", body: "反復的な侵害者のアカウントを停止します。" },
      { heading: "8. 虚偽申告", body: "虚偽の申告は法的責任の対象となります。" },
    ],
  },
};

const bundle: Record<Locale, LegalBundle> = { en, ja, ar };

function pick(locale: Locale): LegalBundle {
  return bundle[locale] ?? bundle.en;
}

export function getTermsCopy(locale: Locale): LegalPageCopy {
  return pick(locale).terms;
}

export function getPrivacyCopy(locale: Locale): LegalPageCopy {
  return pick(locale).privacy;
}

export function getCommunityCopy(locale: Locale): LegalPageCopy {
  return pick(locale).community;
}

export function getDmcaCopy(locale: Locale): LegalPageCopy {
  return pick(locale).dmca;
}

export const LEGAL_CONTACT = {
  dmca: "dmca@clashanime.com",
  privacy: "privacy@clashanime.com",
  support: "support@clashanime.com",
} as const;
