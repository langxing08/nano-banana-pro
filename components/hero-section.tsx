import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container relative">
        <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
          <Badge variant="secondary" className="gap-2 px-4 py-2">
            <span className="text-lg">🍌</span>
            <span>The AI model that outperforms competitors</span>
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">Nano Banana</h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl text-pretty leading-relaxed">
            Transform any image with simple text prompts. Advanced AI delivers consistent character editing and scene
            preservation that surpasses the competition. Experience the future of AI image editing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base">
              Start Editing 🍌
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              View Examples
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              One-shot editing
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              Multi-image support
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              Natural language
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
