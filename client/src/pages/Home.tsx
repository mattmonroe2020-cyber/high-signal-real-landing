import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Target, 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  Lightbulb, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Download,
  Calendar,
  Mail,
  Linkedin,
  FileText,
  BarChart3,
  Shield,
  Brain
} from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    company: "",
    stage: "",
    isNeurodivergent: false,
  });

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setShowThankYou(true);
      toast.success("Success! Check your email for the Playbook.");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    submitLead.mutate({
      firstName: formData.firstName,
      email: formData.email,
      company: formData.company || undefined,
      stage: formData.stage as "pre-seed" | "seed" | "series-a" | "other" | undefined,
      isNeurodivergent: formData.isNeurodivergent,
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      email: "",
      company: "",
      stage: "",
      isNeurodivergent: false,
    });
    setShowThankYou(false);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <img src="/logo.png" alt="High Signal Coaching" className="h-10 md:h-12 w-auto" />
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("problem")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              The Problem
            </button>
            <button onClick={() => scrollToSection("solution")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Solution
            </button>
            <button onClick={() => scrollToSection("program")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Program
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </button>
          </nav>
          <Button className="btn-copper" onClick={() => window.open("#calendly", "_self")}>
            Book a Call
          </Button>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Ship Milestones Predictably<br className="hidden md:block" /> Without Founder Burnout
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              IFS-informed executive function coaching for neurodivergent startup founders who know what to do but struggle with consistent execution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-copper text-base px-8 py-6" id="calendly">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your 30-Minute Founder Diagnostic
              </Button>
              <Button size="lg" variant="outline" className="btn-copper-outline text-base px-8 py-6" onClick={openModal}>
                <Download className="mr-2 h-5 w-5" />
                Download the Milestone Predictability Playbook
              </Button>
            </div>
          </div>
          {/* Decorative copper line */}
          <div className="copper-divider max-w-md mx-auto mt-16" />
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section id="problem" className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              The Founder's Execution Gap
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              You're technically brilliant. Your vision is clear. Your strategy is sound.<br />
              <span className="text-foreground font-medium">But execution keeps slipping:</span>
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Milestone drift</h3>
                    <p className="text-muted-foreground">Product launches get pushed again and again as internal resistance blocks progress</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Founder bottleneck</h3>
                    <p className="text-muted-foreground">Your team waits on you while you struggle with decisions that should take minutes</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Burnout cycles</h3>
                    <p className="text-muted-foreground">Push hard for 3 weeks, crash for 1, repeat—velocity becomes unpredictable</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Shiny object trap</h3>
                    <p className="text-muted-foreground">New ideas hijack focus before current projects ship, leaving a trail of 80%-done work</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-10 text-lg text-foreground font-medium max-w-2xl mx-auto">
              This isn't about working harder. It's about dismantling the internal barriers that neurodivergent founders face when scaling.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE SOLUTION */}
      <section id="solution" className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              The Self-Led Founder Protocol
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-14 max-w-3xl mx-auto">
              High Signal Coaching combines Internal Family Systems (IFS) parts work with executive function scaffolding specifically designed for neurodivergent founders.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-4">Parts Mapping</h3>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Identify which internal parts block execution (perfectionist, protector, rescue parts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Convert resistance into negotiated agreements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Build self-trust that ships products predictably</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-4">Execution Scaffolding</h3>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom accountability systems that match your neurology, not neurotypical templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Sprint-level structure with merge gates and micro-milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Real-time blocker removal—not theory, practical intervention</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-4">Sustainable Velocity</h3>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Track milestone predictability with investor-grade KPIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Prevent founder burnout before it derails your company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Delegate effectively without micromanaging or abandoning projects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROGRAM STRUCTURE */}
      <section id="program" className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
              How It Works
            </h2>
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="font-semibold text-xl">Week 1: Foundation</h3>
                </div>
                <ul className="text-muted-foreground space-y-2 ml-16">
                  <li>• Executive function assessment + IFS parts map</li>
                  <li>• Identify your top 3 execution blockers</li>
                  <li>• Create personalized 8-week roadmap</li>
                </ul>
              </div>
              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="font-semibold text-xl">Weeks 2-7: Execution Loops</h3>
                </div>
                <ul className="text-muted-foreground space-y-2 ml-16">
                  <li>• Biweekly 1:1 coaching sessions (60 min)</li>
                  <li>• Weekly drop-in group accountability calls</li>
                  <li>• Between-session support via async channel</li>
                  <li>• Access to Black Book curriculum + template vault</li>
                </ul>
              </div>
              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="font-semibold text-xl">Week 8: Integration</h3>
                </div>
                <ul className="text-muted-foreground space-y-2 ml-16">
                  <li>• Measure milestone predictability improvements</li>
                  <li>• Build sustainable practices for post-program execution</li>
                  <li>• Capture testimonial and results for case study</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center">
              <div className="inline-block bg-card p-6 rounded-xl border-2 border-primary shadow-lg">
                <p className="text-lg font-semibold text-foreground mb-1">Investment</p>
                <p className="text-3xl font-bold text-primary">$1,500 <span className="text-lg font-normal text-muted-foreground line-through">$3,000</span></p>
                <p className="text-sm text-muted-foreground mt-1">Beta Rate | Limited to 10 Founders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHO THIS IS FOR */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
              Is This You?
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-semibold text-lg mb-6 text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Ideal Client Criteria
                </h3>
                <ul className="space-y-4">
                  {[
                    "You're a technical founder or CEO (pre-seed through Series A)",
                    "Neurodivergent (ADHD, autism, AuDHD) or strongly identify with executive function challenges",
                    "You have product-market fit (or close) but execution velocity is inconsistent",
                    "Your team depends on you to unblock decisions and milestones",
                    "Standard productivity advice doesn't work—you need neurologically-informed systems",
                    "You're willing to do internal work (IFS) to remove self-sabotage patterns",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-6 text-destructive flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Not a fit if
                </h3>
                <ul className="space-y-4">
                  {[
                    "You're looking for quick hacks without doing deeper parts work",
                    "You're pre-product and need pure strategy consulting",
                    "You're unwilling to examine internal resistance patterns",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
              Founder Results
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <blockquote className="text-lg text-muted-foreground italic mb-6">
                  "Before working with Matt, I'd push product deadlines 3-4 times per quarter. We mapped my perfectionist part and built a merge-gate system. Now we hit 90% of milestones on time. Investors noticed."
                </blockquote>
                <p className="font-semibold text-foreground">— Founder, Series A</p>
              </div>
              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <blockquote className="text-lg text-muted-foreground italic mb-6">
                  "The combination of IFS parts work with practical execution scaffolding was exactly what I needed. I finally understand why I was blocking myself and have systems that actually work with my brain."
                </blockquote>
                <p className="font-semibold text-foreground">— Technical Founder, Seed Stage</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <p className="text-3xl font-bold text-primary mb-2">40%</p>
                <p className="text-sm text-muted-foreground">Reduction in milestone slips</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <p className="text-3xl font-bold text-primary mb-2">60%</p>
                <p className="text-sm text-muted-foreground">Improvement in decision velocity</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <p className="text-3xl font-bold text-primary mb-2">3mo</p>
                <p className="text-sm text-muted-foreground">Average engagement retention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: LEAD MAGNET CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12 rounded-2xl border border-primary/20">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-primary uppercase tracking-wide">Free Resource</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    The Milestone Predictability Playbook
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    A 22-page founder's guide to removing parts-driven resistance and building execution scaffolds that match neurodivergent rhythms.
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      High Signal Framework: Map internal resistance to practical agreements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Parts-map templates (fillable PDFs)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      2-week scaffold experiment with measurement plan
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      ROI calculator for milestone predictability
                    </li>
                  </ul>
                  <Button size="lg" className="btn-copper" onClick={openModal}>
                    <Download className="mr-2 h-5 w-5" />
                    Download the Playbook
                  </Button>
                </div>
                <div className="hidden md:block w-48 h-64 bg-card rounded-lg border border-border shadow-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-sm font-medium">Milestone Predictability Playbook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
              Common Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How is this different from therapy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  This is coaching, not therapy. We focus on business execution outcomes—shipping products, hitting milestones, removing founder bottlenecks. While we use IFS methodology, the goal is startup velocity, not clinical treatment. If deeper clinical needs emerge, I provide referrals to licensed therapists.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What if I'm not diagnosed neurodivergent but relate to these challenges?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You don't need a formal diagnosis. If you identify with executive function challenges and these patterns resonate, the program will work for you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Do I need to understand IFS before starting?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No. I teach you the relevant IFS concepts as we go. You'll learn by doing, not through theory-heavy coursework.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What's the time commitment?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  2-4 hours per week: Two 60-minute 1:1 sessions per month, weekly group calls (optional), and 30-60 minutes for between-session exercises.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What if I don't get results?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  If you complete the 8-week program, apply the scaffolds, and don't see measurable improvement in execution consistency, I'll refund 50% of your investment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Can I expense this as a business cost?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Many founders do. Consult your tax advisor, but executive coaching is typically a deductible business expense.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make Milestones Predictable?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Book a free 30-minute Founder Diagnostic. We'll identify your top execution blocker and create a concrete plan for the next milestone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-copper text-base px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Diagnostic Call
              </Button>
              <Button size="lg" variant="outline" className="btn-copper-outline text-base px-8 py-6" onClick={openModal}>
                <Download className="mr-2 h-5 w-5" />
                Get the Playbook
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Not ready to book? Download the Milestone Predictability Playbook and see the framework in action.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 10: FOOTER */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.png" alt="High Signal Coaching" className="h-10 w-auto mb-4" />
              <div className="space-y-2 text-muted-foreground">
                <a href="mailto:matt@highsignalcoaching.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  matt@highsignalcoaching.com
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn (TBD)
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Coaching vs Therapy Disclaimer</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                High Signal Coaching provides professional coaching services, not therapy or clinical treatment. Services are not intended to diagnose, treat, or cure mental health conditions. Licensed mental health services available separately through Matthew Monroe Simpson Counseling.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} High Signal Coaching. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Email Capture Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          {!showThankYou ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Download the Playbook</DialogTitle>
                <DialogDescription>
                  Get the Milestone Predictability Playbook delivered straight to your inbox.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="neurodivergent"
                    checked={formData.isNeurodivergent}
                    onCheckedChange={(checked) => setFormData({ ...formData, isNeurodivergent: checked as boolean })}
                  />
                  <Label htmlFor="neurodivergent" className="text-sm text-muted-foreground">
                    I identify as neurodivergent (ADHD/autism/AuDHD)
                  </Label>
                </div>
                <Button type="submit" className="w-full btn-copper" disabled={submitLead.isPending}>
                  {submitLead.isPending ? "Sending..." : "Send Me the Playbook"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-2xl mb-4">Check Your Email!</DialogTitle>
              <p className="text-muted-foreground mb-6">
                The Milestone Predictability Playbook is on its way. Want to accelerate results?
              </p>
              <Button className="btn-copper" onClick={() => setIsModalOpen(false)}>
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Founder Diagnostic
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
