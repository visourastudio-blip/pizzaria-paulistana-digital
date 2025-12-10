import { Star, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/data/menu";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: () => void;
  onCustomize?: () => void;
}

export function MenuCard({ item, onAddToCart, onCustomize }: MenuCardProps) {
  const isPizza = item.category === "pizzas";

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border card-hover">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.isSpecial && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
            <Star className="w-3 h-3 mr-1" />
            Especial
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">a partir de</span>
            <p className="text-xl font-bold text-primary">
              R$ {item.price.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {isPizza ? (
            <Button onClick={onCustomize} size="sm" className="group/btn">
              Montar
              <Info className="w-4 h-4 ml-1 group-hover/btn:rotate-12 transition-transform" />
            </Button>
          ) : (
            <Button onClick={onAddToCart} size="sm" variant="secondary" className="group/btn">
              <Plus className="w-4 h-4 mr-1 group-hover/btn:scale-110 transition-transform" />
              Adicionar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
