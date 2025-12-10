import pizzaMargherita from "@/assets/pizza-margherita.jpg";
import pizzaPepperoni from "@/assets/pizza-pepperoni.jpg";
import pizzaQuattroFormaggi from "@/assets/pizza-quattro-formaggi.jpg";
import pizzaCalabresa from "@/assets/pizza-calabresa.jpg";
import pizzaChocolate from "@/assets/pizza-chocolate.jpg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "pizzas" | "bebidas" | "sobremesas";
  image: string;
  isSpecial?: boolean;
}

export interface PizzaSize {
  id: string;
  name: string;
  slices: number;
  maxFlavors: number;
  priceMultiplier: number;
}

export interface StuffedCrust {
  id: string;
  name: string;
  price: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export const PIZZA_SIZES: PizzaSize[] = [
  { id: "pequena", name: "Pequena", slices: 4, maxFlavors: 1, priceMultiplier: 0.7 },
  { id: "media", name: "Média", slices: 6, maxFlavors: 2, priceMultiplier: 1 },
  { id: "grande", name: "Grande", slices: 8, maxFlavors: 2, priceMultiplier: 1.3 },
  { id: "familia", name: "Família", slices: 12, maxFlavors: 4, priceMultiplier: 1.6 },
];

export const STUFFED_CRUSTS: StuffedCrust[] = [
  { id: "sem", name: "Sem borda recheada", price: 0 },
  { id: "catupiry", name: "Borda de Catupiry", price: 8 },
  { id: "cheddar", name: "Borda de Cheddar", price: 8 },
  { id: "chocolate", name: "Borda de Chocolate", price: 10 },
];

export const EXTRAS: Extra[] = [
  { id: "bacon", name: "Bacon Extra", price: 5 },
  { id: "queijo", name: "Queijo Extra", price: 4 },
  { id: "cebola", name: "Cebola Caramelizada", price: 3 },
  { id: "azeitona", name: "Azeitonas Extra", price: 3 },
  { id: "oregano", name: "Orégano Extra", price: 2 },
];

export const MENU_ITEMS: MenuItem[] = [
  // Pizzas
  {
    id: "paulistana",
    name: "Paulistana Tradicional",
    description: "Mussarela especial, tomate fresco e manjericão",
    price: 45,
    category: "pizzas",
    image: pizzaMargherita,
    isSpecial: true,
  },
  {
    id: "chef",
    name: "Pizza da Chef",
    description: "Pepperoni artesanal, queijo meia-cura e toque de mel picante",
    price: 55,
    category: "pizzas",
    image: pizzaPepperoni,
    isSpecial: true,
  },
  {
    id: "calabresa",
    name: "Calabresa Premium",
    description: "Calabresa paulista fatiada na hora com cebola caramelizada",
    price: 48,
    category: "pizzas",
    image: pizzaCalabresa,
    isSpecial: true,
  },
  {
    id: "quattro",
    name: "Quatro Queijos Supreme",
    description: "Gorgonzola, catupiry original, parmesão e muçarela",
    price: 52,
    category: "pizzas",
    image: pizzaQuattroFormaggi,
    isSpecial: true,
  },
  {
    id: "margherita",
    name: "Margherita",
    description: "Molho de tomate, mussarela, tomate e manjericão fresco",
    price: 42,
    category: "pizzas",
    image: pizzaMargherita,
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Mussarela e pepperoni artesanal",
    price: 50,
    category: "pizzas",
    image: pizzaPepperoni,
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description: "Presunto, ovos, cebola, azeitona, ervilha e mussarela",
    price: 48,
    category: "pizzas",
    image: pizzaMargherita,
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    description: "Frango desfiado com catupiry original",
    price: 50,
    category: "pizzas",
    image: pizzaQuattroFormaggi,
  },
  // Bebidas
  {
    id: "coca-lata",
    name: "Coca-Cola Lata",
    description: "350ml",
    price: 6,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
  },
  {
    id: "coca-2l",
    name: "Coca-Cola 2L",
    description: "Garrafa 2 litros",
    price: 14,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
  },
  {
    id: "guarana-lata",
    name: "Guaraná Antarctica Lata",
    description: "350ml",
    price: 5,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
  },
  {
    id: "agua",
    name: "Água Mineral",
    description: "500ml com ou sem gás",
    price: 4,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
  },
  {
    id: "suco-laranja",
    name: "Suco de Laranja",
    description: "Natural 300ml",
    price: 8,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
  },
  // Sobremesas
  {
    id: "pizza-chocolate",
    name: "Pizza de Chocolate Cremoso",
    description: "Chocolate ao leite derretido com morango",
    price: 38,
    category: "sobremesas",
    image: pizzaChocolate,
    isSpecial: true,
  },
  {
    id: "petit-gateau",
    name: "Petit Gâteau",
    description: "Bolinho de chocolate com sorvete de creme",
    price: 22,
    category: "sobremesas",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
  },
  {
    id: "tiramisu",
    name: "Tiramisù",
    description: "Tradicional italiano",
    price: 18,
    category: "sobremesas",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
  },
];

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  size?: PizzaSize;
  flavors?: MenuItem[];
  stuffedCrust?: StuffedCrust;
  extras?: Extra[];
  observations?: string;
  totalPrice: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "delivery" | "completed";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  address?: string;
  paymentMethod: string;
  createdAt: Date;
  estimatedTime?: string;
}

export interface Feedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const BUSINESS_INFO = {
  name: "Pizzaria Paulistana",
  slogan: "A verdadeira tradição da pizza de São Paulo",
  address: "Av. Humberto Reis, 1123 – Vila Monumento, São Paulo – SP, 01548-000",
  reference: "Ao lado da Praça Dom Orione",
  phone: "(11) 98742-6615",
  instagram: "@pizzariapaulistana.oficial",
  deliveryTime: "30 a 45 minutos",
  deliveryFee: 4.90,
  hours: {
    weekdays: "18:00 – 23:30",
    weekend: "18:00 – 01:00",
    sunday: "18:00 – 23:00",
  },
  differentials: [
    "Massa de fermentação natural de 48 horas",
    "Forno a lenha",
    "Ingredientes selecionados",
    "Entrega rápida",
    "Cardápio digital interativo",
  ],
  paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Vale Refeição (Alelo, Sodexo, VR)"],
};
