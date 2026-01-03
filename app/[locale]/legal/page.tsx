import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, Building2, Server, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal Notice - LoveLockParis',
  description: 'Official corporate information for LoveLockParis.com',
};

export default function LegalPage() {
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
            <Scale className="h-10 w-10 text-[#e11d48]" />
            Legal Notice & Imprint
          </h1>
          <p className="text-slate-500 text-lg mb-10">
            Transparent corporate information in compliance with Article 6-III of the French LCEN Law.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* EDITOR */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#0f172a] flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600"/> Site Publisher
              </h2>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <p><strong className="text-slate-900">Company Name:</strong> PANORAMA GRUP</p>
                <p><strong className="text-slate-900">Legal Form:</strong> Entrepreneur Individuel (Sole Proprietorship)</p>
                <p><strong className="text-slate-900">Representative:</strong> Mr. CACAN CIHAN</p>
                <p><strong className="text-slate-900">Headquarters:</strong><br/>
                12 Rue des Genets<br/>91240 Saint-Michel-sur-Orge<br/>FRANCE</p>
                <div className="h-px bg-slate-200 my-2"></div>
                <p><strong className="text-slate-900">SIRET:</strong> 809 629 884 00036</p>
                <p><strong className="text-slate-900">VAT Number:</strong> FR61809629884</p>
                <p><strong className="text-slate-900">RCS:</strong> Evry 809 629 884</p>
              </div>
            </div>

            {/* HOSTING */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#0f172a] flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-600"/> Hosting Provider
              </h2>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <p>The website is hosted on the Vercel Edge Network.</p>
                <p><strong className="text-slate-900">Provider:</strong> Vercel Inc.</p>
                <p><strong className="text-slate-900">Address:</strong><br/>
                440 N Barranca Ave #4133<br/>Covina, CA 91723<br/>United States</p>
                <p><strong className="text-slate-900">Database Provider:</strong> Supabase Inc. (AWS Infrastructure)</p>
              </div>
            </div>
          </div>

          {/* CONTACT & IP */}
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                The brand <strong>LoveLockParis™</strong>, the domain name <code>lovelockparis.com</code>, the 3D models, the Augmented Reality source code, the design, and the database structure are the exclusive property of PANORAMA GRUP.
                <br/><br/>
                Any reproduction, representation, modification, publication, transmission, or distortion of all or part of the site or its content, by any process and on any medium whatsoever, is prohibited without the express written consent of PANORAMA GRUP. Failure to comply constitutes an infringement punishable by Articles L.335-2 et seq. of the French Intellectual Property Code.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">Contact</h2>
              <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">For any legal inquiries or support:</p>
                  <a href="mailto:contact@lovelockparis.com" className="text-lg font-bold text-[#e11d48] hover:underline">contact@lovelockparis.com</a>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-400 text-center">
            Last legal update: January 2025 • Registered in France.
          </footer>
        </div>
      </div>
    </div>
  );
}