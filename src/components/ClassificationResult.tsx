import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Cpu, Box, Cable, Monitor, Layers, AlertTriangle, CheckCircle2, Info, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart as RechartsePieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ClassificationData {
  category: string;
  confidence: number;
  item: string;
  materials: string[];
  material_percentages: Record<string, number>;
  recycling_guidance: string;
  hazards: string[];
  disposal_steps: string[];
}

interface ClassificationResultProps {
  classification: ClassificationData;
  image: string;
}

const categoryIcons: Record<string, typeof Battery> = {
  "Batteries": Battery,
  "Circuit Boards": Cpu,
  "Plastics": Box,
  "Metals": Cable,
  "Displays": Monitor,
  "Mixed Electronics": Layers,
};

const categoryColors: Record<string, string> = {
  "Batteries": "bg-yellow-500",
  "Circuit Boards": "bg-blue-500",
  "Plastics": "bg-purple-500",
  "Metals": "bg-gray-500",
  "Displays": "bg-indigo-500",
  "Mixed Electronics": "bg-green-500",
};

const CHART_COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(174, 72%, 56%)",
  "hsl(45, 93%, 47%)",
  "hsl(262, 83%, 58%)",
  "hsl(221, 83%, 53%)",
  "hsl(348, 83%, 47%)",
  "hsl(173, 58%, 39%)",
  "hsl(43, 74%, 49%)",
];

export const ClassificationResult = ({ classification, image }: ClassificationResultProps) => {
  const Icon = categoryIcons[classification.category] || Layers;
  const colorClass = categoryColors[classification.category] || "bg-primary";

  const chartData = Object.entries(classification.material_percentages || {}).map(([name, value], index) => ({
    name,
    value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img 
              src={image} 
              alt="Uploaded e-waste" 
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{classification.category}</h3>
                  <p className="text-muted-foreground">{classification.item}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {Math.round(classification.confidence)}% Confident
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence Level</span>
                <span className="font-semibold">{Math.round(classification.confidence)}%</span>
              </div>
              <Progress value={classification.confidence} className="h-2" />
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Materials Detected
              </h4>
              <div className="flex flex-wrap gap-2">
                {classification.materials.map((material, idx) => (
                  <Badge key={idx} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {chartData.length > 0 && (
        <Card className="p-6 bg-gradient-card border-2">
          <div className="flex items-start gap-3 mb-4">
            <PieChart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <h4 className="font-semibold text-primary text-lg">Material Breakdown</h4>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </RechartsePieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {classification.hazards.length > 0 && (
        <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-destructive mb-2">Environmental Hazards</h4>
              <ul className="space-y-1">
                {classification.hazards.map((hazard, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {hazard}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 border-2 border-primary/20 bg-gradient-card">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-primary mb-2">Recycling Guidance</h4>
            <p className="text-muted-foreground leading-relaxed">
              {classification.recycling_guidance}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-secondary mb-3">Disposal Steps</h4>
            <ol className="space-y-2">
              {classification.disposal_steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary text-sm font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};
