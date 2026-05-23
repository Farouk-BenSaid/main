import About from "./components/About";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Playground from "./components/Playground";
import Projects from "./components/Projects";

const page = () => {
  return (
    <main className="relative w-full bg-(--color-bg) text-white selection:bg-(--color-accent-blue)/30 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Playground />
      <Contact />
    </main>
  );
};

export default page;
