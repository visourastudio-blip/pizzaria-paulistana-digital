import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Order, OrderStatus, CartItem, Feedback } from "@/data/menu";

interface OrderContextType {
  orders: Order[];
  customerOrders: Order[];
  feedbacks: Feedback[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  addFeedback: (feedback: Omit<Feedback, "id" | "createdAt">) => void;
  currentCustomerPhone: string | null;
  setCurrentCustomerPhone: (phone: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock initial feedbacks
const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: "1",
    customerName: "Maria S.",
    rating: 5,
    comment: "Melhor pizza de São Paulo! A massa é perfeita e o atendimento é excelente.",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    customerName: "João P.",
    rating: 5,
    comment: "Calabresa Premium é sensacional! Entrega super rápida.",
    createdAt: new Date("2024-12-05"),
  },
  {
    id: "3",
    customerName: "Ana L.",
    rating: 4,
    comment: "Pizza deliciosa, só demorou um pouquinho mais que o esperado.",
    createdAt: new Date("2024-12-08"),
  },
  {
    id: "4",
    customerName: "Carlos M.",
    rating: 5,
    comment: "Quatro Queijos maravilhosa! Virei cliente fiel.",
    createdAt: new Date("2024-12-09"),
  },
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_FEEDBACKS);
  const [currentCustomerPhone, setCurrentCustomerPhone] = useState<string | null>(null);

  const addOrder = useCallback((orderData: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `PED-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date(),
      status: "pending",
      estimatedTime: "30-45 min",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((order) => order.id === orderId),
    [orders]
  );

  const addFeedback = useCallback((feedbackData: Omit<Feedback, "id" | "createdAt">) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);
  }, []);

  const customerOrders = currentCustomerPhone
    ? orders.filter((order) => order.customerPhone === currentCustomerPhone)
    : [];

  return (
    <OrderContext.Provider
      value={{
        orders,
        customerOrders,
        feedbacks,
        addOrder,
        updateOrderStatus,
        getOrderById,
        addFeedback,
        currentCustomerPhone,
        setCurrentCustomerPhone,
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
