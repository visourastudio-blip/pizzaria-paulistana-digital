import { useState } from "react";
import { Pizza, GlassWater, Cake, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { PizzaCustomizer } from "@/components/PizzaCustomizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

type Category = "all" | "pizzas" | "bebidas" | "sobremesas";

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "Todos", icon: null },
  { id: "pizzas", label: "Pizzas", icon: <Pizza className="w-4 h-4" /> },
  { id: "bebidas", label: "Bebidas", icon: <GlassWater className="w-4 h-4" /> },
  { id: "sobremesas", label: "Sobremesas", icon: <Cake className="w-4 h-4" /> },
];

const Cardapio = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null);
  const { addItem } = useCart();

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nosso Cardápio
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Escolha entre nossas deliciosas pizzas artesanais, bebidas refrescantes e
              sobremesas irresistíveis
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  {cat.icon}
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Nenhum item encontrado</p>
              </div>
            ) : (
              <>
                {activeCategory === "all" ? (
                  // Grouped by category
                  <>
                    {(["pizzas", "bebidas", "sobremesas"] as const).map((category) => {
                      const items = filteredItems.filter(
                        (item) => item.category === category
                      );
                      if (items.length === 0) return null;

                      const categoryData = categories.find((c) => c.id === category);
                      return (
                        <div key={category} className="mb-12">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {categoryData?.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-foreground capitalize">
                              {category}
                            </h2>
                            <span className="text-sm text-muted-foreground">
                              ({items.length} itens)
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((item, index) => (
                              <div
                                key={item.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                              >
                                <MenuCard
                                  item={item}
                                  onAddToCart={() => handleAddToCart(item)}
                                  onCustomize={
                                    item.category === "pizzas"
                                      ? () => setSelectedPizza(item)
                                      : undefined
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <MenuCard
                          item={item}
                          onAddToCart={() => handleAddToCart(item)}
                          onCustomize={
                            item.category === "pizzas"
                              ? () => setSelectedPizza(item)
                              : undefined
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
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

export default Cardapio;
