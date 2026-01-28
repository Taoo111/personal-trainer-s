export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header placeholder */}
      <div className="h-20 border-b border-border" />

      {/* Breadcrumb skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-5 w-40 bg-secondary rounded animate-pulse" />
      </div>

      {/* Product Section skeleton */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image skeleton */}
          <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />

          {/* Info skeleton */}
          <div className="flex flex-col">
            {/* Title */}
            <div className="mb-8">
              <div className="h-12 w-3/4 bg-secondary rounded animate-pulse mb-4" />
              <div className="h-14 w-1/3 bg-secondary rounded animate-pulse" />
            </div>

            {/* Description */}
            <div className="mb-8 space-y-3">
              <div className="h-6 w-1/4 bg-secondary rounded animate-pulse" />
              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-secondary rounded animate-pulse" />
            </div>

            {/* Features skeleton */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-20 bg-secondary rounded-xl animate-pulse" />
              <div className="h-20 bg-secondary rounded-xl animate-pulse" />
            </div>

            {/* Button skeleton */}
            <div className="h-14 bg-secondary rounded-lg animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  )
}
