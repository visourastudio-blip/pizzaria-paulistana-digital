import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Cardapio from "./pages/Cardapio";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import LoginCliente from "./pages/LoginCliente";
import LoginFuncionario from "./pages/LoginFuncionario";
import MeusPedidos from "./pages/MeusPedidos";
import Acompanhar from "./pages/Acompanhar";
import PainelFuncionario from "./pages/PainelFuncionario";
import Feedbacks from "./pages/Feedbacks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" richColors />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cardapio" element={<Cardapio />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login-cliente" element={<LoginCliente />} />
                <Route path="/login-funcionario" element={<LoginFuncionario />} />
                <Route path="/meus-pedidos" element={<MeusPedidos />} />
                <Route path="/acompanhar/:id" element={<Acompanhar />} />
                <Route path="/funcionario" element={<PainelFuncionario />} />
                <Route path="/feedbacks" element={<Feedbacks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
