import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pizza, Mail, Phone, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { BUSINESS_INFO } from "@/data/menu";
import { toast } from "sonner";

const LoginCliente = () => {
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();
  const { setCurrentCustomerPhone } = useOrders();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    loginCustomer(name, email, phone);
    setCurrentCustomerPhone(phone);
    toast.success("Bem-vindo(a) à Pizzaria Paulistana!");
    navigate("/cardapio");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Pizza className="w-7 h-7 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Entrar como Cliente
            </h1>
            <p className="text-muted-foreground">
              Faça login para fazer seu pedido
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg">
              Entrar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Quer continuar sem login?{" "}
              <Link to="/cardapio" className="text-primary hover:underline">
                Ver cardápio
              </Link>
            </p>
            <div className="border-t border-border pt-4">
              <Link
                to="/login-funcionario"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Acesso para Funcionários
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary/80 items-center justify-center p-8">
        <div className="max-w-md text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">{BUSINESS_INFO.name}</h2>
          <p className="text-xl opacity-90 mb-8">{BUSINESS_INFO.slogan}</p>
          <div className="space-y-4 text-left">
            {BUSINESS_INFO.differentials.slice(0, 4).map((diff, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="opacity-90">{diff}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCliente;
