
export interface Post {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    image: string;
    content: string; // Storing as HTML/Markdown string for simplicity in this MVP
}

const heroBg = '/assets/illustrations/hero-bg.png';

export const posts: Post[] = [
    {
        slug: "5-signs-you-should-pivot-your-startup",
        category: "Startup Advice",
        title: "5 Signs You Should Pivot Your Startup",
        excerpt: "Recognizing when to change direction is crucial for survival. Here are the red flags to watch for.",
        date: "Dec 12, 2024",
        readTime: "7 min read",
        image: heroBg,
        content: `
            <p class="lead text-lg text-neutral-300 mb-8">Every founder starts with a vision. But the market has a way of guiding even the most brilliant ideas into new directions. The ability to pivot—to fundamentally change your business model or product direction—is often what separates successful unicorns from failed experiments.</p>
            
            <h3 class="text-2xl font-bold text-white mt-12 mb-6">1. Your User Retention is Flatlining</h3>
            <p>Acquisition metrics can be vanity metrics. You might be getting thousands of signups, but if users try your product once and never come back, you have a leaky bucket. No amount of marketing spend will fix a product that doesn't solve a burning problem.</p>
            <p><strong> The Red Flag:</strong> Your churn rate is consistently higher than your growth rate, and feature updates don't seem to improve retention.</p>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">2. You're Fighting an Uphill Battle for Every Sale</h3>
            <p>Sales shouldn't be easy, but they shouldn't feel impossible. If you have to explain your value proposition five different ways, offer steep discounts, and promise custom features just to close a deal, the market might be telling you that your solution isn't valuable enough.</p>
            
            <h3 class="text-2xl font-bold text-white mt-12 mb-6">3. Customers Are Hacking Your Product</h3>
            <p>Pay close attention to how people <em>actually</em> use your product. Are they using a secondary feature as their primary workflow? Did they build a workaround using your API to do something you never intended?</p>
            <blockquote class="border-l-4 border-primary-red pl-6 italic my-8 text-neutral-400">
                "We built a photo sharing app, but noticed everyone was using the filters. So we pivoted to become Instagram."
            </blockquote>
            <p>They might be showing you a more valuable problem to solve.</p>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">4. The Market Has Shifted</h3>
            <p>New technologies (like Generative AI) can render entire business models obsolete overnight. If your core moat just evaporated because a foundation model can now do it for free, don't cling to the past.</p>
            <p><em>Example:</em> Copywriting agencies that pivoted to "AI Strategy Consulting" thrived, while those who just tried to write faster failed.</p>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">5. You've Lost Passion for the Problem</h3>
            <p>Founder-market fit is real. If you wake up dreading the work because you don't care about the problem anymore, your startup will suffer. A pivot might reignite your drive by aligning the company with a mission you actually believe in.</p>
        `
    },
    {
        slug: "understanding-the-pos-score",
        category: "Product",
        title: "Understanding the POS Score: The Science of Prediction",
        excerpt: "Deep dive into how our AI calculates the Predictive Opportunity Score and what it means for you.",
        date: "Dec 10, 2024",
        readTime: "10 min read",
        image: heroBg,
        content: `
            <p class="lead text-lg text-neutral-300 mb-8">At Verdyct, we don't just guess which startups will succeed. We calculate it. The <strong>Predictive Opportunity Score (POS)</strong> is the engine of our analysis platform, distilling millions of data points into a single metric of potential.</p>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">The Three Pillars of POS</h3>
            <p>Our algorithm evaluates three core dimensions, inspired by the classic Design Thinking framework but powered by modern data science:</p>
            <ul class="list-disc pl-6 space-y-4 my-6 text-neutral-300">
                <li><strong class="text-primary-red">Viability (The Business):</strong> Is the business model sound? Are unit economics likely to work? We analyze similar public companies and pricing models to estimate margin potential.</li>
                <li><strong class="text-primary-red">Desirability (The Market):</strong> Is there a genuine market need? We scrape search trends, Reddit discussions, and social sentiment to measure "Problem Urgency."</li>
                <li><strong class="text-primary-red">Feasibility (The Tech):</strong> Can it be built with current technology? We cross-reference your feature list against current API capabilities and development complexity benchmarks.</li>
            </ul>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">How to Interpret Your Score</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-green-500 mb-2">80 - 100</div>
                    <div class="font-bold text-white mb-2">Unicorn Potential</div>
                    <p class="text-sm">High demand, low competition, clear path to revenue.</p>
                </div>
                <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-yellow-500 mb-2">50 - 79</div>
                    <div class="font-bold text-white mb-2">Solid Business</div>
                    <p class="text-sm">Viable, but requires careful execution or niche focus.</p>
                </div>
                <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-red-500 mb-2">0 - 49</div>
                    <div class="font-bold text-white mb-2">Pivot Recommended</div>
                    <p class="text-sm">Significant structural risks or lack of market need.</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">Improving Your POS</h3>
            <p>The score isn't static. It reflects your <em>current definition</em> of the idea. Refining your pitch, narrowing your target audience, or clarifying your revenue model can significantly boost your POS during re-evaluation.</p>
            <p>We see many founders start with a generic "Uber for X" (Score: 32) and refine it into "Uber for Medical Supplies in Rural Areas" (Score: 78). Specificity tells our AI that you understand the market.</p>
        `
    },
    {
        slug: "state-of-ai-startups-2025",
        category: "Market Analysis",
        title: "The State of AI Startups in 2025: Beyond the Hype",
        excerpt: "An analysis of over 10,000 generated reports reveals surprising trends in the AI sector.",
        date: "Nov 28, 2024",
        readTime: "12 min read",
        image: heroBg,
        content: `
            <p class="lead text-lg text-neutral-300 mb-8">2024 was the year of the hype. 2025 is the year of the utility. We analyzed metadata from over 10,000 reports generated on Verdyct to understand where the puck is going. The results show a maturing market that rewards depth over breadth.</p>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">Trend 1: Vertical Integration is King</h3>
            <p>General-purpose "wrappers" around ChatGPT are dying. The retention rates for simple chat interfaces have plummeted by 60% year-over-year.</p>
            <p>The most successful new entrants are deeply integrated <strong>Vertical AI Agents</strong>—AI for estate lawyers, AI for dental supply chains, AI for regulatory compliance. These startups don't just "chat"; they perform complex, multi-step actions within proprietary workflows.</p>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">Trend 2: The Return of Hardware</h3>
            <p>Software-only moats are shrinking. As models become commodities, the unique data capture layer becomes the moat. We're seeing a surge in "AI in the real world" startups:</p>
            <ul class="list-disc pl-6 space-y-2 my-6 text-neutral-300">
                <li>Smart agricultural sensors</li>
                <li>Wearable AI for health monitoring</li>
                <li>Robotics for local logistics</li>
            </ul>

            <h3 class="text-2xl font-bold text-white mt-12 mb-6">Trend 3: Data Sovereignty & Privacy</h3>
            <p>Enterprises are done with sending their IP to public APIs. Privacy isn't just a feature; it's the product. Startups offering <strong>Local LLM deployment</strong> and <strong>Private Cloud</strong> solutions are seeing 3x higher POS scores on average because the B2B demand is massive and underserved.</p>

            <hr class="border-white/10 my-12" />

            <h3 class="text-2xl font-bold text-white mt-6 mb-4">Conclusion</h3>
            <p>The "Gold Rush" isn't over, but the easy gold has been found. The next wave of winners will be the ones who dig deeper, solve boring problems, and build moats that go beyond a simple prompt.</p>
        `
    }
];
