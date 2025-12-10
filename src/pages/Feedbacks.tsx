import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedbackSection } from "@/components/FeedbackSection";

const Feedbacks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Avaliações dos Clientes
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja o que nossos clientes estão falando sobre a Pizzaria Paulistana
            </p>
          </div>
        </section>

        <FeedbackSection />
      </main>

      <Footer />
    </div>
  );
};

export default Feedbacks;
