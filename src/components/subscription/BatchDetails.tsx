import { Batch } from '@/types/subscription';
import { batchFeatures, howItWorks } from '@/data/mockSubscriptionData';
import { MentorCard } from './MentorCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Video, 
  ListChecks, 
  Scale, 
  FileCheck, 
  RefreshCw, 
  User, 
  MessageCircle,
  Users,
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';

interface BatchDetailsProps {
  batch: Batch;
  onBack: () => void;
  onBuyNow: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  video: <Video className="w-6 h-6" />,
  list: <ListChecks className="w-6 h-6" />,
  scale: <Scale className="w-6 h-6" />,
  file: <FileCheck className="w-6 h-6" />,
  refresh: <RefreshCw className="w-6 h-6" />,
  user: <User className="w-6 h-6" />,
  message: <MessageCircle className="w-6 h-6" />,
};

export const BatchDetails = ({ batch, onBack, onBuyNow }: BatchDetailsProps) => {
  const seatsFilled = batch.batchStrength - batch.seatsRemaining;
  const fillPercentage = (seatsFilled / batch.batchStrength) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Batches
          </Button>

          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">IIT Mentors</Badge>
              <Badge className="bg-warning/10 text-warning">
                <Zap className="w-3 h-3 mr-1" />
                Limited Seats
              </Badge>
              <Badge className="bg-success/10 text-success">Personal Guidance</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {batch.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {batch.description}
            </p>

            {/* Seat Availability */}
            <div className="bg-card rounded-xl p-4 max-w-md shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">Batch Capacity</span>
                </div>
                <span className="text-primary font-bold">
                  Only {batch.seatsRemaining} of {batch.batchStrength} seats remaining
                </span>
              </div>
              <Progress value={fillPercentage} className="h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Get */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-warning" />
                What You'll Get
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {batchFeatures.map((feature, index) => (
                  <Card key={index} className="border-border/50 shadow-sm hover:shadow-card transition-shadow">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {iconMap[feature.icon]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Meet Your Mentors */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-accent" />
                Meet Your Mentors
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {batch.mentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                How Mentorship Works
              </h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                
                <div className="space-y-6">
                  {howItWorks.map((step) => (
                    <div key={step.step} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 relative z-10">
                        {step.step}
                      </div>
                      <div className="pt-2">
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-border/50 shadow-card-hover">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2 mb-1">
                      <span className="text-4xl font-bold text-primary">₹{batch.discountedPrice}</span>
                      <span className="text-xl text-muted-foreground line-through">₹{batch.originalPrice}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>

                  <div className="bg-warning/10 text-warning text-sm font-medium text-center py-2 px-4 rounded-lg">
                    <Zap className="w-4 h-4 inline mr-1" />
                    {batch.urgencyTag}
                  </div>

                  <Button 
                    className="w-full font-semibold" 
                    size="lg"
                    onClick={onBuyNow}
                  >
                    BUY NOW
                  </Button>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground text-sm">Includes:</h4>
                    <ul className="space-y-2">
                      {batch.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
