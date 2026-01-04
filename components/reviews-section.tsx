import { Card, CardContent } from "@/components/ui/card"

const reviews = [
  {
    name: "AIArtistPro",
    role: "Digital Creator",
    color: "bg-amber-500",
    review:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
  },
  {
    name: "ContentCreator",
    role: "UGC Specialist",
    color: "bg-orange-500",
    review: "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
  },
  {
    name: "PhotoEditor",
    role: "Professional Editor",
    color: "bg-orange-400",
    review: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
  },
]

export function ReviewsSection() {
  return (
    <section className="py-20 relative">
      <div className="absolute left-4 top-8 text-6xl opacity-50 rotate-12">🍌</div>
      <div className="absolute right-4 top-8 text-6xl opacity-50 -rotate-12">🍌</div>

      <div className="container">
        <div className="text-center mb-12">
          <p className="text-brand font-semibold mb-2">User Reviews</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">What creators are saying</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="border-2 border-amber-200 bg-gradient-to-b from-amber-50/30 to-white hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full ${review.color}`}></div>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{review.review}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
