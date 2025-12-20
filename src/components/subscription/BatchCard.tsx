import { Batch } from '@/types/subscription';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Users, Clock, Zap } from 'lucide-react';
interface BatchCardProps {
  batch: Batch;
  onBuyNow: (batchId: string) => void;
  onExplore: (batchId: string) => void;
}
export const BatchCard = ({
  batch,
  onBuyNow,
  onExplore
}: BatchCardProps) => {
  const seatsFilled = batch.batchStrength - batch.seatsRemaining;
  const fillPercentage = seatsFilled / batch.batchStrength * 100;
  return <Card className="relative overflow-hidden border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
      {/* Tags */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
          {batch.tag}
        </Badge>
        <Badge className="bg-warning/10 text-warning border-warning/20 font-medium animate-pulse">
          <Zap className="w-3 h-3 mr-1" />
          {batch.urgencyTag}
        </Badge>
      </div>

      <CardHeader className="pt-14 pb-4">
        <h3 className="text-xl font-bold text-foreground">{batch.name}</h3>
        <p className="text-muted-foreground text-sm mt-2">{batch.description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Batch Strength */}
        <div className="rounded-lg p-3 bg-[#cde0f4]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Batch Strength: {batch.batchStrength} Students</span>
            </div>
            <span className="text-sm font-medium text-primary">
              {batch.seatsRemaining} left
            </span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {seatsFilled} seats filled
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Key Highlights</h4>
          <ul className="space-y-2">
            {batch.highlights.slice(0, 5).map((highlight, index) => <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>{highlight}</span>
              </li>)}
          </ul>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Duration: {batch.duration}</span>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">₹{batch.discountedPrice}</span>
            <span className="text-lg text-muted-foreground line-through">₹{batch.originalPrice}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4">
        <Button className="w-full font-semibold" size="lg" onClick={() => onBuyNow(batch.id)}>
          BUY NOW
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onExplore(batch.id)}>
          EXPLORE
        </Button>
        <p className="text-xs text-center text-warning font-medium">
          Hurry! Limited seats available
        </p>
      </CardFooter>
    </Card>;
};