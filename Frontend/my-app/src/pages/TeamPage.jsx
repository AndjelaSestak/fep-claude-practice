import Navbar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import TeamCard from '../components/ui/TeamCardWrapper'

const TeamPage = () => {
  return (
    <div>
      <Navbar />
      <main>
        <section className="bg-primary-light px-8 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Meet Our <span className="text-primary">Team</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-500">
              We&apos;re a diverse team of banking experts, engineers, designers,
              and customer advocates united by a shared mission to transform the
              banking experience.
            </p>
          </div>
        </section>

        <section className="bg-surface px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">
                Leadership Team
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-500">
                Meet the experienced leaders guiding SecureBank&apos;s vision.
              </p>
            </div>

            <div className="mt-14 grid gap-8 xl:grid-cols-2">

              
              <TeamCard hover>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/stasa.png"  
                    alt="Stasa Dragovic"
                    className="mb-6 h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-semibold text-slate-900">Stasa Dragovic</h3>
                  <p className="mt-2 text-lg text-green-500">Full Stack Developer</p>
                </div>
                <p className="mt-6 text-base leading-7 text-slate-500">
                  A confident and outspoken leader with outstanding organizational abilities and strong development expertise built from an early start in high school, further refined through academic experience at university in the capital.
                </p>
              </TeamCard>

              
              <TeamCard hover>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/andjela.png"  
                    alt="Andjela Sestak"
                    className="mb-6 h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-semibold text-slate-900">Andjela Sestak</h3>
                  <p className="mt-2 text-lg text-green-500">Full Stack Developer</p>
                </div>
                <p className="mt-6 text-base leading-7 text-slate-500">
                  A highly adaptable developer with a keen eye for detail, known for deep, in-depth work and playing a key role in maintaining team balance and cohesion.
                </p>
              </TeamCard>

             
              <TeamCard hover>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/lazar.png"  
                    alt="Lazar Mrdjenovic"
                    className="mb-6 h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-semibold text-slate-900">Lazar Mrdjenovic</h3>
                  <p className="mt-2 text-lg text-green-500">Full Stack Developer</p>
                </div>
                <p className="mt-6 text-base leading-7 text-slate-500">
                  A highly efficient, reliable developer and an ideal teammate, whose experience in the gaming industry was instrumental in designing this platform.
                </p>
              </TeamCard>

             
              <TeamCard hover>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/vladimir.png"  
                    alt="Vladimir Josic"
                    className="mb-6 h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-semibold text-slate-900">Vladimir Josic</h3>
                  <p className="mt-2 text-lg text-green-500">Full Stack Developer</p>
                </div>
                <p className="mt-6 text-base leading-7 text-slate-500">
                  A dedicated and versatile developer with a strong focus on building well-structured solutions, while fostering a positive team atmosphere and keeping morale high.
                </p>
              </TeamCard>

          
              <div className="xl:col-span-2 flex justify-center">
              <div className="xl:w-1/2">
              <TeamCard hover>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/visnja.png"
                    alt="Visnja Stojsin"
                    className="mb-6 h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-semibold text-slate-900">Visnja Stojsin</h3>
                  <p className="mt-2 text-lg text-green-500">ML Engineer</p>
                </div>
                <p className="mt-6 text-base leading-7 text-slate-500">
                  A passionate machine learning engineer with a strong analytical mindset, bringing data-driven insights and intelligent solutions to the platform while bridging the gap between engineering and innovation.
                </p>
              </TeamCard>
              </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;