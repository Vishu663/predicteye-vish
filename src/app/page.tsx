import { ArrowRight, BarChart3, Clock, DollarSign, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              AI-Powered <span className="text-primary">Resale Prediction</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Get accurate resale value predictions for furniture and jewelry
              using advanced AI-powered insights and market analysis.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Try It Now <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-6 py-3 text-base font-medium hover:bg-muted/50"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Preview Card */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/20">
            <Link href={"/chat"} className="">
              {/* Drag and Drop Section */}
              <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted p-6 transition hover:border-primary hover:bg-muted/10">
                <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-muted/20">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="mb-2 text-center font-medium">
                  Drag & Drop Image
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  or click to upload
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our AI-powered platform offers a range of features to help you get
              the most accurate resale predictions.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-card p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Accurate Valuations</h3>
              <p className="text-muted-foreground">
                Get precise market valuations based on historical data and
                current market trends.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-card p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Future Predictions</h3>
              <p className="text-muted-foreground">
                Forecast the value of your items years into the future with our
                advanced AI models.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-card p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Market Analysis</h3>
              <p className="text-muted-foreground">
                Understand market trends and factors affecting the value of your
                items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get accurate resale predictions in just three simple steps.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-medium">Upload Image</h3>
              <p className="text-muted-foreground">
                Upload a clear image of your furniture or jewelry item.
              </p>
              {/* Connector line for desktop */}
              <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-muted md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-medium">Enter Details</h3>
              <p className="text-muted-foreground">
                Provide basic information about your item and the prediction
                year.
              </p>
              {/* Connector lines for desktop */}
              <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-muted md:block"></div>
              <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-muted md:block"></div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-medium">Get Prediction</h3>
              <p className="text-muted-foreground">
                Receive a detailed resale value prediction with market insights.
              </p>
              {/* Connector line for desktop */}
              <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-muted md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-2xl bg-primary/10 p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Join thousands of users who are making informed decisions about
              their resale items.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try It Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
