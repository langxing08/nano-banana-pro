import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

/**
 * 服务条款页面
 * Requirements: 8.2, 8.3, 8.4
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2026</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Nano Banana&apos;s AI image generation service (&quot;Service&quot;), you agree to be 
                bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not 
                use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nano Banana provides AI-powered image generation and editing tools. Our Service allows users 
                to create, edit, and transform images using artificial intelligence technology. Features and 
                capabilities may vary based on your subscription plan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Generate illegal, harmful, or offensive content</li>
                <li>Create deepfakes or misleading media without consent</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Generate content depicting minors inappropriately</li>
                <li>Attempt to bypass safety filters or content moderation</li>
                <li>Use the Service for spam or automated bulk generation</li>
                <li>Reverse engineer or attempt to extract our AI models</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Your Content:</strong> You retain ownership of images you upload. By uploading content, 
                you grant us a limited license to process and store it for providing the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Generated Content:</strong> Subject to these Terms and your subscription plan, you own 
                the images generated through our Service. Paid plans include a Commercial Use License allowing 
                you to use generated images for commercial purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Payment and Subscriptions</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Paid features require a subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Pay all applicable fees as described at time of purchase</li>
                <li>Automatic renewal unless cancelled before the renewal date</li>
                <li>No refunds for partial subscription periods (except as required by law)</li>
                <li>Credits do not roll over between billing periods</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NANO BANANA SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
                INTANGIBLE LOSSES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER 
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior 
                notice or liability, for any reason, including breach of these Terms. Upon termination, your 
                right to use the Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will provide notice of significant 
                changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your 
                continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of 
                California, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">Nano Banana Inc.</p>
                <p className="text-muted-foreground">Email: legal@nanobanana.ai</p>
                <p className="text-muted-foreground">Address: 123 AI Street, San Francisco, CA 94102</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
