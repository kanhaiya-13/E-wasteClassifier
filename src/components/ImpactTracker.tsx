import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  Zap, 
  Droplet, 
  TreePine, 
  Award,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpactStats {
  itemsRecycled: number;
  co2Saved: number;
  energySaved: number;
  waterSaved: number;
  treesSaved: number;
  level: number;
  nextLevelItems: number;
}

const achievements = [
  { id: 1, name: "First Step", description: "Recycled your first item", icon: Sparkles, unlocked: true },
  { id: 2, name: "Eco Warrior", description: "Recycled 10 items", icon: Award, unlocked: true },
  { id: 3, name: "Planet Protector", description: "Saved 50kg CO₂", icon: Leaf, unlocked: true },
  { id: 4, name: "Energy Saver", description: "Save 100 kWh", icon: Zap, unlocked: false },
  { id: 5, name: "Green Champion", description: "Recycle 50 items", icon: TreePine, unlocked: false },
];

export const ImpactTracker = () => {
  const [stats, setStats] = useState<ImpactStats>({
    itemsRecycled: 12,
    co2Saved: 45.6,
    energySaved: 78.3,
    waterSaved: 234,
    treesSaved: 2.4,
    level: 3,
    nextLevelItems: 8,
  });

  const [animatedStats, setAnimatedStats] = useState({
    co2: 0,
    energy: 0,
    water: 0,
    trees: 0,
  });

  useEffect(() => {
    // Animate numbers on mount
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        co2: stats.co2Saved * progress,
        energy: stats.energySaved * progress,
        water: stats.waterSaved * progress,
        trees: stats.treesSaved * progress,
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const levelProgress = ((stats.itemsRecycled % 10) / 10) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Environmental Impact
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Track the positive difference you're making for our planet
        </p>
      </div>

      {/* Level Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary text-primary-foreground">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Level {stats.level} Eco Hero</h3>
              <p className="text-sm text-muted-foreground">
                {stats.nextLevelItems} items until Level {stats.level + 1}
              </p>
            </div>
          </div>
          <Badge className="text-lg px-4 py-2 bg-primary">
            {stats.itemsRecycled} Items Recycled
          </Badge>
        </div>
        <Progress value={levelProgress} className="h-3" />
      </Card>

      {/* Impact Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group border-2 hover:border-primary/50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Leaf className="w-6 h-6 text-green-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">CO₂ Saved</p>
            <p className="text-3xl font-bold text-green-500">
              {animatedStats.co2.toFixed(1)}
              <span className="text-lg ml-1">kg</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Equivalent to planting {(animatedStats.co2 / 20).toFixed(1)} trees
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group border-2 hover:border-primary/50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Energy Saved</p>
            <p className="text-3xl font-bold text-yellow-500">
              {animatedStats.energy.toFixed(1)}
              <span className="text-lg ml-1">kWh</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Powers a home for {(animatedStats.energy / 30).toFixed(1)} days
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group border-2 hover:border-primary/50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Droplet className="w-6 h-6 text-blue-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Water Saved</p>
            <p className="text-3xl font-bold text-blue-500">
              {animatedStats.water.toFixed(0)}
              <span className="text-lg ml-1">L</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Enough for {(animatedStats.water / 8).toFixed(0)} people daily
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group border-2 hover:border-primary/50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <TreePine className="w-6 h-6 text-emerald-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Trees Equivalent</p>
            <p className="text-3xl font-bold text-emerald-500">
              {animatedStats.trees.toFixed(1)}
              <span className="text-lg ml-1">Trees</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Annual CO₂ absorption equivalent
            </p>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6 border-2">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Achievements
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? "bg-primary/5 border-primary/20 hover:border-primary/40"
                    : "bg-muted/20 border-dashed opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-primary">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
        <h3 className="text-2xl font-bold mb-2">Keep Making a Difference!</h3>
        <p className="text-muted-foreground mb-4">
          Every item you recycle helps protect our planet for future generations
        </p>
        <Button size="lg" className="gap-2">
          <Leaf className="w-5 h-5" />
          Recycle More Items
        </Button>
      </Card>
    </div>
  );
};

