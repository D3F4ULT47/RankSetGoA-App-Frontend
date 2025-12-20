import { Building2, MapPin, TrendingUp, Award, BookOpen, School } from 'lucide-react';
import { CollegeData, Category, ProbabilityTag } from '@/data/mockCollegeData';
import { cn } from '@/lib/utils';
interface CollegeCardProps {
  college: CollegeData;
  category: Category;
  index: number;
  showProbability?: boolean;
  probability?: ProbabilityTag;
}
const instituteTypeColors: Record<string, string> = {
  IIT: 'bg-primary/10 text-primary',
  NIT: 'bg-accent/10 text-accent',
  IIIT: 'bg-warning/10 text-warning',
  GFTI: 'bg-secondary text-secondary-foreground',
  Private: 'bg-muted text-muted-foreground'
};
const probabilityColors: Record<ProbabilityTag, string> = {
  High: 'bg-success/10 text-success border-success/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  Low: 'bg-destructive/10 text-destructive border-destructive/20'
};
const CollegeCard = ({
  college,
  category,
  index,
  showProbability,
  probability
}: CollegeCardProps) => {
  const openingCRL = college.openingRank.crl[category];
  const closingCRL = college.closingRank.crl[category];
  const openingCategory = college.openingRank.category[category];
  const closingCategory = college.closingRank.category[category];
  return <div className={cn('group relative bg-card rounded-xl border border-border p-5 lg:p-6', 'shadow-card hover:shadow-card-hover transition-all duration-300', 'hover:border-primary/30 hover:-translate-y-1', 'animate-slide-up')} style={{
    animationDelay: `${index * 50}ms`
  }}>
      {/* Rank Badge */}
      <div className="absolute -top-3 -left-2 flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground shadow-lg">
        #{index + 1}
      </div>

      {/* Probability Badge */}
      {showProbability && probability && <div className={cn('absolute -top-3 -right-2 px-3 py-1 rounded-full text-xs font-semibold border', probabilityColors[probability])}>
          {probability} Chance
        </div>}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* College Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {college.collegeName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{college.city}, {college.state}</span>
              </div>
            </div>
          </div>

          {/* Branch */}
          <div className="mt-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium text-foreground">{college.branch}</span>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Institute Type */}
            <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', instituteTypeColors[college.instituteType])}>
              <School className="h-3 w-3" />
              {college.instituteType}
            </span>
            {/* Exam Type */}
            <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', college.examType === 'JEE Advanced' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent')}>
              {college.examType}
            </span>
            {/* Category */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {category}
            </span>
            {/* Quota */}
            {college.quota !== 'All India' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {college.quota}
              </span>}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-3 lg:text-right lg:min-w-[160px]">
          {/* CRL Ranks */}
          <div className="flex-1 lg:flex-none">
            <div className="flex items-center gap-1.5 lg:justify-end">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">CRL Cutoff</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 lg:justify-end">
              <span className="text-xs text-muted-foreground">Open:</span>
              <span className="font-semibold text-foreground">{openingCRL?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex items-baseline gap-2 lg:justify-end">
              <span className="text-xs text-muted-foreground">Close:</span>
              <span className="font-semibold text-foreground">{closingCRL?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>

          {/* Category Ranks */}
          {category !== 'GEN' && <div className="flex-1 lg:flex-none">
              <div className="flex items-center gap-1.5 lg:justify-end">
                <Award className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">{category} Cutoff</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2 lg:justify-end">
                <span className="text-xs text-muted-foreground">Open:</span>
                <span className="font-semibold text-accent">{openingCategory?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex items-baseline gap-2 lg:justify-end">
                <span className="text-xs text-muted-foreground">Close:</span>
                <span className="font-semibold text-accent">{closingCategory?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>}

          {/* Average Package */}
          <div className="flex-1 lg:flex-none">
            <div className="flex items-center gap-1.5 lg:justify-end">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Avg. Package</span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold text-[hsl(var(--success))]">₹{college.averagePackage} LPA</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>;
};
export default CollegeCard;