/** Permanent DOM bait elements targeted by common ad blockers. */
export function AdblockBait() {
  return (
    <>
      <div
        id="clashanime-ad-bait-1"
        className="adsbygoogle ad-banner text-ad textAd text_ads banner-ads pub_300x250"
        aria-hidden="true"
      />
      <div
        id="clashanime-ad-bait-2"
        className="adsbox ad-container sponsored-content google-ad pub_728x90"
        aria-hidden="true"
      />
      <div
        id="clashanime-ad-bait-3"
        className="ad-slot ad-placement advertisement banner_ad"
        aria-hidden="true"
      />
      <div id="google_ads_iframe_check" className="google-auto-placed" aria-hidden="true" />
    </>
  );
}
