'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

const pricingFAQs: FAQItem[] = [
  {
    question: 'What are credits and how do they work?',
    answer: '2 credits generate 1 high-quality image. Credits refresh monthly and do not roll over to the next month. You can use credits for any AI model available in your plan.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at the start of your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! New users get 50 free credits to try Nano Banana. No credit card required. This allows you to generate up to 25 images and experience our AI capabilities.',
  },
  {
    question: 'What\'s included in the Commercial Use License?',
    answer: 'All paid plans include a Commercial Use License, which allows you to use generated images for commercial purposes including marketing, products, and client work without additional fees.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access to your plan until the end of your current billing period.',
  },
  {
    question: 'What\'s the difference between Nano Banana and SeeDream 4?',
    answer: 'Nano Banana is our flagship model optimized for speed and general-purpose image generation. SeeDream 4 is our premium model that excels at photorealistic images and complex scenes. Pro and Max plans include access to both models.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day money-back guarantee for first-time subscribers. If you\'re not satisfied with our service, contact support within 7 days of your first payment for a full refund.',
  },
]

/**
 * PricingFAQ 组件 - 定价相关 FAQ
 * Requirements: 3.6
 */
export function PricingFAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Everything you need to know about our pricing</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {pricingFAQs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
