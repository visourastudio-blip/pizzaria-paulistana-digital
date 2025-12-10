import { useState } from "react";
import { X, Plus, Minus, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MenuItem,
  MENU_ITEMS,
  PIZZA_SIZES,
  STUFFED_CRUSTS,
  EXTRAS,
  PizzaSize,
  StuffedCrust,
  Extra,
} from "@/data/menu";
import { useCart, calculatePizzaPrice } from "@/contexts/CartContext";
import { toast } from "sonner";

interface PizzaCustomizerProps {
  pizza: MenuItem;
  onClose: () => void;
}

export function PizzaCustomizer({ pizza, onClose }: PizzaCustomizerProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState<PizzaSize>(PIZZA_SIZES[1]);
  const [selectedFlavors, setSelectedFlavors] = useState<MenuItem[]>([pizza]);
  const [stuffedCrust, setStuffedCrust] = useState<StuffedCrust>(STUFFED_CRUSTS[0]);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [observations, setObservations] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1);

  const availablePizzas = MENU_ITEMS.filter((item) => item.category === "pizzas");

  const toggleFlavor = (flavor: MenuItem) => {
    if (selectedFlavors.find((f) => f.id === flavor.id)) {
      if (selectedFlavors.length > 1) {
        setSelectedFlavors(selectedFlavors.filter((f) => f.id !== flavor.id));
      }
    } else if (selectedFlavors.length < size.maxFlavors) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const toggleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const basePrice =
    selectedFlavors.reduce((sum, f) => sum + f.price, 0) / selectedFlavors.length;
  const totalPrice =
    calculatePizzaPrice(basePrice, size, stuffedCrust, selectedExtras) * quantity;

  const handleAddToCart = () => {
    addItem({
      id: "",
      menuItem: pizza,
      quantity,
      size,
      flavors: selectedFlavors,
      stuffedCrust: stuffedCrust.id !== "sem" ? stuffedCrust : undefined,
      extras: selectedExtras.length > 0 ? selectedExtras : undefined,
      observations: observations || undefined,
      totalPrice,
    });
    toast.success("Pizza adicionada ao carrinho!", {
      description: `${selectedFlavors.map((f) => f.name).join(" / ")} - ${size.name}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">Montar Pizza</h2>
            <p className="text-sm text-muted-foreground">Passo {step} de 4</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Steps Progress */}
        <div className="px-4 py-3 bg-muted/50">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(s)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </button>
                {s < 4 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Escolha o tamanho</h3>
              <div className="grid grid-cols-2 gap-3">
                {PIZZA_SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSize(s);
                      if (selectedFlavors.length > s.maxFlavors) {
                        setSelectedFlavors(selectedFlavors.slice(0, s.maxFlavors));
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      size.id === s.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.slices} fatias</p>
                    <p className="text-xs text-muted-foreground">
                      Até {s.maxFlavors} sabor{s.maxFlavors > 1 ? "es" : ""}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Escolha os sabores ({selectedFlavors.length}/{size.maxFlavors})
                </h3>
                {size.maxFlavors > 1 && (
                  <Badge variant="secondary">Meio a meio disponível</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {availablePizzas.map((p) => {
                  const isSelected = selectedFlavors.find((f) => f.id === p.id);
                  const canSelect =
                    selectedFlavors.length < size.maxFlavors || isSelected;
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleFlavor(p)}
                      disabled={!canSelect}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : canSelect
                          ? "border-border hover:border-primary/50"
                          : "border-border opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <p className="font-medium text-sm text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {p.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Borda recheada</h3>
                <div className="grid grid-cols-2 gap-3">
                  {STUFFED_CRUSTS.map((crust) => (
                    <button
                      key={crust.id}
                      onClick={() => setStuffedCrust(crust)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        stuffedCrust.id === crust.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-sm text-foreground">{crust.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {crust.price > 0
                          ? `+ R$ ${crust.price.toFixed(2).replace(".", ",")}`
                          : "Grátis"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Adicionais</h3>
                <div className="grid grid-cols-2 gap-3">
                  {EXTRAS.map((extra) => {
                    const isSelected = selectedExtras.find((e) => e.id === extra.id);
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-secondary bg-secondary/10"
                            : "border-border hover:border-secondary/50"
                        }`}
                      >
                        <p className="font-medium text-sm text-foreground">{extra.name}</p>
                        <p className="text-xs text-muted-foreground">
                          + R$ {extra.price.toFixed(2).replace(".", ",")}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Observações</h3>
              <Textarea
                placeholder="Ex: Sem cebola, bem assada, cortar em 8 fatias..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="min-h-[100px]"
              />

              {/* Summary */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-foreground">Resumo do pedido</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Tamanho:</strong> {size.name} ({size.slices} fatias)
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Sabores:</strong>{" "}
                  {selectedFlavors.map((f) => f.name).join(" / ")}
                </p>
                {stuffedCrust.id !== "sem" && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Borda:</strong> {stuffedCrust.name}
                  </p>
                )}
                {selectedExtras.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Adicionais:</strong>{" "}
                    {selectedExtras.map((e) => e.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-foreground w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xl font-bold text-primary">
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                Próximo
              </Button>
            ) : (
              <Button onClick={handleAddToCart} variant="hero" className="flex-1">
                Adicionar ao Carrinho
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
