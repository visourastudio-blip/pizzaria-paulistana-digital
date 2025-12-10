import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, Pizza, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { BUSINESS_INFO } from "@/data/menu";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout, userType } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/cardapio", label: "Cardápio" },
    { href: "/feedbacks", label: "Avaliações" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pizza className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground leading-tight">
                {BUSINESS_INFO.name}
              </h1>
              <p className="text-xs text-muted-foreground">{BUSINESS_INFO.slogan}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {userType !== "employee" && (
              <Link to="/carrinho" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to={userType === "employee" ? "/funcionario" : "/meus-pedidos"}>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name.split(" ")[0]}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login-cliente">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Entrar
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login-cliente"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted"
                  >
                    Entrar como Cliente
                  </Link>
                  <Link
                    to="/login-funcionario"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted"
                  >
                    Acesso Funcionário
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
