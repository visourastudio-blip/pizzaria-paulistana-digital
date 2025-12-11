import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Store,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  Check,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { BUSINESS_INFO } from "@/data/menu";
import { toast } from "sonner";

type DeliveryType = "delivery" | "pickup";
type PaymentMethod = "pix" | "credit" | "debit" | "cash" | "voucher";

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: "pix", label: "Pix", icon: <Smartphone className="w-5 h-5" /> },
  { id: "credit", label: "Cartão de Crédito", icon: <CreditCard className="w-5 h-5" /> },
  { id: "debit", label: "Cartão de Débito", icon: <CreditCard className="w-5 h-5" /> },
  { id: "cash", label: "Dinheiro", icon: <Banknote className="w-5 h-5" /> },
  { id: "voucher", label: "Vale Refeição", icon: <Wallet className="w-5 h-5" /> },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [change, setChange] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Faça login para finalizar o pedido");
      navigate("/login-cliente");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }
    if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const deliveryFee = deliveryType === "delivery" ? BUSINESS_INFO.deliveryFee : 0;
  const grandTotal = total + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      toast.error("Preencha seu nome e telefone");
      return;
    }

    if (deliveryType === "delivery" && (!address || !addressNumber || !neighborhood)) {
      toast.error("Preencha o endereço completo");
      return;
    }

    setIsSubmitting(true);

    const fullAddress =
      deliveryType === "delivery"
        ? `${address}, ${addressNumber}${complement ? ` - ${complement}` : ""}, ${neighborhood}`
        : undefined;

    const order = await addOrder({
      items,
      total: grandTotal,
      customerName: name,
      customerPhone: phone,
      deliveryType,
      address: fullAddress,
      paymentMethod: paymentMethods.find((m) => m.id === paymentMethod)?.label || paymentMethod,
    });

    if (order) {
      clearCart();
      toast.success("Pedido realizado com sucesso!", {
        description: `Código do pedido: #${order.id.slice(0, 8)}`,
      });
      navigate(`/acompanhar/${order.id}`);
    } else {
      toast.error("Erro ao criar pedido. Tente novamente.");
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/carrinho");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Finalizar Pedido</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Seus Dados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nome completo *
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Telefone / WhatsApp *
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Type */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Tipo de Entrega
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      deliveryType === "delivery"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <MapPin className="w-6 h-6 text-primary mb-2" />
                    <p className="font-semibold text-foreground">Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {BUSINESS_INFO.deliveryFee.toFixed(2).replace(".", ",")}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      deliveryType === "pickup"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Store className="w-6 h-6 text-secondary mb-2" />
                    <p className="font-semibold text-foreground">Retirada</p>
                    <p className="text-sm text-muted-foreground">Grátis</p>
                  </button>
                </div>

                {/* Address */}
                {deliveryType === "delivery" && (
                  <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Endereço *
                        </label>
                        <Input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Rua, Avenida..."
                          required={deliveryType === "delivery"}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Número *
                        </label>
                        <Input
                          value={addressNumber}
                          onChange={(e) => setAddressNumber(e.target.value)}
                          placeholder="123"
                          required={deliveryType === "delivery"}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Complemento
                        </label>
                        <Input
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          placeholder="Apto, Bloco..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Bairro *
                        </label>
                        <Input
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="Seu bairro"
                          required={deliveryType === "delivery"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {deliveryType === "pickup" && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-fade-in">
                    <p className="text-sm text-foreground font-medium mb-1">
                      Retire seu pedido em:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {BUSINESS_INFO.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Forma de Pagamento
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-primary">{method.icon}</div>
                      <span className="text-sm font-medium text-foreground">
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "cash" && (
                  <div className="mt-4 animate-fade-in">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Troco para quanto?
                    </label>
                    <Input
                      value={change}
                      onChange={(e) => setChange(e.target.value)}
                      placeholder="Ex: R$ 100,00 (deixe vazio se não precisar)"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x{" "}
                        {item.flavors
                          ? item.flavors.map((f) => f.name).join(" / ")
                          : item.menuItem.name}
                      </span>
                      <span className="text-foreground">
                        R$ {item.totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxa de entrega</span>
                    <span>
                      {deliveryFee > 0
                        ? `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`
                        : "Grátis"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">
                      R$ {grandTotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full mt-6"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : "Confirmar Pedido"}
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
