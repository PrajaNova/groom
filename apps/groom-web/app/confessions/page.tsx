import ScrollAnimation from "##/components/common/ScrollAnimation";
import ConfessionForm from "##/components/confession/ConfessionForm";
import ConfessionList from "##/components/confession/ConfessionLIst";

// Revalidate every 60 seconds to show new confessions
export const revalidate = 60;

const ConfessionPage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <ScrollAnimation>
        <header className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-[#2C3531] mb-4">
            The Quiet Corner
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            This is a space for quiet release. Share your feelings, fears, or
            reflections anonymously.{" "}
            <strong>No names, no tracking, just release.</strong>
          </p>
        </header>
      </ScrollAnimation>

      <ScrollAnimation delay={200}>
        <div className="max-w-4xl mx-auto">
          <ConfessionForm />
        </div>
      </ScrollAnimation>

      <section>
        <ScrollAnimation delay={200}>
          <h3 className="text-3xl font-bold text-[#2C3531] mb-8 text-center">
            What the Community is Sharing
          </h3>
        </ScrollAnimation>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ConfessionList />
        </div>
      </section>
    </main>
  );
};

export default ConfessionPage;
