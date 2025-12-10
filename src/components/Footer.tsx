import { Link } from "react-router-dom";
import { Pizza, Phone, MapPin, Clock, Instagram } from "lucide-react";
import { BUSINESS_INFO } from "@/data/menu";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Pizza className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{BUSINESS_INFO.name}</h3>
                <p className="text-xs text-muted-foreground">{BUSINESS_INFO.slogan}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A verdadeira tradição da pizza de São Paulo, com massa de fermentação natural e ingredientes selecionados.
            </p>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Horário de Funcionamento
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Segunda a Quinta: {BUSINESS_INFO.hours.weekdays}</p>
              <p>Sexta e Sábado: {BUSINESS_INFO.hours.weekend}</p>
              <p>Domingo: {BUSINESS_INFO.hours.sunday}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Contato
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/\D/g, "")}`}
                className="block hover:text-primary transition-colors"
              >
                {BUSINESS_INFO.phone}
              </a>
              <a
                href={`https://instagram.com/${BUSINESS_INFO.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
                {BUSINESS_INFO.instagram}
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Endereço
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{BUSINESS_INFO.address}</p>
              <p className="text-xs">Referência: {BUSINESS_INFO.reference}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login-funcionario" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Acesso Funcionário
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
