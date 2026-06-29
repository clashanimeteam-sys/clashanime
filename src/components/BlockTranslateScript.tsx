import Script from "next/script";

const BLOCK_TRANSLATE_SCRIPT = `
(function () {
  var root = document.documentElement;
  root.setAttribute("translate", "no");
  root.classList.add("notranslate");
  if (document.body) {
    document.body.setAttribute("translate", "no");
    document.body.classList.add("notranslate");
  }
})();
`;

export function BlockTranslateScript() {
  return (
    <Script id="clashanime-block-translate" strategy="beforeInteractive">
      {BLOCK_TRANSLATE_SCRIPT}
    </Script>
  );
}
