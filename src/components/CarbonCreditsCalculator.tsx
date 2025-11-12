import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Leaf, TrendingUp, Coins } from "lucide-react";

interface CarbonCreditsCalculatorProps {
  area: number;
  progress: number;
  currentCredits: number;
  vegetation: "mangrove" | "seagrass" | "saltmarsh";
}

const CarbonCreditsCalculator = ({ 
  area, 
  progress, 
  currentCredits, 
  vegetation = "mangrove" 
}: CarbonCreditsCalculatorProps) => {
  
  // Carbon sequestration rates per hectare per year
  const sequestrationRates = {
    mangrove: 12, // 12 tons CO2/ha/year
    seagrass: 8,  // 8 tons CO2/ha/year
    saltmarsh: 6  // 6 tons CO2/ha/year
  };

  const baseRate = sequestrationRates[vegetation];
  const maxCredits = Math.round(area * baseRate);
  const progressBasedCredits = Math.round((maxCredits * progress) / 100);
  const remainingCredits = maxCredits - currentCredits;
  const projectedAnnualCredits = Math.round(area * baseRate * 0.8); // 80% efficiency factor

  return (
    <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" />
          Carbon Credits Calculator
        </CardTitle>
        <CardDescription>
          Based on {vegetation} restoration with {area} hectares
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="text-lg font-bold text-success">{currentCredits}</div>
            <div className="text-xs text-muted-foreground">Earned Credits</div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">{progressBasedCredits}</div>
            <div className="text-xs text-muted-foreground">Progress Credits</div>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <div className="text-lg font-bold text-accent">{maxCredits}</div>
            <div className="text-xs text-muted-foreground">Maximum Credits</div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Credit Generation Progress</span>
            <span className="text-success font-medium">
              {Math.round((currentCredits / maxCredits) * 100)}%
            </span>
          </div>
          <Progress value={(currentCredits / maxCredits) * 100} className="h-3" />
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-success" />
              <span className="text-sm">Sequestration Rate</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {baseRate} tons CO₂/ha/year
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm">Annual Projection</span>
            </div>
            <Badge variant="outline" className="text-xs">
              ~{projectedAnnualCredits} CC/year
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-accent" />
              <span className="text-sm">Remaining Potential</span>
            </div>
            <Badge className="bg-accent text-accent-foreground text-xs">
              {remainingCredits} CC
            </Badge>
          </div>
        </div>

        {/* Ecosystem Type Info */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium mb-1 capitalize">{vegetation} Ecosystem</div>
          <div className="text-xs text-muted-foreground">
            {vegetation === "mangrove" && "High carbon sequestration in coastal areas"}
            {vegetation === "seagrass" && "Efficient carbon storage in marine meadows"}
            {vegetation === "saltmarsh" && "Stable carbon storage in tidal wetlands"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonCreditsCalculator;