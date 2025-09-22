import { Suspense } from "react";
import ConfirmationContent from "./ConfirmationContent";

export const dynamic = "force-dynamic";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p>Loading confirmation...</p>}>
      <ConfirmationContent />
    </Suspense>
  );
}
