import type { LegalPageCopy } from "@/lib/legalCopy";

const CONTACT_BLOCK_EN =
  "ClashAnime.com\nDesignated DMCA Agent: ClashAnime Legal\nDMCA: dmca@clashanime.com\nPrivacy: privacy@clashanime.com\nSupport: support@clashanime.com";

const clashAnimePlatformSections = [
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
];

const termifyTermsSections = [
  {
    heading: "General Terms",
    body: `By accessing and placing an order with Clash Anime, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Clash Anime.

Under no circumstances shall Clash Anime team be liable for any direct, indirect, special, incidental or consequential damages, including, but not limited to, loss of data or profit, arising out of the use, or the inability to use, the materials on this site, even if Clash Anime team or an authorized representative has been advised of the possibility of such damages. If your use of materials from this site results in the need for servicing, repair or correction of equipment or data, you assume any costs thereof.

Clash Anime will not be responsible for any outcome that may occur during the course of usage of our resources. We reserve the rights to change prices and revise the resources usage policy in any moment. These Terms & Conditions were created with Termify.`,
  },
  {
    heading: "License",
    body: `Clash Anime grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the website strictly in accordance with the terms of this Agreement.

These Terms & Conditions are a contract between you and Clash Anime (referred to in these Terms & Conditions as "Clash Anime", "us", "we" or "our"), the provider of the Clash Anime website and the services accessible from the Clash Anime website (which are collectively referred to in these Terms & Conditions as the "Clash Anime Service").

You are agreeing to be bound by these Terms & Conditions. If you do not agree to these Terms & Conditions, please do not use the Clash Anime Service. In these Terms & Conditions, "you" refers both to you as an individual and to the entity you represent. If you violate any of these Terms & Conditions, we reserve the right to cancel your account or block access to your account without notice.`,
  },
  {
    heading: "Definitions and key terms",
    body: `To help explain things as clearly as possible in this Terms & Conditions, every time any of these terms are referenced, they are strictly defined as:

Cookie: small amount of data generated by a website and saved by your web browser. It is used to identify your browser, provide analytics, remember information about you such as your language preference or login information.

Company: when this terms mention "Company," "we," "us," or "our," it refers to Clash Anime, that is responsible for your information under this Terms & Conditions.

Country: where Clash Anime or the owners/founders of Clash Anime are based, in this case Brazil.

Device: any internet connected device such as a phone, tablet, computer or any other device that can be used to visit Clash Anime and use the services.

Service: refers to the service provided by Clash Anime as described in the relative terms (if available) and on this platform.

Third-party service: refers to advertisers, contest sponsors, promotional and marketing partners, and others who provide our content or whose products or services we think may interest you.

Website: Clash Anime's site, which can be accessed via this URL: https://www.clashanime.com/

You: a person or entity that is registered with Clash Anime to use the Services.`,
  },
  {
    heading: "Restrictions",
    body: `You agree not to, and you will not permit others to:

• License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the website or make the platform available to any third party.
• Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the website.
• Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of Clash Anime or its affiliates, partners, suppliers or the licensors of the website.`,
  },
  {
    heading: "Payment",
    body: `If you register to any of our recurring payment plans, you agree to pay all fees or charges to your account for the Service in accordance with the fees, charges and billing terms in effect at the time that each fee or charge is due and payable. Unless otherwise indicated in an order form, you must provide Clash Anime with a valid credit card (Visa, MasterCard, or any other issuer accepted by us) ("Payment Provider") as a condition to signing up for the Premium plan. Your Payment Provider agreement governs your use of the designated credit card account, and you must refer to that agreement and not these Terms to determine your rights and liabilities with respect to your Payment Provider. By providing Clash Anime with your credit card number and associated payment information, you agree that Clash Anime is authorized to verify information immediately, and subsequently invoice your account for all fees and charges due and payable to Clash Anime hereunder and that no additional notice or consent is required. You agree to immediately notify Clash Anime of any change in your billing address or the credit card used for payment hereunder. Clash Anime reserves the right at any time to change its prices and billing methods, either immediately upon posting on our Site or by e-mail delivery to your organization's administrator(s).

Any attorney fees, court costs, or other costs incurred in collection of delinquent undisputed amounts shall be the responsibility of and paid for by you.

No contract will exist between you and Clash Anime for the Service until Clash Anime accepts your order by a confirmatory e-mail, SMS/MMS message, or other appropriate means of communication.

You are responsible for any third-party fees that you may incur when using the Service.`,
  },
  {
    heading: "Return and Refund Policy",
    body: `Thanks for shopping at Clash Anime. We appreciate the fact that you like to buy the stuff we build. We also want to make sure you have a rewarding experience while you're exploring, evaluating, and purchasing our products.

As with any shopping experience, there are terms and conditions that apply to transactions at Clash Anime. We'll be as brief as our attorneys will allow. The main thing to remember is that by placing an order or making a purchase at Clash Anime, you agree to the terms along with Clash Anime's Privacy Policy.

If, for any reason, You are not completely satisfied with any good or service that we provide, don't hesitate to contact us and we will discuss any of the issues you are going through with our product.`,
  },
  {
    heading: "Your Suggestions",
    body: `Any feedback, comments, ideas, improvements or suggestions (collectively, "Suggestions") provided by you to Clash Anime with respect to the website shall remain the sole and exclusive property of Clash Anime.

Clash Anime shall be free to use, copy, modify, publish, or redistribute the Suggestions for any purpose and in any way without any credit or any compensation to you.`,
  },
  {
    heading: "Your Consent",
    body: "We've updated our Terms & Conditions to provide you with complete transparency into what is being set when you visit our site and how it's being used. By using our website, registering an account, or making a purchase, you hereby consent to our Terms & Conditions.",
  },
  {
    heading: "Links to Other Websites",
    body: "This Terms & Conditions applies only to the Services. The Services may contain links to other websites not operated or controlled by Clash Anime. We are not responsible for the content, accuracy or opinions expressed in such websites, and such websites are not investigated, monitored or checked for accuracy or completeness by us. Please remember that when you use a link to go from the Services to another website, our Terms & Conditions are no longer in effect. Your browsing and interaction on any other website, including those that have a link on our platform, is subject to that website's own rules and policies. Such third parties may use their own cookies or other methods to collect information about you.",
  },
  {
    heading: "Cookies",
    body: 'Clash Anime uses "Cookies" to identify the areas of our website that you have visited. A Cookie is a small piece of data stored on your computer or mobile device by your web browser. We use Cookies to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality like videos may become unavailable or you would be required to enter your login details every time you visit the website as we would not be able to remember that you had logged in previously. Most web browsers can be set to disable the use of Cookies. However, if you disable Cookies, you may not be able to access functionality on our website correctly or at all. We never place Personally Identifiable Information in Cookies.',
  },
  {
    heading: "Changes To Our Terms & Conditions",
    body: `You acknowledge and agree that Clash Anime may stop (permanently or temporarily) providing the Service (or any features within the Service) to you or to users generally at Clash Anime's sole discretion, without prior notice to you. You may stop using the Service at any time. You do not need to specifically inform Clash Anime when you stop using the Service. You acknowledge and agree that if Clash Anime disables access to your account, you may be prevented from accessing the Service, your account details or any files or other materials which is contained in your account.

If we decide to change our Terms & Conditions, we will post those changes on this page, and/or update the Terms & Conditions modification date below.`,
  },
  {
    heading: "Modifications to Our website",
    body: "Clash Anime reserves the right to modify, suspend or discontinue, temporarily or permanently, the website or any service to which it connects, with or without notice and without liability to you.",
  },
  {
    heading: "Updates to Our website",
    body: `Clash Anime may from time to time provide enhancements or improvements to the features/functionality of the website, which may include patches, bug fixes, updates, upgrades and other modifications ("Updates").

Updates may modify or delete certain features and/or functionalities of the website. You agree that Clash Anime has no obligation to (i) provide any Updates, or (ii) continue to provide or enable any particular features and/or functionalities of the website to you.

You further agree that all Updates will be (i) deemed to constitute an integral part of the website, and (ii) subject to the terms and conditions of this Agreement.`,
  },
  {
    heading: "Third-Party Services",
    body: `We may display, include or make available third-party content (including data, information, applications and other products services) or provide links to third-party websites or services ("Third-Party Services").

You acknowledge and agree that Clash Anime shall not be responsible for any Third-Party Services, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or any other aspect thereof. Clash Anime does not assume and shall not have any liability or responsibility to you or any other person or entity for any Third-Party Services.

Third-Party Services and links thereto are provided solely as a convenience to you and you access and use them entirely at your own risk and subject to such third parties' terms and conditions.`,
  },
  {
    heading: "Term and Termination",
    body: `This Agreement shall remain in effect until terminated by you or Clash Anime.

Clash Anime may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.

This Agreement will terminate immediately, without prior notice from Clash Anime, in the event that you fail to comply with any provision of this Agreement. You may also terminate this Agreement by deleting the website and all copies thereof from your computer.

Upon termination of this Agreement, you shall cease all use of the website and delete all copies of the website from your computer.

Termination of this Agreement will not limit any of Clash Anime's rights or remedies at law or in equity in case of breach by you (during the term of this Agreement) of any of your obligations under the present Agreement.`,
  },
  {
    heading: "Copyright Infringement Notice",
    body: "If you are a copyright owner or such owner's agent and believe any material on our website constitutes an infringement on your copyright, please contact us setting forth the following information: (a) a physical or electronic signature of the copyright owner or a person authorized to act on his behalf; (b) identification of the material that is claimed to be infringing; (c) your contact information, including your address, telephone number, and an email; (d) a statement by you that you have a good faith belief that use of the material is not authorized by the copyright owners; and (e) a statement that the information in the notification is accurate, and, under penalty of perjury you are authorized to act on behalf of the owner.",
  },
  {
    heading: "Indemnification",
    body: "You agree to indemnify and hold Clash Anime and its parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors (if any) harmless from any claim or demand, including reasonable attorneys' fees, due to or arising out of your: (a) use of the website; (b) violation of this Agreement or any law or regulation; or (c) violation of any right of a third party.",
  },
  {
    heading: "No Warranties",
    body: `The website is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, Clash Anime, on its own behalf and on behalf of its affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the website, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, Clash Anime provides no warranty or undertaking, and makes no representation of any kind that the website will meet your requirements, achieve any intended results, be compatible or work with any other software, websites, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.

Without limiting the foregoing, neither Clash Anime nor any Clash Anime's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the website, or the information, content, and materials or products included thereon; (ii) that the website will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the website; or (iv) that the website, its servers, the content, or e-mails sent from or on behalf of Clash Anime are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.

Some jurisdictions do not allow the exclusion of or limitations on implied warranties or the limitations on the applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to you.`,
  },
  {
    heading: "Limitation of Liability",
    body: `Notwithstanding any damages that you might incur, the entire liability of Clash Anime and any of its suppliers under any provision of this Agreement and your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by you for the website.

To the maximum extent permitted by applicable law, in no event shall Clash Anime or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, for loss of data or other information, for business interruption, for personal injury, for loss of privacy arising out of or in any way related to the use of or inability to use the website, third-party software and/or third-party hardware used with the website, or otherwise in connection with any provision of this Agreement), even if Clash Anime or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.

Some states/jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you.`,
  },
  {
    heading: "Severability",
    body: `If any provision of this Agreement is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.

This Agreement, together with the Privacy Policy and any other legal notices published by Clash Anime on the Services, shall constitute the entire agreement between you and Clash Anime concerning the Services. If any provision of this Agreement is deemed invalid by a court of competent jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions of this Agreement, which shall remain in full force and effect. No waiver of any term of this Agreement shall be deemed a further or continuing waiver of such term or any other term, and Clash Anime's failure to assert any right or provision under this Agreement shall not constitute a waiver of such right or provision. YOU AND CLASH ANIME AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR RELATED TO THE SERVICES MUST COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS PERMANENTLY BARRED.`,
  },
  {
    heading: "Waiver",
    body: `Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Agreement shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute waiver of any subsequent breach.

No failure to exercise, and no delay in exercising, on the part of either party, any right or any power under this Agreement shall operate as a waiver of that right or power. Nor shall any single or partial exercise of any right or power under this Agreement preclude further exercise of that or any other right granted herein. In the event of a conflict between this Agreement and any applicable purchase or other terms, the terms of this Agreement shall govern.`,
  },
  {
    heading: "Amendments to this Agreement",
    body: `Clash Anime reserves the right, at its sole discretion, to modify or replace this Agreement at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our website after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use Clash Anime.`,
  },
  {
    heading: "Entire Agreement",
    body: "The Agreement constitutes the entire agreement between you and Clash Anime regarding your use of the website and supersedes all prior and contemporaneous written or oral agreements between you and Clash Anime.\n\nYou may be subject to additional terms and conditions that apply when you use or purchase other Clash Anime's services, which Clash Anime will provide to you at the time of such use or purchase.",
  },
  {
    heading: "Updates to Our Terms",
    body: "We may change our Service and policies, and we may need to make changes to these Terms so that they accurately reflect our Service and policies. Unless otherwise required by law, we will notify you (for example, through our Service) before we make changes to these Terms and give you an opportunity to review them before they go into effect. Then, if you continue to use the Service, you will be bound by the updated Terms. If you do not want to agree to these or any updated Terms, you can delete your account.",
  },
  {
    heading: "Intellectual Property",
    body: "The website and its entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by Clash Anime, its licensors or other providers of such material and are protected by Brazil and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws. The material may not be copied, modified, reproduced, downloaded or distributed in any way, in whole or in part, without the express prior written permission of Clash Anime, unless and except as is expressly provided in these Terms & Conditions. Any unauthorized use of the material is prohibited.",
  },
  {
    heading: "Agreement to Arbitrate",
    body: "This section applies to any dispute EXCEPT IT DOESN'T INCLUDE A DISPUTE RELATING TO CLAIMS FOR INJUNCTIVE OR EQUITABLE RELIEF REGARDING THE ENFORCEMENT OR VALIDITY OF YOUR OR Clash Anime's INTELLECTUAL PROPERTY RIGHTS. The term \"dispute\" means any dispute, action, or other controversy between you and Clash Anime concerning the Services or this agreement, whether in contract, warranty, tort, statute, regulation, ordinance, or any other legal or equitable basis. \"Dispute\" will be given the broadest possible meaning allowable under law.",
  },
  {
    heading: "Notice of Dispute",
    body: "In the event of a dispute, you or Clash Anime must give the other a Notice of Dispute, which is a written statement that sets forth the name, address, and contact information of the party giving it, the facts giving rise to the dispute, and the relief requested. You must send any Notice of Dispute via email to: wisamdandash1@gmail.com. Clash Anime will send any Notice of Dispute to you by mail to your address if we have it, or otherwise to your email address. You and Clash Anime will attempt to resolve any dispute through informal negotiation within sixty (60) days from the date the Notice of Dispute is sent. After sixty (60) days, you or Clash Anime may commence arbitration.",
  },
  {
    heading: "Binding Arbitration",
    body: "If you and Clash Anime don't resolve any dispute by informal negotiation, any other effort to resolve the dispute will be conducted exclusively by binding arbitration as described in this section. You are giving up the right to litigate (or participate in as a party or class member) all disputes in court before a judge or jury. The dispute shall be settled by binding arbitration in accordance with the commercial arbitration rules of the American Arbitration Association. Either party may seek any interim or preliminary injunctive relief from any court of competent jurisdiction, as necessary to protect the party's rights or property pending the completion of arbitration. Any and all legal, accounting, and other costs, fees, and expenses incurred by the prevailing party shall be borne by the non-prevailing party.",
  },
  {
    heading: "Submissions and Privacy",
    body: "In the event that you submit or post any ideas, creative suggestions, designs, photographs, information, advertisements, data or proposals, including ideas for new or improved products, services, features, technologies or promotions, you expressly agree that such submissions will automatically be treated as non-confidential and non-proprietary and will become the sole property of Clash Anime without any compensation or credit to you whatsoever. Clash Anime and its affiliates shall have no obligations with respect to such submissions or posts and may use the ideas contained in such submissions or posts for any purposes in any medium in perpetuity, including, but not limited to, developing, manufacturing, and marketing products and services using such ideas.",
  },
  {
    heading: "Promotions",
    body: `Clash Anime may, from time to time, include contests, promotions, sweepstakes, or other activities ("Promotions") that require you to submit material or information concerning yourself. Please note that all Promotions may be governed by separate rules that may contain certain eligibility requirements, such as restrictions as to age and geographic location. You are responsible to read all Promotions rules to determine whether or not you are eligible to participate. If you enter any Promotion, you agree to abide by and to comply with all Promotions Rules.

Additional terms and conditions may apply to purchases of goods or services on or through the Services, which terms and conditions are made a part of this Agreement by this reference.`,
  },
  {
    heading: "Typographical Errors",
    body: "In the event a product and/or service is listed at an incorrect price or with incorrect information due to typographical error, we shall have the right to refuse or cancel any orders placed for the product and/or service listed at the incorrect price. We shall have the right to refuse or cancel any such order whether or not the order has been confirmed and your credit card charged. If your credit card has already been charged for the purchase and your order is canceled, we shall immediately issue a credit to your credit card account or other payment account in the amount of the charge.",
  },
  {
    heading: "Miscellaneous",
    body: "If for any reason a court of competent jurisdiction finds any provision or portion of these Terms & Conditions to be unenforceable, the remainder of these Terms & Conditions will continue in full force and effect. Any waiver of any provision of these Terms & Conditions will be effective only if in writing and signed by an authorized representative of Clash Anime. Clash Anime will be entitled to injunctive or other equitable relief (without the obligations of posting any bond or surety) in the event of any breach or anticipatory breach by you. Clash Anime operates and controls the Clash Anime Service from its offices in Brazil. The Service is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation. Accordingly, those persons who choose to access the Clash Anime Service from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable. These Terms & Conditions (which include and incorporate the Clash Anime Privacy Policy) contains the entire understanding, and supersedes all prior understandings, between you and Clash Anime concerning its subject matter, and cannot be changed or modified by you. The section headings used in this Agreement are for convenience only and will not be given any legal import.",
  },
  {
    heading: "Disclaimer",
    body: `Clash Anime is not responsible for any content, code or any other imprecision.

Clash Anime does not provide warranties or guarantees.

In no event shall Clash Anime be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.

The Clash Anime Service and its contents are provided "as is" and "as available" without any warranty or representations of any kind, whether express or implied. Clash Anime is a distributor and not a publisher of the content supplied by third parties; as such, Clash Anime exercises no editorial control over such content and makes no warranty or representation as to the accuracy, reliability or currency of any information, content, service or merchandise provided through or accessible via the Clash Anime Service. Without limiting the foregoing, Clash Anime specifically disclaims all warranties and representations in any content transmitted on or in connection with the Clash Anime Service or on sites that may appear as links on the Clash Anime Service, or in the products provided as a part of, or otherwise in connection with, the Clash Anime Service, including without limitation any warranties of merchantability, fitness for a particular purpose or non-infringement of third party rights. No oral advice or written information given by Clash Anime or any of its affiliates, employees, officers, directors, agents, or the like will create a warranty. Price and availability information is subject to change without notice. Without limiting the foregoing, Clash Anime does not warrant that the Clash Anime Service will be uninterrupted, uncorrupted, timely, or error-free.`,
  },
  {
    heading: "Contact Us",
    body: `Don't hesitate to contact us if you have any questions.

Via Email: wisamdandash1@gmail.com
Support: support@clashanime.com
DMCA: dmca@clashanime.com
Privacy: privacy@clashanime.com`,
  },
];

export const combinedTermsEn: LegalPageCopy = {
  title: "Terms of Use",
  updated: "Last updated: July 1, 2026",
  intro:
    "These Terms of Use combine (A) the general Terms & Conditions created with Termify and (B) additional Clash Anime platform rules for uploads, moderation, community features, and payouts.\n\nBy accessing https://www.clashanime.com/, creating an account, or using the Service, you agree to both parts below, our Privacy Policy, Community Guidelines, and DMCA Policy.",
  sections: [
    {
      heading: "Part A — Terms & Conditions (Termify)",
      body: "The following general terms apply to Clash Anime. They were created with Termify.",
    },
    ...termifyTermsSections,
    {
      heading: "Part B — Clash Anime Platform Terms",
      body: "The following additional terms apply specifically to user-generated content, uploads, moderation, ClashCoins, and community features on clashanime.com. If there is a conflict between Part A and Part B regarding platform-specific features, Part B governs.",
    },
    ...clashAnimePlatformSections,
  ],
};

export function getCombinedTermsCopy(locale: "en" | "ar" | "ja"): LegalPageCopy {
  if (locale === "ar") {
    return {
      ...combinedTermsEn,
      title: "شروط الاستخدام",
      updated: "آخر تحديث: 1 يوليو 2026",
    };
  }

  if (locale === "ja") {
    return {
      ...combinedTermsEn,
      title: "利用規約",
      updated: "最終更新: 2026年7月1日",
    };
  }

  return combinedTermsEn;
}
