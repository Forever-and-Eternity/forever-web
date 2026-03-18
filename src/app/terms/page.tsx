import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-ig flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                        Terms of Service
                    </h1>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p className="text-sm">Last updated: March 2026</p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                        <p>By creating an account or using Forever, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">2. Your Content</h2>
                        <p>You retain full ownership of all content you upload to Forever. We do not claim any rights over your photos, documents, or memories. You grant us a limited license solely to store and deliver your content as part of the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">3. Acceptable Use</h2>
                        <p>You agree not to upload illegal content, use the service for harassment, or attempt to compromise the security of the platform. We reserve the right to suspend accounts that violate these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">4. Time Capsules & Delivery</h2>
                        <p>Forever will make reasonable efforts to deliver time capsules and event-triggered content at the specified times. However, we cannot guarantee delivery due to circumstances beyond our control.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">5. Account Termination</h2>
                        <p>You may delete your account at any time. Upon deletion, your data will be permanently removed within 30 days. We may terminate accounts that violate our terms with prior notice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">6. Digital Legacy</h2>
                        <p>Forever provides tools for digital legacy planning. Capsule delivery to designated recipients will be honoured according to your settings, subject to applicable laws regarding digital estates in your jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
                        <p>Forever is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
                        <p>For questions about these terms, contact us at <span className="text-primary">legal@foreverapp.com</span>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
