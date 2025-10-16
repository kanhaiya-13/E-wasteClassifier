import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Recycle,
  Globe,
  Battery,
  Smartphone,
  Laptop,
  Tv,
  ChevronRight,
} from "lucide-react";

const ewasteTypes = [
  {
    id: "batteries",
    icon: Battery,
    title: "Batteries & Power Supplies",
    color: "bg-yellow-500",
    description: "Contains heavy metals like lead, cadmium, and mercury",
    facts: [
      "A single battery can contaminate up to 600,000 liters of water",
      "95% of battery materials can be recycled",
      "Lithium-ion batteries can explode if improperly disposed",
    ],
    recyclingTip: "Never throw batteries in regular trash. Use designated battery recycling bins or return them to electronics stores.",
  },
  {
    id: "smartphones",
    icon: Smartphone,
    title: "Smartphones & Tablets",
    color: "bg-blue-500",
    description: "Contains precious metals like gold, silver, and rare earth elements",
    facts: [
      "1 ton of smartphones contains more gold than 1 ton of gold ore",
      "Only 20% of smartphones are recycled globally",
      "A smartphone contains over 40 elements from the periodic table",
    ],
    recyclingTip: "Erase personal data before recycling. Many manufacturers offer trade-in programs that refurbish or properly recycle old devices.",
  },
  {
    id: "computers",
    icon: Laptop,
    title: "Computers & Laptops",
    color: "bg-purple-500",
    description: "Contains harmful substances like lead, mercury, and flame retardants",
    facts: [
      "E-waste is the fastest growing waste stream in the world",
      "A single computer monitor contains up to 4kg of lead",
      "Recycling 1 million laptops saves energy equal to powering 3,657 US homes for a year",
    ],
    recyclingTip: "Remove hard drives for data security. Donate working computers to schools or charities, or take them to certified e-waste recyclers.",
  },
  {
    id: "displays",
    icon: Tv,
    title: "TVs & Monitors",
    color: "bg-indigo-500",
    description: "Old CRT displays contain toxic phosphor and lead in glass",
    facts: [
      "LCD screens contain mercury in their backlights",
      "A CRT TV can contain 4-8 pounds of lead",
      "Screen recycling recovers aluminum, copper, and precious metals",
    ],
    recyclingTip: "Never break or dismantle screens yourself. Contact local recycling programs that handle displays safely.",
  },
];

const globalImpact = [
  { stat: "53.6M", label: "Metric tons of e-waste generated in 2019", icon: Globe },
  { stat: "17.4%", label: "Of e-waste properly recycled globally", icon: Recycle },
  { stat: "$57B", label: "Worth of recoverable materials lost annually", icon: AlertTriangle },
  { stat: "5-7%", label: "Annual growth rate of e-waste", icon: Lightbulb },
];

const didYouKnow = [
  "E-waste represents 2% of trash in landfills but 70% of toxic waste",
  "The US generates more e-waste per capita than any other country",
  "Africa and Asia are often dumping grounds for e-waste from developed nations",
  "Informal e-waste recycling exposes workers to toxic chemicals",
  "Proper recycling can recover 98% of materials from electronics",
];

export const EducationSection = () => {
  const [selectedFact, setSelectedFact] = useState(0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Learn About E-Waste
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Understanding e-waste is the first step toward making a positive impact
        </p>
      </div>

      {/* Global Impact Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {globalImpact.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">{item.stat}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </Card>
          );
        })}
      </div>

      {/* E-Waste Types */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          Types of E-Waste
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ewasteTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="p-6 border-2 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${type.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-1">{type.title}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-2">Key Facts:</p>
                    <ul className="space-y-1">
                      {type.facts.map((fact, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-start gap-2">
                      <Recycle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{type.recyclingTip}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Did You Know Carousel */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Did You Know?</h3>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg mb-6 min-h-[60px] flex items-center justify-center">
            {didYouKnow[selectedFact]}
          </p>
          <div className="flex justify-center gap-2">
            {didYouKnow.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFact(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedFact === idx
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to fact ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* FAQ Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left font-semibold">
                What counts as e-waste?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              E-waste includes any electronic device with a plug, battery, or circuit board. This includes computers, phones, TVs, appliances, toys, and even LED light bulbs. Basically, if it has electronic components, it's e-waste.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left font-semibold">
                Why can't I just throw electronics in the trash?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Electronics contain toxic materials like lead, mercury, cadmium, and flame retardants. When disposed in landfills, these toxins can leach into soil and groundwater, causing serious environmental and health problems. Additionally, e-waste contains valuable materials that should be recovered and reused.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left font-semibold">
                What happens to recycled electronics?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Certified recyclers dismantle electronics to separate materials like plastics, metals, and glass. Precious metals (gold, silver, copper) are recovered and refined. Hazardous materials are safely disposed of. Many components are refurbished and resold, reducing the need for new manufacturing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left font-semibold">
                How do I protect my data before recycling?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Always perform a factory reset and remove any memory cards or SIM cards. For computers, use data wiping software to overwrite the hard drive multiple times. For extra security, physically remove the hard drive and destroy it separately or use a professional data destruction service.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left font-semibold">
                Can I get money for my old electronics?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! Many retailers and manufacturers offer trade-in programs for working devices. You can also sell functioning electronics on resale platforms. Even broken devices have value—specialized recyclers may pay for bulk e-waste due to the valuable materials they contain.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Call to Action */}
      <Card className="p-8 text-center border-2 border-primary/20">
        <h3 className="text-2xl font-bold mb-3">Ready to Make a Difference?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Now that you understand the importance of proper e-waste disposal, start making a positive impact today
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" className="gap-2">
            <Recycle className="w-5 h-5" />
            Classify Your E-Waste
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <ChevronRight className="w-5 h-5" />
            Find Recycling Centers
          </Button>
        </div>
      </Card>
    </div>
  );
};

