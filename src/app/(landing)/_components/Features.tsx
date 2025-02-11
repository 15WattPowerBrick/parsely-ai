import { UploadCloud, FileText, CheckCircle } from "lucide-react";

export default function Features() {
  return (
    <>
      {/* Features Section */}
      <section className="py-16 w-full max-w-4xl text-center space-y-12">
        <h2 className="text-3xl font-bold">Why Use Parsely?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FileText className="text-blue-500 w-10 h-10" />}
            title="Accurate Parsing"
            text="Extracts key details with high accuracy."
          />
          <FeatureCard
            icon={<CheckCircle className="text-green-500 w-10 h-10" />}
            title="AI-Powered"
            text="Uses Google's Gemini AI for precise results."
          />
          <FeatureCard
            icon={<UploadCloud className="text-purple-500 w-10 h-10" />}
            title="Easy Upload"
            text="Upload resumes in seconds and get results instantly."
          />
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{text}</p>
    </div>
  );
}
