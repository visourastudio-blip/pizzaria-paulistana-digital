import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChefHat,
  Package,
  Truck,
  Check,
  Clock,
  LogOut,
  Pizza,
  RefreshCw,
  Phone,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { Order, OrderStatus, BUSINESS_INFO } from "@/data/menu";
import { toast } from "sonner";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode; variant: string; nextStatus?: OrderStatus; nextLabel?: string }
> = {
  pending: {
    label: "Aguardando",
    icon: <Clock className="w-4 h-4" />,
    variant: "outline",
    nextStatus: "preparing",
    nextLabel: "Iniciar Preparo",
  },
  preparing: {
    label: "Em Preparo",
    icon: <ChefHat className="w-4 h-4" />,
    variant: "preparing",
    nextStatus: "ready",
    nextLabel: "Marcar como Pronto",
  },
  ready: {
    label: "Pronto",
    icon: <Package className="w-4 h-4" />,
    variant: "ready",
    nextStatus: "delivery",
    nextLabel: "Saiu para Entrega",
  },
  delivery: {
    label: "Em Entrega",
    icon: <Truck className="w-4 h-4" />,
    variant: "delivery",
    nextStatus: "completed",
    nextLabel: "Confirmar Entrega",
  },
  completed: {
    label: "Entregue",
    icon: <Check className="w-4 h-4" />,
    variant: "success",
  },
};

type FilterStatus = "all" | OrderStatus;

const PainelFuncionario = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, user, logout } = useAuth();
  const { orders, updateOrderStatus, feedbacks } = useOrders();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [activeTab, setActiveTab] = useState<"orders" | "feedbacks">("orders");

  useEffect(() => {
    if (!isAuthenticated || userType !== "employee") {
      navigate("/login-funcionario");
    }
  }, [isAuthenticated, userType, navigate]);

  if (!isAuthenticated || userType !== "employee") {
    return null;
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success("Status atualizado!", {
      description: `Pedido ${orderId} - ${statusConfig[newStatus].label}`,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Pizza className="w-6 h-6 text-secondary-foreground" />
              </div>
            </Link>
            <div>
              <h1 className="font-bold text-foreground">Painel do Funcionário</h1>
              <p className="text-xs text-muted-foreground">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "short",
              })}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Novos Pedidos</p>
            <p className="text-3xl font-bold text-primary">{pendingCount}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Em Preparo</p>
            <p className="text-3xl font-bold text-warning">{preparingCount}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Prontos</p>
            <p className="text-3xl font-bold text-info">{readyCount}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Hoje</p>
            <p className="text-3xl font-bold text-foreground">{orders.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            onClick={() => setActiveTab("orders")}
          >
            Pedidos
          </Button>
          <Button
            variant={activeTab === "feedbacks" ? "default" : "ghost"}
            onClick={() => setActiveTab("feedbacks")}
          >
            Avaliações ({feedbacks.length})
          </Button>
        </div>

        {activeTab === "orders" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Todos ({orders.length})
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Aguardando ({pendingCount})
              </Button>
              <Button
                variant={filter === "preparing" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("preparing")}
              >
                Em Preparo ({preparingCount})
              </Button>
              <Button
                variant={filter === "ready" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("ready")}
              >
                Prontos ({readyCount})
              </Button>
            </div>

            {/* Orders */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "feedbacks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {feedback.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feedback.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= feedback.rating
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{feedback.comment}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

function OrderCard({
  order,
  onStatusUpdate,
}: {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}) {
  const status = statusConfig[order.status];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-foreground">{order.id}</h3>
          <Badge variant={status.variant as any} className="gap-1">
            {status.icon}
            {status.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          - {order.customerName}
        </p>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-foreground">
                {item.quantity}x{" "}
                {item.flavors
                  ? item.flavors.map((f) => f.name).join(" / ")
                  : item.menuItem.name}
              </span>
              {item.size && (
                <span className="text-muted-foreground ml-1">({item.size.name})</span>
              )}
              {item.observations && (
                <p className="text-xs text-warning italic">Obs: {item.observations}</p>
              )}
            </div>
          ))}
        </div>

        {/* Customer Info */}
        <div className="space-y-2 pt-4 border-t border-border text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{order.customerPhone}</span>
          </div>
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
          <div className="flex items-center justify-between pt-2">
            <span className="text-muted-foreground">{order.paymentMethod}</span>
            <span className="font-bold text-primary">
              R$ {order.total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {status.nextStatus && (
        <div className="p-4 border-t border-border bg-muted/30">
          <Button
            className="w-full"
            variant={order.status === "pending" ? "default" : "secondary"}
            onClick={() => onStatusUpdate(order.id, status.nextStatus!)}
          >
            {status.nextLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default PainelFuncionario;
