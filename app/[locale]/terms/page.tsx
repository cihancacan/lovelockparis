import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - LoveLockParis',
  description: 'Terms and Conditions of Sale for the Love Lock Paris Virtual Registry.',
};

export default function TermsPage() {
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
            <FileText className="h-10 w-10 text-[#e11d48]" />
            Terms of Service
          </h1>
          <p className="text-slate-500 text-lg mb-10">
            General Terms and Conditions of Sale (GTCS) - Updated 2025
          </p>

          <div className="space-y-12">
            
            {/* ARTICLE 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">1. Nature of the Service</h2>
              <p className="text-slate-600 mb-4">
                <strong>LoveLockParis.com</strong> provides a service of registration of virtual digital assets ("Digital Locks") geolocated on a virtual replica of the Pont des Arts in Paris.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <p className="text-amber-900 text-sm">
                  <strong>DISCLAIMER:</strong> The Customer acknowledges that the purchase concerns a <strong>strictly virtual item</strong> (Database entry). It does NOT grant any ownership of physical space on the real bridge in Paris. The visualization is done via Augmented Reality (AR) or 3D Web interface.
                </p>
              </div>
            </section>

            {/* ARTICLE 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">2. Digital Goods & No Refund Policy</h2>
              <p className="text-slate-600 mb-4">
                The Services provided by LoveLockParis consist of the supply of digital content not supplied on a tangible medium.
              </p>
              <p className="text-slate-600 mb-4">
                In accordance with <strong>Article L221-28 of the French Consumer Code</strong>, the Customer expressly waives their right of withdrawal (14-day cooling-off period) to benefit from the immediate execution of the service (Creation of the Lock, Generation of the Certificate, Database Entry).
              </p>
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                <p className="text-sm text-slate-700">
                  <strong>By clicking "Pay", the Customer agrees that the sale is final and non-refundable.</strong> Exceptions may be made solely in the event of a proven technical failure preventing the delivery of the digital asset.
                </p>
              </div>
            </section>

            {/* ARTICLE 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">3. Pricing & Marketplace</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Prices are displayed in USD ($) and include all applicable taxes.</li>
                <li>LoveLockParis reserves the right to modify prices at any time.</li>
                <li><strong>Secondary Market:</strong> Users may list their Digital Locks for resale on the platform.</li>
                <li><strong>Commissions:</strong> LoveLockParis retains a <strong>30% commission</strong> on any transaction carried out on the secondary market. The remaining 70% is credited to the seller's virtual balance.</li>
              </ul>
            </section>

            {/* ARTICLE 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">4. User Generated Content (UGC)</h2>
              <p className="text-slate-600 mb-4">
                The Customer is solely responsible for the text, names, and media (photos/videos) uploaded to their Lock.
              </p>
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <h3 className="font-bold text-red-800 text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle size={16}/> PROHIBITED CONTENT
                </h3>
                <p className="text-red-700/80 text-sm">
                  Hate speech, racism, nudity, pornography, violence, or copyrighted material without permission are strictly forbidden. LoveLockParis reserves the right to <strong>delete any non-compliant lock without refund</strong> and ban the user.
                </p>
              </div>
            </section>

            {/* ARTICLE 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">5. Service Availability & Durability</h2>
              <p className="text-slate-600">
                LoveLockParis commits to maintaining the availability of the virtual bridge and the Augmented Reality service ("Eternal Guarantee"). However, the company cannot be held responsible for network interruptions, GPS inaccuracies of the user's device, or maintenance periods.
                <br/><br/>
                The "Eternal" nature refers to the indefinite retention of data in the database as long as the service exists.
              </p>
            </section>

            {/* ARTICLE 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">6. Governing Law</h2>
              <p className="text-slate-600">
                These Terms are governed by <strong>French Law</strong>. In the event of a dispute, and failing an amicable solution, the courts of Evry (France) shall have exclusive jurisdiction, regardless of the Customer's country of residence.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}