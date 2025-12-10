import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";

export function FeedbackSection() {
  const { feedbacks, addFeedback } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    addFeedback({ customerName: name, rating, comment });
    toast.success("Avaliação enviada com sucesso!");
    setName("");
    setRating(5);
    setComment("");
    setShowForm(false);
  };

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "text-secondary fill-secondary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({feedbacks.length} avaliações)</span>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            {showForm ? "Cancelar" : "Deixar Avaliação"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-card rounded-xl border border-border p-6 mb-12 animate-fade-in"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Seu nome
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maria S."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sua avaliação
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Comentário
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte sua experiência..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar Avaliação
              </Button>
            </div>
          </form>
        )}

        {/* Feedbacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={feedback.id}
              className="bg-card rounded-xl border border-border p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {feedback.customerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{feedback.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= feedback.rating
                          ? "text-secondary fill-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
