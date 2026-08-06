import { ContentHome } from "@/components/ContentHome";
import { JsonLd } from "@/components/JsonLd";
import {
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata("home");

export default function Home() {
  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      <ContentHome />
    </>
  );
}
