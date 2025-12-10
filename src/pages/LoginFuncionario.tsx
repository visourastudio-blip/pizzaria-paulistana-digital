import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pizza, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { BUSINESS_INFO } from "@/data/menu";
import { toast } from "sonner";

const LoginFuncionario = () => {
  const navigate = useNavigate();
  const { loginEmployee } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    const success = loginEmployee(email, password);
    if (success) {
      toast.success("Bem-vindo(a) ao painel!");
      navigate("/funcionario");
    } else {
      setError("E-mail ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary to-secondary/80 items-center justify-center p-8">
        <div className="max-w-md text-center text-secondary-foreground">
          <h2 className="text-4xl font-bold mb-4">Painel do Funcionário</h2>
          <p className="text-xl opacity-90 mb-8">
            Gerencie pedidos e acompanhe as operações da pizzaria
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="opacity-90">Visualize todos os pedidos em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="opacity-90">Atualize o status dos pedidos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="opacity-90">Acompanhe as avaliações dos clientes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Pizza className="w-7 h-7 text-secondary-foreground" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Acesso Funcionário
            </h1>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar o painel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

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
                  placeholder="funcionario@pizzaria.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" className="w-full" size="lg">
              Acessar Painel
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/login-cliente"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Voltar para login de cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFuncionario;
