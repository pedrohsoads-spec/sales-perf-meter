import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { SellerCalculator, SellerResults } from "./SellerCalculator";

export const TeamCalculator = () => {
  const [sellers, setSellers] = useState<number[]>([1]);
  const [sellerResults, setSellerResults] = useState<Record<number, SellerResults>>({});

  const addSeller = () => {
    const newSellerNumber = Math.max(...sellers, 0) + 1;
    setSellers([...sellers, newSellerNumber]);
  };

  const removeSeller = (sellerNumber: number) => {
    setSellers(sellers.filter(s => s !== sellerNumber));
    const newResults = { ...sellerResults };
    delete newResults[sellerNumber];
    setSellerResults(newResults);
  };

  const handleSellerResultsChange = useCallback((sellerNumber: number, results: SellerResults) => {
    setSellerResults(prev => ({
      ...prev,
      [sellerNumber]: results
    }));
  }, []);

  const calculateTotals = () => {
    const totals = {
      leads: 0,
      salesCPF: 0,
      coursesSold: 0,
      revenue: 0,
      adInvestment: 0,
      commission: 0,
      operatingCost: 0,
      totalCost: 0,
      grossProfit: 0,
    };

    Object.values(sellerResults).forEach(result => {
      totals.leads += result.leads;
      totals.salesCPF += result.salesCPF;
      totals.coursesSold += result.coursesSold;
      totals.revenue += result.revenue;
      totals.adInvestment += result.adInvestment;
      totals.commission += result.commission;
      totals.operatingCost += result.operatingCost;
      totals.totalCost += result.totalCost;
      totals.grossProfit += result.grossProfit;
    });

    const roas = totals.adInvestment > 0 ? (totals.revenue / totals.adInvestment) * 100 : 0;
    const marketingCostPercent = totals.totalCost > 0 ? (totals.adInvestment / totals.totalCost) * 100 : 0;
    const salesCostPercent = totals.totalCost > 0 ? (totals.operatingCost / totals.totalCost) * 100 : 0;

    return { ...totals, roas, marketingCostPercent, salesCostPercent };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${formatNumber(value)}%`;
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-12">
      {sellers.map((sellerNumber) => (
        <div key={sellerNumber}>
          <SellerCalculator
            sellerNumber={sellerNumber}
            onRemove={sellers.length > 1 ? () => removeSeller(sellerNumber) : undefined}
            onResultsChange={(results) => handleSellerResultsChange(sellerNumber, results)}
            showRemoveButton={sellers.length > 1}
          />
          <div className="border-b border-border my-12" />
        </div>
      ))}

      <div className="flex justify-center">
        <Button onClick={addSeller} size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Adicionar Vendedor
        </Button>
      </div>

      {/* Performance Total */}
      <div className="space-y-8 mt-12">
        <h2 className="text-3xl font-bold text-primary text-center">Performance Total</h2>

        <Card className="shadow-[var(--shadow-card)] border-border border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Projeção Total de Faturamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Total de Leads Gerados</span>
              <span className="text-lg font-semibold text-foreground">{formatNumber(totals.leads)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Total de Vendas CPF</span>
              <span className="text-lg font-semibold text-foreground">{formatNumber(totals.salesCPF)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Total de Cursos Vendidos</span>
              <span className="text-lg font-semibold text-foreground">{formatNumber(totals.coursesSold)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Valor Total Faturado</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(totals.revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">ROAS Médio</span>
              <span className="text-2xl font-bold text-accent">{formatPercent(totals.roas)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Custos Totais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Total de Investimento em Anúncios</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(totals.adInvestment)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Total de Comissões</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(totals.commission)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Custo Operacional Total</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(totals.operatingCost)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Custo Total Geral</span>
              <span className="text-2xl font-bold text-destructive">{formatCurrency(totals.totalCost)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-[var(--shadow-card)] border-border border-2 bg-gradient-to-br from-success/5 to-success/10">
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground">Lucro Bruto Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${totals.grossProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(totals.grossProfit)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-border border-2">
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground">Custo Marketing Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatPercent(totals.marketingCostPercent)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-border border-2">
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground">Custo Vendas Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatPercent(totals.salesCostPercent)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
