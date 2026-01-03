import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Refund Policy - LoveLockParis',
  description: 'Refund Policy for digital goods purchased on LoveLockParis.com',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-gradient">Refund Policy</h1>

          <Alert className="mb-8 border-amber-500/50 bg-amber-950/30">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-100">
              Please read this policy carefully before making a purchase. Digital goods have special refund conditions.
            </AlertDescription>
          </Alert>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Digital Goods Exception</h2>
            <div className="bg-zinc-900 p-6 rounded-lg mb-6">
              <p className="mb-4 text-muted-foreground">
                Our products (Virtual Locks, Keys, Customizations) are <strong>intangible digital goods</strong> delivered
                instantly via our WebApp.
              </p>
              <p className="font-semibold text-amber-400 text-lg">
                Therefore, we do not offer refunds once the order is confirmed and the product is delivered to your digital wallet/account.
              </p>
            </div>

            <p className="text-muted-foreground">
              This policy is in accordance with the French Consumer Code <strong>Article L221-28</strong>, which exempts
              digital content delivered immediately from the standard 14-day withdrawal period.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Why No Refunds?</h2>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
              <li>
                <strong>Instant Delivery:</strong> Your virtual lock is created and stored in our database immediately upon payment
              </li>
              <li>
                <strong>Customization:</strong> Each lock is personalized with your chosen content, making it a custom digital item
              </li>
              <li>
                <strong>Blockchain Integration:</strong> Some locks may be minted as NFTs, which are immutable once created
              </li>
              <li>
                <strong>Resource Allocation:</strong> Your lock number is reserved exclusively for you, preventing others from using it
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Exceptions</h2>
            <div className="bg-green-950/30 border border-green-500/50 p-6 rounded-lg">
              <p className="mb-4 font-semibold text-green-400">We will process refunds in these specific cases:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Technical Error:</strong> A technical error prevented the delivery of the product to your account
                </li>
                <li>
                  <strong>Double Charging:</strong> You were charged twice for the same item due to a payment gateway error
                </li>
                <li>
                  <strong>Service Unavailability:</strong> The service was unavailable and we could not fulfill your order
                </li>
                <li>
                  <strong>Fraudulent Transaction:</strong> Your payment was made without your authorization (subject to investigation)
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">How to Request a Refund</h2>
            <p className="mb-4 text-muted-foreground">
              If you believe you qualify for a refund under the exceptions listed above:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                <li>
                  Contact our support team at <a href="mailto:support@lovelockparis.com" className="text-primary hover:underline">support@lovelockparis.com</a>
                </li>
                <li>
                  Include your order number and email address
                </li>
                <li>
                  Describe the issue in detail with any relevant screenshots
                </li>
                <li>
                  Submit your request <strong>within 48 hours</strong> of the transaction
                </li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                Refund requests submitted after 48 hours may not be processed.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Refund Processing Time</h2>
            <p className="text-muted-foreground mb-4">
              If your refund is approved:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We will process the refund within 5-7 business days</li>
              <li>The refund will be credited to your original payment method</li>
              <li>Depending on your bank, it may take an additional 3-5 business days for the refund to appear in your account</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Alternative: Resale Marketplace</h2>
            <div className="bg-blue-950/30 border border-blue-500/50 p-6 rounded-lg">
              <p className="mb-4 text-blue-100">
                Instead of a refund, consider listing your lock on our <strong>Resale Marketplace</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Sell your lock to another user who wants that specific number</li>
                <li>Set your own resale price</li>
                <li>A 30% commission applies to marketplace sales</li>
                <li>Funds are credited to your LoveLockParis wallet</li>
              </ul>
              <p className="mt-4 text-sm text-blue-300">
                This is often a better option than requesting a refund, especially for premium lock numbers.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Chargebacks</h2>
            <div className="bg-red-950/30 border border-red-500/50 p-6 rounded-lg">
              <p className="mb-4 font-semibold text-red-400">Warning About Chargebacks:</p>
              <p className="text-muted-foreground">
                Filing a chargeback instead of contacting us first may result in:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Immediate suspension of your account</li>
                <li>Loss of access to all purchased locks</li>
                <li>Permanent ban from the platform</li>
              </ul>
              <p className="mt-4 text-red-300">
                Please contact us first to resolve any issues. We are committed to fair and honest customer service.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Refund Policy, please contact us:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <p className="mb-2"><strong>Email:</strong> <a href="mailto:support@lovelockparis.com" className="text-primary hover:underline">support@lovelockparis.com</a></p>
              <p className="mb-2"><strong>Response Time:</strong> Within 24-48 hours</p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-zinc-800">
            <p className="text-sm text-muted-foreground">
              Last updated: December 2024
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
