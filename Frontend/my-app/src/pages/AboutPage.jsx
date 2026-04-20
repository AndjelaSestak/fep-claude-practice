import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* Hero sekcija */}
        <section className="bg-primary-light flex flex-col items-center justify-center text-center px-8 py-24">
          <h1 className="text-5xl font-bold text-gray-900">
            About <span className="text-primary">SecureBank</span>
          </h1>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg">
            We're on a mission to make banking accessible, secure, and effortless for everyone.
            Founded in 2020, SecureBank has grown to serve over 500,000 customers worldwide.
          </p>
        </section>

        {/* Our Story sekcija */}
        <section className="px-16 py-12 flex gap-16 items-start max-w-6xl mx-auto">
          
          {/* Tekst levo */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600">
              SecureBank was born from a simple observation: traditional banking was too
              complicated, too expensive, and too inaccessible for millions of people around the world.
            </p>
            <p className="text-gray-600">
              Our founders, a team of fintech veterans and security experts, set out to create
              a banking platform that would put users first—combining cutting-edge technology
              with bank-grade security and an intuitive user experience.
            </p>
            <p className="text-gray-600">
              Today, we're proud to serve over half a million customers across 150 countries,
              processing billions in transactions while maintaining our commitment to security,
              transparency, and excellent customer service.
            </p>
            <p className="text-primary font-medium">
              This is an educational platform demonstrating modern banking features and best practices.
            </p>
          </div>

          {/* Statistika desno */}
          <div className="w-80 bg-primary-light rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <p className="text-6xl font-bold text-primary">500K+</p>
            <p className="text-xl font-semibold text-gray-900 mt-4">Active Users</p>
            <p className="text-gray-500 mt-2">Trusting SecureBank with their finances</p>
          </div>

        </section>

        {/* Educational Platform sekcija */}
        <section className="px-16 py-12 max-w-6xl mx-auto">
          <div className="bg-primary-light rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Educational Platform</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              SecureBank is designed as an educational platform to demonstrate modern banking features,
              security best practices, and user experience design. This platform showcases how a
              comprehensive banking application should be structured, from user authentication and
              transaction management to admin oversight and security protocols.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;