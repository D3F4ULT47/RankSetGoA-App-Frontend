import { Mentor } from '@/types/subscription';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, Users } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
}

export const MentorCard = ({ mentor }: MentorCardProps) => {
  return (
    <Card className="border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile Photo */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            {mentor.photo ? (
              <img 
                src={mentor.photo} 
                alt={mentor.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary" />
            )}
          </div>

          {/* Name & Verified Badge */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{mentor.name}</h3>
            {mentor.verified && (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
          </div>

          {/* College */}
          <p className="text-primary font-medium">{mentor.college}</p>

          {/* Branch */}
          <p className="text-sm text-muted-foreground">{mentor.branch}</p>

          {/* Year */}
          <p className="text-xs text-muted-foreground mt-1">{mentor.year}</p>

          {/* Students Guided */}
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Guided {mentor.studentsGuided}+ students</span>
          </div>

          {/* Verified Badge */}
          {mentor.verified && (
            <Badge variant="secondary" className="mt-3 bg-success/10 text-success">
              Verified Mentor
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
