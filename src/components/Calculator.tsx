import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorValues {
  totalAdInvestment: number;
  numberOfSellers: number;
  adInvestmentPerSeller: number;
  cpl: number;
  conversionRate: number;
  courseValue: number;
  coursesPerCPF: number;
  commissionRate: number;
  salary: number;
  otherCosts: number;
}

export const Calculator = () => {
  const [values, setValues] = useState<CalculatorValues>({
    totalAdInvestment: 0,
    numberOfSellers: 0,
    adInvestmentPerSeller: 0,
    cpl: 0,
    conversionRate: 0,
    courseValue: 0,
    coursesPerCPF: 0,
    commissionRate: 0,
    salary: 0,
    otherCosts: 0,
  });

  const [results, setResults] = useState({
    leads: 0,
    salesCPF: 0,
    coursesSold: 0,
    revenue: 0,
    roas: 0,
    commission: 0,
    operatingCost: 0,
    totalCost: 0,
    grossProfit: 0,
    marketingCostPercent: 0,
    salesCostPercent: 0,
  });

  useEffect(() => {
    // Calcular investimento por vendedor
    const adInvestmentPerSeller = values.numberOfSellers > 0 
      ? values.totalAdInvestment / values.numberOfSellers 
      : 0;
    
    setValues(prev => ({ ...prev, adInvestmentPerSeller }));
  }, [values.totalAdInvestment, values.numberOfSellers]);

  useEffect(() => {
    // Projeção de faturamento
    const leads = values.cpl > 0 ? values.adInvestmentPerSeller / values.cpl : 0;
    const salesCPF = leads * (values.conversionRate / 100);
    const coursesSold = salesCPF * values.coursesPerCPF;
    const revenue = values.courseValue * coursesSold;
    const roas = values.adInvestmentPerSeller > 0 ? (revenue / values.adInvestmentPerSeller) * 100 : 0;

    // Custos
    const commission = revenue * (values.commissionRate / 100);
    const operatingCost = commission + values.salary + values.otherCosts;
    const totalCost = values.adInvestmentPerSeller + operatingCost;

    // Resultados finais
    const grossProfit = revenue - totalCost;
    const marketingCostPercent = totalCost > 0 ? (values.adInvestmentPerSeller / totalCost) * 100 : 0;
    const salesCostPercent = totalCost > 0 ? ((values.salary + commission + values.otherCosts) / totalCost) * 100 : 0;

    setResults({
      leads,
      salesCPF,
      coursesSold,
      revenue,
      roas,
      commission,
      operatingCost,
      totalCost,
      grossProfit,
      marketingCostPercent,
      salesCostPercent,
    });
  }, [values]);

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

  const formatCurrencyInput = (value: string): string => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Converte para número
    const numberValue = parseInt(numbers);
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue);
  };

  const parseCurrencyInput = (value: string): number => {
    // Remove formatação e converte para número
    const numbers = value.replace(/\D/g, '');
    return numbers ? parseInt(numbers) : 0;
  };

  const handleCurrencyInputChange = (field: keyof CalculatorValues, value: string) => {
    const numValue = parseCurrencyInput(value);
    setValues((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleInputChange = (field: keyof CalculatorValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    setValues((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="space-y-8">
      {/* Projeção de Faturamento */}
      <Card className="shadow-[var(--shadow-card)] border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Projeção de Faturamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAdInvestment">Investimento em Anúncios</Label>
              <Input
                id="totalAdInvestment"
                type="text"
                placeholder="R$ 0,00"
                value={values.totalAdInvestment ? formatCurrencyInput(String(values.totalAdInvestment)) : ""}
                onChange={(e) => handleCurrencyInputChange("totalAdInvestment", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfSellers">Número de Vendedores</Label>
              <Input
                id="numberOfSellers"
                type="number"
                placeholder="0"
                value={values.numberOfSellers || ""}
                onChange={(e) => handleInputChange("numberOfSellers", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="adInvestmentPerSeller" className="text-primary font-semibold">
                Investimento em Anúncios por Vendedor
              </Label>
              <Input
                id="adInvestmentPerSeller"
                type="text"
                value={formatCurrency(values.adInvestmentPerSeller)}
                disabled
                className="border-input bg-secondary/50 font-semibold text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpl">CPL (Custo por Lead)</Label>
              <Input
                id="cpl"
                type="text"
                placeholder="R$ 0,00"
                value={values.cpl ? formatCurrencyInput(String(values.cpl)) : ""}
                onChange={(e) => handleCurrencyInputChange("cpl", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conversionRate">Taxa de Conversão (%)</Label>
              <Input
                id="conversionRate"
                type="number"
                placeholder="0%"
                value={values.conversionRate || ""}
                onChange={(e) => handleInputChange("conversionRate", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseValue">Valor do Curso</Label>
              <Input
                id="courseValue"
                type="text"
                placeholder="R$ 0,00"
                value={values.courseValue ? formatCurrencyInput(String(values.courseValue)) : ""}
                onChange={(e) => handleCurrencyInputChange("courseValue", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coursesPerCPF">Cursos por CPF</Label>
              <Input
                id="coursesPerCPF"
                type="number"
                placeholder="0"
                value={values.coursesPerCPF || ""}
                onChange={(e) => handleInputChange("coursesPerCPF", e.target.value)}
                className="border-input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Leads Gerados</span>
              <span className="text-lg font-semibold text-foreground">{formatNumber(results.leads)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Vendas CPF</span>
              <span className="text-lg font-semibold text-foreground">{formatNumber(results.salesCPF)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Cursos Vendidos</span>
              <span className="text-lg font-semibold text-foreground">{formatNumber(results.coursesSold)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Valor Faturado</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(results.revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">ROAS</span>
              <span className="text-2xl font-bold text-accent">{formatPercent(results.roas)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custos */}
      <Card className="shadow-[var(--shadow-card)] border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Custos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                placeholder="0%"
                value={values.commissionRate || ""}
                onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salário</Label>
              <Input
                id="salary"
                type="text"
                placeholder="R$ 0,00"
                value={values.salary ? formatCurrencyInput(String(values.salary)) : ""}
                onChange={(e) => handleCurrencyInputChange("salary", e.target.value)}
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCosts">Outros Custos e Encargos</Label>
              <Input
                id="otherCosts"
                type="text"
                placeholder="R$ 0,00"
                value={values.otherCosts ? formatCurrencyInput(String(values.otherCosts)) : ""}
                onChange={(e) => handleCurrencyInputChange("otherCosts", e.target.value)}
                className="border-input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Investimento em Anúncios (por vendedor)</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(values.adInvestmentPerSeller)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Comissão</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(results.commission)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Custo Operacional</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(results.operatingCost)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Custo Total</span>
              <span className="text-2xl font-bold text-destructive">{formatCurrency(results.totalCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado Final */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-[var(--shadow-card)] border-border bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Lucro Bruto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${results.grossProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(results.grossProfit)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Custo Marketing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatPercent(results.marketingCostPercent)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Custo Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatPercent(results.salesCostPercent)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
