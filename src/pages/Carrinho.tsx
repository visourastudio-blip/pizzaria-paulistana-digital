import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Pizza } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { BUSINESS_INFO } from "@/data/menu";

const Carrinho = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const deliveryFee = BUSINESS_INFO.deliveryFee;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20 md:pt-24 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-muted-foreground mb-6">
              Adicione deliciosas pizzas ao seu pedido
            </p>
            <Link to="/cardapio">
              <Button variant="hero" size="lg">
                Ver Cardápio
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Seu Carrinho</h1>
            <Button variant="ghost" onClick={clearCart} className="text-destructive">
              Limpar Carrinho
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-border p-4 flex gap-4 animate-fade-in"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {item.flavors
                            ? item.flavors.map((f) => f.name).join(" / ")
                            : item.menuItem.name}
                        </h3>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">
                            {item.size.name} ({item.size.slices} fatias)
                          </p>
                        )}
                        {item.stuffedCrust && (
                          <p className="text-xs text-muted-foreground">
                            {item.stuffedCrust.name}
                          </p>
                        )}
                        {item.extras && item.extras.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            + {item.extras.map((e) => e.name).join(", ")}
                          </p>
                        )}
                        {item.observations && (
                          <p className="text-xs text-muted-foreground italic">
                            Obs: {item.observations}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-bold text-primary">
                        R$ {item.totalPrice.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxa de entrega</span>
                    <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">
                      R$ {grandTotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button variant="hero" className="w-full" size="lg">
                    Finalizar Pedido
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link to="/cardapio">
                  <Button variant="ghost" className="w-full mt-3">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Carrinho;
