export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🍌</span>
            <span className="text-gray-300 text-sm">2025 imgeditor.co All rights reserved.</span>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-500 text-sm">
            Independent product. Not affiliated with Google or AI model providers.
          </p>

          {/* Footer Links */}
          <nav className="flex flex-wrap gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
              Refund Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
              Refund Application
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
