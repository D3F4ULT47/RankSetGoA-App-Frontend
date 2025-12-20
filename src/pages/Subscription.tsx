import { useState } from 'react';
import Header from '@/components/Header';
import { BatchCard } from '@/components/subscription/BatchCard';
import { BatchDetails } from '@/components/subscription/BatchDetails';
import { CheckoutModal } from '@/components/subscription/CheckoutModal';
import { mockBatches } from '@/data/mockSubscriptionData';
import { Batch } from '@/types/subscription';
import { GraduationCap, Users, Award } from 'lucide-react';

type ViewMode = 'listing' | 'details';

const Subscription = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('listing');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutBatch, setCheckoutBatch] = useState<Batch | null>(null);

  const handleBuyNow = (batchId: string) => {
    const batch = mockBatches.find(b => b.id === batchId);
    if (batch) {
      setCheckoutBatch(batch);
      setCheckoutOpen(true);
    }
  };

  const handleExplore = (batchId: string) => {
    const batch = mockBatches.find(b => b.id === batchId);
    if (batch) {
      setSelectedBatch(batch);
      setViewMode('details');
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setSelectedBatch(null);
    setViewMode('listing');
  };

  if (viewMode === 'details' && selectedBatch) {
    return (
      <>
        <Header activeTab="subscription" />
        <BatchDetails 
          batch={selectedBatch}
          onBack={handleBack}
          onBuyNow={() => handleBuyNow(selectedBatch.id)}
        />
        {checkoutBatch && (
          <CheckoutModal
            isOpen={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            batchName={checkoutBatch.name}
            price={checkoutBatch.discountedPrice}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="subscription" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            JoSAA Mentorship Batches
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Get expert guidance from IIT & NIT mentors to make the right college and branch decision.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>IIT & NIT Mentors</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span>1000+ Students Guided</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              <span>Verified Mentors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Cards Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onBuyNow={handleBuyNow}
              onExplore={handleExplore}
            />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Reach out to us and we'll help you choose the right batch.
          </p>
          <a 
            href="mailto:support@ranksetgo.com" 
            className="text-primary font-medium hover:underline"
          >
            support@ranksetgo.com
          </a>
        </div>
      </section>

      {/* Checkout Modal */}
      {checkoutBatch && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          batchName={checkoutBatch.name}
          price={checkoutBatch.discountedPrice}
        />
      )}
    </div>
  );
};

export default Subscription;
