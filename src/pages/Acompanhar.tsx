import { useParams, Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  Phone,
  CreditCard,
  ChefHat,
  Package,
  Truck,
  Check,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders, OrderStatus } from "@/contexts/OrderContext";
import { BUSINESS_INFO } from "@/data/menu";

const steps: { status: string; label: string; icon: React.ReactNode }[] = [
  { status: "pending", label: "Pedido Recebido", icon: <Clock className="w-5 h-5" /> },
  { status: "preparing", label: "Em Preparo", icon: <ChefHat className="w-5 h-5" /> },
  { status: "ready", label: "Pronto", icon: <Package className="w-5 h-5" /> },
  { status: "delivered", label: "Saiu para Entrega", icon: <Truck className="w-5 h-5" /> },
];

const statusOrder: Record<string, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  delivered: 3,
  cancelled: -1,
};

const Acompanhar = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrders();

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20 md:pt-24 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Pedido não encontrado
            </h1>
            <p className="text-muted-foreground mb-6">
              Verifique o código do pedido e tente novamente
            </p>
            <Link to="/">
              <Button variant="hero">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStep = statusOrder[order.status] ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/meus-pedidos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para meus pedidos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Pedido #{order.id.slice(0, 8)}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {steps[Math.max(0, currentStep)]?.label || order.status}
                  </Badge>
                </div>

                <div className="relative">
                  <div className="absolute left-[22px] top-0 bottom-0 w-1 bg-muted rounded-full" />
                  <div
                    className="absolute left-[22px] top-0 w-1 bg-primary rounded-full transition-all duration-500"
                    style={{ height: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
                  />

                  <div className="space-y-8">
                    {steps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <div key={step.status} className="flex items-center gap-4 relative">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                              isCompleted
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/30 scale-110" : ""}`}
                          >
                            {step.icon}
                          </div>
                          <div>
                            <p className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                              {step.label}
                            </p>
                            {isCurrent && order.status !== "delivered" && (
                              <p className="text-sm text-primary animate-pulse">Status atual</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Itens do Pedido</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {item.flavors ? item.flavors.map((f: any) => f.name).join(" / ") : item.menuItem?.name || "Item"}
                        </p>
                        {item.size && <p className="text-sm text-muted-foreground">{item.size.name}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{item.quantity}x</p>
                        <p className="text-sm text-muted-foreground">R$ {item.totalPrice.toFixed(2).replace(".", ",")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">Detalhes do Pedido</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {order.delivery_type === "delivery" ? "Entregar em" : "Retirar em"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.delivery_type === "delivery" ? order.customer_address : BUSINESS_INFO.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Telefone</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Pagamento</p>
                      <p className="text-sm text-muted-foreground">{order.payment_method}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Previsão</p>
                      <p className="text-sm text-muted-foreground">{order.estimated_time}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">R$ {Number(order.total).toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Acompanhar;
