import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center space-y-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered Resume Parsing with{" "}
          <span className="text-blue-600">Parsely</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your resume and let AI extract all key details in seconds.
        </p>
        <Button className="px-6 py-3 text-lg font-semibold">Try Now</Button>
      </section>
    </>
  );
}
