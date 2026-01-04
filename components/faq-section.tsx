import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance for consistent character editing and scene preservation.",
  },
  {
    question: "How does it work?",
    answer:
      'Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it". It processes your text prompt and generates perfectly edited images.',
  },
  {
    question: "How is it better than Flux Kontext?",
    answer:
      "This model excels in character consistency, scene blending, and one-shot editing. Users report it significantly outperforms Flux Kontext in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.",
  },
  {
    question: "Can I use it for commercial projects?",
    answer:
      "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
  },
  {
    question: "What types of edits can it handle?",
    answer:
      'The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.',
  },
  {
    question: "Where can I try Nano Banana?",
    answer:
      "You can try Nano Banana right here on this page using the editor above. Simply upload an image and start editing with natural language prompts. For advanced features and batch processing, upgrade to our Pro plan.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-yellow-50/30">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-[#ff8c00] font-semibold text-lg mb-2">FAQs</p>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-2 border-yellow-400 rounded-2xl bg-white/50 overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${index}`} className="border-0">
                  <AccordionTrigger className="text-left text-lg font-semibold px-6 py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
