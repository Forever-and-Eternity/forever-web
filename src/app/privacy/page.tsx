import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p className="text-sm">Last updated: March 2026</p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">1. What We Collect</h2>
                        <p>Forever collects the minimum information needed to provide our service: your email address, display name, and the content you choose to upload (photos, documents, text). We do not sell your data to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Data</h2>
                        <p>Your data is used solely to provide the Forever service — storing your memories, managing your havens, and delivering capsules at the times you specify. We use cookies for authentication and to remember your preferences.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
                        <p>Content is stored using encrypted cloud storage. Keychain entries use AES-256-GCM client-side encryption — we cannot read your vault data. All data transfers use TLS encryption.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">4. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal data at any time. You can export your data or request complete account deletion by contacting us.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
                        <p>We use essential cookies for authentication and session management. Analytics cookies (if enabled) help us understand how you use Forever. You can manage your cookie preferences from the footer of our landing page.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
                        <p>For privacy-related questions, please contact us at <span className="text-primary">privacy@foreverapp.com</span>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
