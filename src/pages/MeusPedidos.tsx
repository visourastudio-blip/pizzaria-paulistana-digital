import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Phone,
  CreditCard,
  ChefHat,
  Package,
  Truck,
  Check,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/data/menu";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode; variant: string; color: string }
> = {
  pending: {
    label: "Aguardando",
    icon: <Clock className="w-4 h-4" />,
    variant: "outline",
    color: "text-muted-foreground",
  },
  preparing: {
    label: "Em Preparo",
    icon: <ChefHat className="w-4 h-4" />,
    variant: "preparing",
    color: "text-warning",
  },
  ready: {
    label: "Pronto",
    icon: <Package className="w-4 h-4" />,
    variant: "ready",
    color: "text-info",
  },
  delivery: {
    label: "Saiu para Entrega",
    icon: <Truck className="w-4 h-4" />,
    variant: "delivery",
    color: "text-success",
  },
  completed: {
    label: "Entregue",
    icon: <Check className="w-4 h-4" />,
    variant: "success",
    color: "text-success",
  },
};

const MeusPedidos = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  const { customerOrders } = useOrders();

  useEffect(() => {
    if (!isAuthenticated || userType !== "customer") {
      navigate("/login-cliente");
    }
  }, [isAuthenticated, userType, navigate]);

  if (!isAuthenticated || userType !== "customer") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Meus Pedidos</h1>

          {customerOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Nenhum pedido ainda
              </h2>
              <p className="text-muted-foreground mb-6">
                Que tal fazer seu primeiro pedido?
              </p>
              <Button onClick={() => navigate("/cardapio")} variant="hero">
                Ver Cardápio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const status = statusConfig[order.status];

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg text-foreground">{order.id}</h3>
            <Badge variant={status.variant as any} className="gap-1">
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xl font-bold text-primary">
            R$ {order.total.toFixed(2).replace(".", ",")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/acompanhar/${order.id}`)}
          >
            Acompanhar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {order.deliveryType === "delivery" ? (
            <>
              <MapPin className="w-4 h-4" />
              <span className="truncate">{order.address}</span>
            </>
          ) : (
            <>
              <Package className="w-4 h-4" />
              <span>Retirada no local</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard className="w-4 h-4" />
          <span>{order.paymentMethod}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Previsão: {order.estimatedTime}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Itens do pedido:</p>
        <div className="flex flex-wrap gap-2">
          {order.items.map((item, index) => (
            <span
              key={index}
              className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
            >
              {item.quantity}x{" "}
              {item.flavors
                ? item.flavors.map((f) => f.name).join(" / ")
                : item.menuItem.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeusPedidos;
