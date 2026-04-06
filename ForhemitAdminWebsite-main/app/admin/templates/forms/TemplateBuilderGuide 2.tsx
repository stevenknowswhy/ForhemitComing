"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import type { TemplateFormHandle } from "../registry";

export type TemplateBuilderGuideHandle = TemplateFormHandle;

interface FormInputs {
  developerName: string;
}

const defaultInputs: FormInputs = {
  developerName: "",
};

const TemplateBuilderGuide = forwardRef<
  TemplateBuilderGuideHandle,
  { initialData?: Partial<FormInputs> }
>(function TemplateBuilderGuide({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({ ...defaultInputs, ...initialData } as Record<string, unknown>),
    getContainerRef: () => containerRef.current,
  }));

  return (
    <div ref={containerRef} className="tbg-container">
      <div className="tbg-header">
        <h2 className="tbg-title">Template Builder Guide</h2>
        <p className="tbg-subtitle">How to create modular template forms for the admin section</p>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">📐 Architecture Overview</h3>
        <div className="tbg-card">
          <p>
            Each template form is a <strong>self-contained React component</strong> that:
          </p>
          <ul className="tbg-list">
            <li>Is registered in <code>registry.ts</code> with a unique <code>formKey</code></li>
            <li>Lives in its own file under <code>forms/</code></li>
            <li>Implements the <code>TemplateFormHandle</code> interface via <code>forwardRef</code></li>
            <li>Has its own scoped CSS classes (prefixed with template name)</li>
          </ul>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">📏 File Size Rules</h3>
        <div className="tbg-rules">
          <div className="tbg-rule">
            <span className="tbg-rule-badge warning">800 Lines Max</span>
            <p>No single template file should exceed 800 lines of code. If your template grows beyond this, split it into modular components.</p>
          </div>
          <div className="tbg-rule">
            <span className="tbg-rule-badge success">Single Responsibility</span>
            <p>Each template should handle one specific document type. Don&apos;t combine multiple templates into one file.</p>
          </div>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">🔧 Step-by-Step Process</h3>
        
        <div className="tbg-step">
          <div className="tbg-step-number">1</div>
          <div className="tbg-step-content">
            <h4>Create the Form Component</h4>
            <p>Create a new file at <code>app/admin/templates/forms/YourTemplateForm.tsx</code></p>
            <pre className="tbg-code">{`import React, { forwardRef, useImperativeHandle, useRef } from "react";
import type { TemplateFormHandle } from "../registry";

export type YourTemplateHandle = TemplateFormHandle;

const YourTemplateForm = forwardRef<YourTemplateHandle, { initialData?: Partial<FormInputs> }>(
  function YourTemplateForm({ initialData }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getFormData: () => ({} as Record<string, unknown>),
      getContainerRef: () => containerRef.current,
    }));

    return (
      <div ref={containerRef}>
        {/* Your form content here */}
      </div>
    );
  }
);

export default YourTemplateForm;`}</pre>
          </div>
        </div>

        <div className="tbg-step">
          <div className="tbg-step-number">2</div>
          <div className="tbg-step-content">
            <h4>Register in registry.ts</h4>
            <p>Add your template to the <code>templateFormRegistry</code> array in <code>registry.ts</code>:</p>
            <pre className="tbg-code">{`{
  formKey: "your-template-key",
  label: "Your Template Name",
  component: () => import("./forms/YourTemplateForm"),
},`}</pre>
          </div>
        </div>

        <div className="tbg-step">
          <div className="tbg-step-number">3</div>
          <div className="tbg-step-content">
            <h4>Add CSS Styles</h4>
            <p>Add template-specific styles to <code>templates.css</code>. Use a unique prefix:</p>
            <pre className="tbg-code">{`/* ── YOUR TEMPLATE FORM ── */
.your-template-container { }
.your-template-header { }
.your-template-input { }
/* ... */`}</pre>
          </div>
        </div>

        <div className="tbg-step">
          <div className="tbg-step-number">4</div>
          <div className="tbg-step-content">
            <h4>Seed in Convex (Required!)</h4>
            <p>Add a seed entry in <code>convex/documentTemplates.ts</code> with a matching <code>formKey</code>. This is required for the template to appear in the admin panel.</p>
            <div className="tbg-warning">
              <p><strong>Important:</strong> After modifying Convex code, you MUST restart the Convex dev server for changes to take effect. See Step 5.</p>
            </div>
          </div>
        </div>

        <div className="tbg-step">
          <div className="tbg-step-number">5</div>
          <div className="tbg-step-content">
            <h4>⚠️ Restart Convex (Critical!)</h4>
            <div className="tbg-warning">
              <p><strong>Convex functions don&apos;t hot-reload automatically!</strong></p>
              <p>After adding a new Convex seed function or modifying backend code, you <strong>must restart the Convex dev server</strong>:</p>
              <pre className="tbg-code">{`# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev`}</pre>
              <p>Look for the message &quot;Connected to Dev API&quot; in the console to confirm Convex is running.</p>
              <p>New templates won&apos;t appear in the admin until Convex is restarted!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">🔄 Modular Add/Remove Process</h3>
        
        <div className="tbg-modular">
          <div className="tbg-modular-col">
            <h4>Adding a Template</h4>
            <ol className="tbg-list">
              <li>Create form component file</li>
              <li>Register in registry.ts</li>
              <li>Add CSS styles</li>
              <li>Seed in Convex (optional)</li>
            </ol>
            <p className="tbg-note">✅ No other templates affected</p>
          </div>
          
          <div className="tbg-modular-col">
            <h4>Removing a Template</h4>
            <ol className="tbg-list">
              <li>Remove from registry.ts</li>
              <li>Delete form component file</li>
              <li>Remove CSS (or leave if shared)</li>
              <li>Archive Convex seed (don&apos;t delete)</li>
            </ol>
            <p className="tbg-note">✅ No other templates affected</p>
          </div>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">📝 Required Interface</h3>
        
        <div className="tbg-interface">
          <p>Every template form <strong>must</strong> implement this interface:</p>
          <pre className="tbg-code">{`interface TemplateFormHandle {
  /** Returns the current form data for logging / reprinting */
  getFormData: () => Record<string, unknown>;
  /** Returns the form's root DOM node for PDF rendering */
  getContainerRef: (): HTMLDivElement | null;
}`}</pre>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">🎯 Advanced Patterns (Learned from ESOP Term Sheet)</h3>

        <div className="tbg-card">
          <h4>📝 Multi-Step Form Pattern</h4>
          <p>For complex templates requiring user input, implement a multi-step form flow before showing the final document.</p>
          <ul className="tbg-list">
            <li>Use state to track <code>currentStep</code> and <code>showFinalDocument</code></li>
            <li>Show progress indicators for better UX</li>
            <li>Validate each step before allowing progression</li>
            <li>Allow users to go back and edit previous steps</li>
          </ul>
        </div>

        <div className="tbg-card">
          <h4>🧮 Complex Calculations</h4>
          <p>Create dedicated calculation functions outside components for SBA-compliant financial modeling.</p>
          <ul className="tbg-list">
            <li>Use <code>React.useMemo</code> to prevent unnecessary recalculations</li>
            <li>Define TypeScript interfaces for all input/output types</li>
            <li>Handle type casting safely when destructuring arrays</li>
            <li>Test calculations with multiple scenarios</li>
          </ul>
        </div>

        <div className="tbg-card">
          <h4>🎨 Component Composition</h4>
          <p>Break complex templates into reusable sub-components.</p>
          <ul className="tbg-list">
            <li>Create <code>DSCRBar</code>, <code>StackBar</code>, <code>ScenarioToggle</code> components</li>
            <li>Pass data as props rather than accessing global state</li>
            <li>Use consistent prop interfaces across components</li>
            <li>Keep components focused on single responsibilities</li>
          </ul>
        </div>

        <div className="tbg-card">
          <h4>🧮 Calculation Functions &amp; Type Safety</h4>
          <p>For templates with complex calculations, create dedicated calculation functions:</p>
          <pre className="tbg-code">{`interface UserInputs {
  purchasePrice: number;
  ebitda: number;
  taxRate: number;
  // ... other inputs
}

function calculateScenarios(inputs: UserInputs) {
  // Pure calculation logic
  const ocf = inputs.ebitda * (1 - inputs.taxRate / 100);
  const dscr = ocf / totalDebtService;

  return { scenarioA: {...}, scenarioB: {...} };
}

// In component:
const scenarios = React.useMemo(() =>
  calculateScenarios(inputs), [inputs]
);`}</pre>
          <p><strong>Type Safety Tip:</strong> Define interfaces for all data structures to catch errors at compile time.</p>
        </div>

        <div className="tbg-card">
          <h4>🔄 Dynamic Content with useMemo</h4>
          <p>Use <code>useMemo</code> for expensive calculations that depend on form inputs:</p>
          <pre className="tbg-code">{`const scenarios = React.useMemo(() =>
  calculateScenarios(inputs),
  [inputs.purchasePrice, inputs.ebitda, inputs.taxRate]
);

// This prevents recalculation on every render
const S = scenarios[scen as keyof typeof scenarios];`}</pre>
          <p><strong>Performance:</strong> Prevents unnecessary recalculations when only unrelated state changes.</p>
        </div>

        <div className="tbg-card">
          <h4>🛡️ Type Casting &amp; Error Handling</h4>
          <p>When dealing with mixed types from arrays/maps, safely cast values:</p>
          <pre className="tbg-code">{`// Array destructuring can produce string | number
const [label, ebitda, dscr] = ["Base Case", 2500000, 1.69];

// Safe casting for calculations
const ebitdaValue = typeof ebitda === 'number' ? ebitda : parseFloat(ebitda as string);
const dscrValue = typeof dscr === 'number' ? dscr : parseFloat(dscr as string);`}</pre>
          <p><strong>Gotcha:</strong> TypeScript&apos;s array destructuring infers union types that need explicit handling.</p>
        </div>

        <div className="tbg-card">
          <h4>🎨 Component Composition Patterns</h4>
          <p>Break complex templates into reusable components:</p>
          <pre className="tbg-code">{`function ScenarioToggle({ active, onChange, scenarios }) {
  return (
    <div className="scenario-buttons">
      {Object.values(scenarios).map(S => (
        <button key={S.id} onClick={() => onChange(S.id)}>
          {S.label}: $${'{'}fmt(S.sellerCash){'}'}
        </button>
      ))}
    </div>
  );
}

function DSCRBar({ label, value, color }) {
  return (
    <div className="dscr-container">
      <div className="dscr-bar" style={{ width: '\${value * 25}%', backgroundColor: color }}>
        {value.toFixed(2)}x
      </div>
    </div>
  );
}`}</pre>
          <p><strong>Benefits:</strong> Reusable components, easier testing, cleaner main component.</p>
        </div>

        <div className="tbg-card">
          <h4>📊 Form Validation Patterns</h4>
          <p>Implement step-by-step validation for multi-step forms:</p>
          <pre className="tbg-code">{`const nextStep = () => {
  // Validate current step before proceeding
  if (currentStep === 1 && !inputs.purchasePrice) {
    setError("Purchase price is required");
    return;
  }

  if (currentStep < 4) {
    setCurrentStep(currentStep + 1);
  } else {
    setShowTermSheet(true);
  }
};`}</pre>
          <p><strong>UX Tip:</strong> Show validation errors inline and prevent progression until resolved.</p>
        </div>

        <div className="tbg-card">
          <h4>🔍 Verify Before Fixing</h4>
          <p><strong>Critical lesson from ESOP Term Sheet debugging:</strong> Don&apos;t assume code is broken based on issue descriptions alone.</p>
          <ul className="tbg-list">
            <li><strong>Search first:</strong> Use <code>grep</code> to verify if components/content exist: <code>grep -n "tab ===" File.tsx</code></li>
            <li><strong>Check line counts:</strong> Large files (&gt;800 lines) may be complete despite appearing &quot;missing content&quot;</li>
            <li><strong>Verify CSS exists:</strong> Search templates.css before assuming styles are missing: <code>grep -n "\.term-" templates.css</code></li>
            <li><strong>Read the actual code:</strong> Issue descriptions can be outdated or mistaken</li>
          </ul>
          <div className="tbg-warning">
            <p><strong>Real example:</strong> ESOPTermSheetForm.tsx was reported as &quot;missing all tabbed content&quot; but actually had all 5 tabs fully implemented (lines 654-937). The file was 966 lines and complete.</p>
          </div>
        </div>

        <div className="tbg-card">
          <h4>🛡️ JSX Structure Integrity</h4>
          <p>When updating files, maintain valid JSX structure to avoid corruption:</p>
          <ul className="tbg-list">
            <li><strong>Don&apos;t append content blindly:</strong> Adding new sections at the wrong nesting level creates orphaned tags</li>
            <li><strong>Check parent/child relationships:</strong> Ensure closing tags match their openings</li>
            <li><strong>Use IDE validation:</strong> Red squiggles in your editor usually mean broken JSX</li>
            <li><strong>Test after every change:</strong> Run <code>npx tsc --noEmit</code> frequently</li>
          </ul>
          <div className="tbg-warning">
            <p><strong>Common error:</strong> Appending new sections after a closing <code>&lt;/div&gt;</code> that should be inside it creates duplicate content and orphaned tags.</p>
          </div>
        </div>

        <div className="tbg-card">
          <h4>🔧 Key Gotchas to Avoid</h4>
          <p>Lessons learned from building the ESOP Term Sheet:</p>
          <ul className="tbg-list">
            <li><strong>Convex Restart:</strong> Always restart Convex dev server after backend changes</li>
            <li><strong>Type Casting:</strong> Array destructuring creates union types - cast safely</li>
            <li><strong>Component Props:</strong> Pass all required data as props, don&apos;t rely on closures</li>
            <li><strong>CSS Scoping:</strong> Use unique prefixes to prevent style conflicts</li>
            <li><strong>State Management:</strong> Keep form state and display state separate</li>
            <li><strong>File Size Awareness:</strong> Files near 800 lines may need splitting, not &quot;completing&quot;</li>
            <li><strong>Tab Content Pattern:</strong> Use conditional rendering: <code>{"{tab === 'section' && ("}</code></li>
          </ul>
        </div>

        <div className="tbg-card">
          <h4>📋 Debugging Checklist</h4>
          <p>When a template appears broken, verify these before making changes:</p>
          <pre className="tbg-code">{`# 1. Check if tabs/content exist
grep -n "tab ===" ESOPTermSheetForm.tsx

# 2. Check file size (may already be complete)
wc -l ESOPTermSheetForm.tsx

# 3. Verify CSS exists
grep -n "\.term-" app/admin/templates.css

# 4. Check for JSX errors
npx tsc --noEmit

# 5. Verify component exports
grep -n "export default" app/admin/templates/forms/*.tsx`}</pre>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">🎨 CSS Conventions</h3>

        <div className="tbg-conventions">
          <div className="tbg-convention">
            <span className="tbg-do">✅ DO</span>
            <ul className="tbg-list">
              <li>Use BEM-style naming: <code>.template-container</code>, <code>.template-header__title</code></li>
              <li>Prefix all classes with template name: <code>.esop-</code>, <code>.h2h-</code>, <code>.your-</code></li>
              <li>Keep styles scoped to component</li>
              <li>Use CSS variables from the design system</li>
              <li>Create reusable component classes for common patterns</li>
              <li>Organize styles by component sections (form, display, navigation)</li>
            </ul>
          </div>
          <div className="tbg-convention">
            <span className="tbg-dont">❌ DON&apos;T</span>
            <ul className="tbg-list">
              <li>Use generic class names like <code>.container</code>, <code>.header</code></li>
              <li>Mix template styles</li>
              <li>Exceed 800 lines in a single file</li>
              <li>Create dependencies between templates</li>
              <li>Inline styles for complex layouts (use CSS classes)</li>
              <li>Duplicate color/hex values (use CSS variables)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="tbg-section">
        <h3 className="tbg-section-title">📚 Reference Templates</h3>
        
        <div className="tbg-card">
          <h4>🏆 Production-Ready Examples</h4>
          <p>Study these working templates for different patterns:</p>
          <ul className="tbg-list">
            <li><strong>ESOPCostReferenceForm.tsx</strong> — Interactive table with calculated columns, stage-based inputs</li>
            <li><strong>ESOPHeadToHeadForm.tsx</strong> — Side-by-side comparison, tabbed interface, visual stack bars</li>
            <li><strong>ESOPTermSheetForm.tsx</strong> — Multi-step form → document display, scenario toggles, DSCR calculations</li>
          </ul>
          <p><strong>Pattern progression:</strong> Start with Cost Reference (simplest), then Head-to-Head (tabs), then Term Sheet (multi-step + calculations).</p>
        </div>

        <div className="tbg-card">
          <h4>📁 Key Files Reference</h4>
          <pre className="tbg-code">{`app/admin/templates/
├── forms/
│   ├── ESOPCostReferenceForm.tsx    # Table-based calculator
│   ├── ESOPHeadToHeadForm.tsx       # Tabbed comparison
│   ├── ESOPTermSheetForm.tsx        # Multi-step wizard
│   └── TemplateBuilderGuide.tsx     # This guide
├── registry.ts                       # Form registration
└── templates.css                     # All template styles

convex/
└── documentTemplates.ts              # Seed functions`}</pre>
        </div>
      </div>

      <div className="tbg-footer">
        <p>Following these guidelines ensures templates remain <strong>independent</strong>, <strong>maintainable</strong>, and <strong>swappable</strong>.</p>
        <p style={{marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280'}}>
          Last updated: March 2026 • Lessons learned from ESOP Term Sheet debugging session
        </p>
      </div>
    </div>
  );
});

export default TemplateBuilderGuide;
