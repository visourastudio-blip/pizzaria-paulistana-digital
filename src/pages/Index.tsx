import { useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Clock, MapPin, ChevronRight, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { MenuCard } from "@/components/MenuCard";
import { FeedbackSection } from "@/components/FeedbackSection";
import { PizzaCustomizer } from "@/components/PizzaCustomizer";
import { Button } from "@/components/ui/button";
import { MENU_ITEMS, MenuItem, BUSINESS_INFO } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Index = () => {
  const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null);
  const { addItem } = useCart();

  const specialItems = MENU_ITEMS.filter((item) => item.isSpecial);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: "",
      menuItem: item,
      quantity: 1,
      totalPrice: item.price,
    });
    toast.success("Item adicionado ao carrinho!", {
      description: item.name,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Specialties Section */}
        <section className="py-16 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-4">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Especialidades da Casa</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                As Mais Pedidas
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pizzas preparadas com ingredientes selecionados, massa de fermentação natural
                de 48 horas e assadas em forno a lenha
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialItems.slice(0, 4).map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MenuCard
                    item={item}
                    onAddToCart={() => handleAddToCart(item)}
                    onCustomize={
                      item.category === "pizzas" ? () => setSelectedPizza(item) : undefined
                    }
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/cardapio">
                <Button variant="outline" size="lg" className="group">
                  Ver Cardápio Completo
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">Nossos Diferenciais</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Por que somos a escolha de São Paulo?
                </h2>
                <div className="space-y-4">
                  {BUSINESS_INFO.differentials.map((diff, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-foreground">{diff}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl border border-border p-6 text-center card-hover">
                  <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-foreground mb-1">30-45</h3>
                  <p className="text-sm text-muted-foreground">minutos de entrega</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6 text-center card-hover">
                  <MapPin className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-foreground mb-1">R$ 4,90</h3>
                  <p className="text-sm text-muted-foreground">taxa a partir de</p>
                </div>
                <div className="col-span-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-border p-6 text-center">
                  <h3 className="font-bold text-xl text-foreground mb-2">
                    Aceitamos todas as formas de pagamento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pix, Cartão, Dinheiro, Vale Refeição
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <FeedbackSection />
      </main>

      <Footer />

      {/* Pizza Customizer Modal */}
      {selectedPizza && (
        <PizzaCustomizer
          pizza={selectedPizza}
          onClose={() => setSelectedPizza(null)}
        />
      )}
    </div>
  );
};

export default Index;
