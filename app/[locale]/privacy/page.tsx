import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - LoveLockParis',
  description: 'How we protect your data and digital assets.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-serif font-bold mb-2 text-[#0f172a] flex items-center gap-3">
            <Shield className="h-10 w-10 text-[#e11d48]" />
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-lg mb-10">
            Your trust is our priority. Compliant with GDPR (EU) and CCPA (USA).
          </p>

          <div className="space-y-10">

            {/* SECTION 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">1. Data We Collect</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Account Data</h3>
                  <p className="text-sm text-slate-600">Email address, encrypted password, and optional profile information (Name, Phone for verification).</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Asset Data</h3>
                  <p className="text-sm text-slate-600">Messages, names, dates, and media files (photos/videos) uploaded to your virtual lock.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Payment Data</h3>
                  <p className="text-sm text-slate-600">Transaction history. <strong>We do NOT store credit card numbers.</strong> All payments are processed securely by Stripe.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Location Data</h3>
                  <p className="text-sm text-slate-600">Used momentarily to enable the AR features on the bridge. Not stored historically.</p>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">2. Public vs Private Data</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl">
                  <Eye className="h-6 w-6 text-blue-600 shrink-0 mt-1"/>
                  <div>
                    <h3 className="font-bold text-blue-900">Public Data (The Registry)</h3>
                    <p className="text-sm text-blue-800/80">
                      By default, the content of your lock (Names, Message, Date) is <strong>PUBLIC</strong>. It allows other users to see your lock on the virtual bridge, ensuring the social proof and value of your asset.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl">
                  <Lock className="h-6 w-6 text-slate-600 shrink-0 mt-1"/>
                  <div>
                    <h3 className="font-bold text-slate-900">Private Data</h3>
                    <p className="text-sm text-slate-600">
                      Your email, payment details, and private media (if the "Private Key" option was purchased) remain strictly confidential.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>To provide the Service (Displaying locks in 3D/AR).</li>
                <li>To process transactions and payouts.</li>
                <li>To prevent fraud and ensure security.</li>
                <li>To communicate with you regarding your assets (Purchase confirmation, Resale offers).</li>
              </ul>
            </section>

            {/* SECTION 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">4. Your Rights</h2>
              <p className="text-slate-600 mb-4">
                Under the GDPR, you have the right to access, rectify, or delete your personal data.
              </p>
              <div className="bg-slate-900 text-white p-6 rounded-xl text-center">
                <p className="mb-4">To exercise your rights or request account deletion:</p>
                <a href="mailto:privacy@lovelockparis.com" className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors">
                  Contact Data Protection Officer
                </a>
              </div>
            </section>

          </div>

          <footer className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-400 text-center">
            Last updated: January 2025 • LoveLockParis™
          </footer>
        </div>
      </div>
    </div>
  );
}