import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pizza, Mail, Phone, User, ArrowRight, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { BUSINESS_INFO } from "@/data/menu";
import { toast } from "sonner";

const LoginCliente = () => {
  const navigate = useNavigate();
  const { signUp, signIn, isAuthenticated, userType, isLoading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && userType === "customer") {
      navigate("/cardapio");
    }
  }, [isAuthenticated, userType, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Preencha e-mail e senha");
      setIsSubmitting(false);
      return;
    }

    if (isSignUp && (!name || !phone)) {
      setError("Preencha todos os campos");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name, phone);
        if (error) {
          if (error.message.includes("already registered")) {
            setError("Este e-mail já está cadastrado");
          } else {
            setError(error.message);
          }
        } else {
          toast.success("Conta criada com sucesso!");
          navigate("/cardapio");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError("E-mail ou senha incorretos");
        } else {
          toast.success("Bem-vindo(a) à Pizzaria Paulistana!");
          navigate("/cardapio");
        }
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
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
              {isSignUp ? "Criar Conta" : "Entrar como Cliente"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? "Crie sua conta para fazer pedidos" : "Faça login para fazer seu pedido"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {isSignUp && (
              <>
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
              </>
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
                  placeholder="seu@email.com"
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

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Aguarde..." : isSignUp ? "Criar Conta" : "Entrar"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Fazer login" : "Criar conta"}
              </button>
            </p>
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
