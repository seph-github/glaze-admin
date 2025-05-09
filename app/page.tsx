export default async function Home() {
  console.log("Home page");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Glaze!
        </h1>
        <p className="text-lg text-muted-foreground max-w-prose">
          Glaze is your ultimate platform for managing and exploring content.
          Whether you&#39;re here to collaborate, create, or simply stay
          organized, we&#39;ve got you covered.
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-primary text-white rounded-md text-lg font-medium hover:bg-primary-dark transition"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="px-6 py-3 bg-muted text-foreground rounded-md text-lg font-medium hover:bg-muted-dark transition"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}
