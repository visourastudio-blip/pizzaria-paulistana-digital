import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { CartItem } from "@/data/menu";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

// Map database status to display status
const statusDisplayMap: Record<string, OrderStatus> = {
  pending: "pending",
  preparing: "preparing", 
  ready: "ready",
  delivery: "delivered",
  delivered: "delivered",
  completed: "delivered",
  cancelled: "cancelled",
};

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  items: CartItem[];
  total: number;
  payment_method: string;
  delivery_type: string;
  status: OrderStatus;
  estimated_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface OrderContextType {
  orders: Order[];
  customerOrders: Order[];
  feedbacks: Feedback[];
  isLoading: boolean;
  addOrder: (order: {
    items: CartItem[];
    total: number;
    customerName: string;
    customerPhone: string;
    deliveryType: string;
    address?: string;
    paymentMethod: string;
  }) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  addFeedback: (feedback: { customerName: string; rating: number; comment: string }) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchFeedbacks: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user, userType } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      const mappedOrders: Order[] = data.map(order => ({
        ...order,
        items: order.items as unknown as CartItem[],
        status: order.status as OrderStatus,
      }));
      setOrders(mappedOrders);
    }
    setIsLoading(false);
  }, [user]);

  const fetchFeedbacks = useCallback(async () => {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setFeedbacks(data);
    }
  }, []);

  // Fetch orders and feedbacks on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
    fetchFeedbacks();
  }, [user, fetchOrders, fetchFeedbacks]);

  // Set up realtime subscription for orders
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = {
              ...payload.new,
              items: payload.new.items as unknown as CartItem[],
              status: payload.new.status as OrderStatus,
            } as Order;
            setOrders((prev) => [newOrder, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updatedOrder = {
              ...payload.new,
              items: payload.new.items as unknown as CartItem[],
              status: payload.new.status as OrderStatus,
            } as Order;
            setOrders((prev) =>
              prev.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter((order) => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addOrder = useCallback(
    async (orderData: {
      items: CartItem[];
      total: number;
      customerName: string;
      customerPhone: string;
      deliveryType: string;
      address?: string;
      paymentMethod: string;
    }) => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          customer_address: orderData.address || null,
          items: orderData.items as any,
          total: orderData.total,
          payment_method: orderData.paymentMethod,
          delivery_type: orderData.deliveryType,
          status: "pending",
          estimated_time: "30-45 min",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating order:", error);
        return null;
      }

      return {
        ...data,
        items: data.items as unknown as CartItem[],
        status: data.status as OrderStatus,
      } as Order;
    },
    [user]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
      }
    },
    []
  );

  const getOrderById = useCallback(
    (orderId: string) => orders.find((order) => order.id === orderId),
    [orders]
  );

  const addFeedback = useCallback(
    async (feedbackData: { customerName: string; rating: number; comment: string }) => {
      const { error } = await supabase.from("feedbacks").insert({
        user_id: user?.id || null,
        customer_name: feedbackData.customerName,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
      });

      if (!error) {
        fetchFeedbacks();
      }
    },
    [user, fetchFeedbacks]
  );

  const customerOrders = user
    ? orders.filter((order) => order.user_id === user.id)
    : [];

  return (
    <OrderContext.Provider
      value={{
        orders,
        customerOrders,
        feedbacks,
        isLoading,
        addOrder,
        updateOrderStatus,
        getOrderById,
        addFeedback,
        fetchOrders,
        fetchFeedbacks,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
