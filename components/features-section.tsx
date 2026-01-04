import { Cpu, Copy, Target, Code, Layers, Users } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "Natural Language Editing",
    description:
      "Edit images using simple text prompts. Nano-banana AI understands complex instructions like GPT for images",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Copy,
    title: "Character Consistency",
    description:
      "Maintain perfect character details across edits. This model excels at preserving faces and identities",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Target,
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
    gradient: "from-orange-600 to-red-500",
  },
  {
    icon: Code,
    title: "One-Shot Editing",
    description:
      "Perfect results in a single attempt. Nano-banana solves one-shot image editing challenges effortlessly",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Layers,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Users,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
    gradient: "from-orange-600 to-red-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-semibold mb-3">Core Features</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Why Choose Nano Banana?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nano-banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
            language understanding
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50/50 to-white border-2 border-yellow-200/60 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
