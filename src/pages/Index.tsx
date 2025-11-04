import { Calculator } from "@/components/Calculator";
import { Calculator as CalculatorIcon, TrendingUp, DollarSign } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl shadow-[var(--shadow-glow)] mb-4">
            <CalculatorIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Calculadora de Performance
            <span className="block text-primary mt-2">por Vendedor</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Projete seu faturamento, analise custos e calcule o lucro do seu time de vendas em tempo real
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">ROAS em</p>
                <p className="font-semibold text-foreground">Tempo Real</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Análise de</p>
                <p className="font-semibold text-foreground">Custos Completa</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Calculator Section */}
      <main className="container mx-auto px-4 pb-20">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">© EVO Marketing & Tecnologia 2024 Calculadora de Performance. Otimize seus resultados de vendas.</p>
      </footer>
    </div>;
};
export default Index;