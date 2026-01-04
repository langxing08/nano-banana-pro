import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ApiCodeBlock, generateImageExamples } from '@/components/api-code-block'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Key, Zap, Shield, Clock } from 'lucide-react'

/**
 * API 文档页面
 * Requirements: 4.1-4.4
 */
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-yellow-50 to-background dark:from-yellow-950/20 dark:to-background">
          <div className="container text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🍌 API Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Nano Banana API
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Integrate powerful AI image generation into your applications with our simple REST API.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Key className="w-5 h-5 mr-2" />
              Get Your API Key
            </Button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">&lt;1s</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10M+</div>
                <div className="text-sm text-muted-foreground">API Calls/Day</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">256-bit</div>
                <div className="text-sm text-muted-foreground">SSL Encryption</div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Authentication</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  API Key Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  All API requests require authentication using an API key. Include your API key in the
                  <code className="mx-1 px-2 py-0.5 bg-muted rounded text-sm">Authorization</code>
                  header as a Bearer token.
                </p>
                <div className="bg-gray-950 rounded-lg p-4">
                  <code className="text-sm text-gray-100 font-mono">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your API key secure and never expose it in client-side code.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="py-16 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Rate Limits</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Request Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Plan</th>
                        <th className="text-left py-3 px-4 font-medium">Requests/Minute</th>
                        <th className="text-left py-3 px-4 font-medium">Requests/Day</th>
                        <th className="text-left py-3 px-4 font-medium">Concurrent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">Basic</td>
                        <td className="py-3 px-4">20</td>
                        <td className="py-3 px-4">1,000</td>
                        <td className="py-3 px-4">2</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Pro</td>
                        <td className="py-3 px-4">60</td>
                        <td className="py-3 px-4">10,000</td>
                        <td className="py-3 px-4">5</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Max</td>
                        <td className="py-3 px-4">200</td>
                        <td className="py-3 px-4">100,000</td>
                        <td className="py-3 px-4">20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">API Endpoints</h2>

            {/* Generate Image Endpoint */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white">POST</Badge>
                  <code className="text-lg font-mono">/v1/generate</code>
                </div>
                <p className="text-muted-foreground mt-2">
                  Generate images from text prompts using AI models.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Request Parameters */}
                <div>
                  <h4 className="font-semibold mb-3">Request Body</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Parameter</th>
                          <th className="text-left py-2 px-3 font-medium">Type</th>
                          <th className="text-left py-2 px-3 font-medium">Required</th>
                          <th className="text-left py-2 px-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-3"><code>prompt</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Text description of the image to generate</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3"><code>model</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Model to use: nano-banana, seedream-4</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3"><code>size</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Image size: 512x512, 1024x1024, 2048x2048</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3"><code>n</code></td>
                          <td className="py-2 px-3">integer</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Number of images to generate (1-4)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Code Examples */}
                <div>
                  <h4 className="font-semibold mb-3">Code Examples</h4>
                  <ApiCodeBlock examples={generateImageExamples} />
                </div>

                {/* Response */}
                <div>
                  <h4 className="font-semibold mb-3">Response</h4>
                  <div className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre">{`{
  "id": "gen_abc123",
  "created": 1699000000,
  "model": "nano-banana",
  "images": [
    {
      "url": "https://cdn.nanobanana.ai/images/abc123.png",
      "revised_prompt": "A futuristic city at sunset..."
    }
  ]
}`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Image Endpoint */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white">POST</Badge>
                  <code className="text-lg font-mono">/v1/edit</code>
                </div>
                <p className="text-muted-foreground mt-2">
                  Edit existing images using AI-powered transformations.
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Similar to the generate endpoint, but accepts an additional <code className="px-1 bg-muted rounded">image</code> parameter
                  with a base64-encoded image or URL to edit.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Sign up now and get 50 free API credits to test our powerful image generation capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Your API Key
              </Button>
              <Button size="lg" variant="outline">
                View Full Documentation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
