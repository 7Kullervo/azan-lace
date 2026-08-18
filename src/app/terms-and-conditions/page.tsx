/* ============================================================
   TERMS & CONDITIONS — PLACEHOLDER TEXT
   ------------------------------------------------------------
   Starter wording only — have this reviewed by a lawyer before
   launch, especially the payment, returns, and liability
   sections. Edit the paragraphs below directly.
   ============================================================ */

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl text-wine dark:text-gold mb-6">Terms &amp; Conditions</h1>
      <div className="space-y-5 text-sm leading-relaxed text-ink-muted dark:text-cream-muted">
        <p>
          By using the Azan Lace website and placing an order, you agree to the following
          terms and conditions.
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Orders &amp; Pricing
        </h2>
        <p>
          All prices are listed in Pakistani Rupees (Rs.) and are subject to change without
          notice. We reserve the right to refuse or cancel any order, including in cases of
          pricing errors or stock unavailability.
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Payment
        </h2>
        <p>
          We accept payment via Easypaisa and Cash on Delivery (COD). For COD orders,
          payment is due in full to the courier upon delivery.
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Shipping &amp; Delivery
        </h2>
        <p>
          Estimated delivery times are provided for convenience and are not guaranteed.
          You can track your order's status in real time from your account dashboard.
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Returns &amp; Exchanges
        </h2>
        <p>
          [Add your store's specific return/exchange window and conditions here — e.g.
          number of days, condition of goods required, who pays return shipping.]
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Account Responsibility
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account.
        </p>

        <p className="text-xs italic">Last updated: [add date when you finalize this page]</p>
      </div>
    </div>
  );
}
