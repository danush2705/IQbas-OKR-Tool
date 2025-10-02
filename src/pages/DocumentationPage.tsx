import { Card } from "@/components/ui/card";

export default function DocumentationPage() {
  return (
      <div className="space-y-6 fade-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
          <p className="text-muted-foreground mt-1">Quick guide to using the OKR tool</p>
        </div>

        <Card className="p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold">Getting Started</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Welcome to the OKR tool. Use this guide to understand core concepts and complete common tasks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Core Concepts</h2>
            <ul className="list-disc pl-6 mt-2 text-sm text-muted-foreground space-y-1">
              <li><span className="font-medium text-foreground">Objectives</span>: Qualitative goals that describe what you want to achieve.</li>
              <li><span className="font-medium text-foreground">Key Results</span>: Measurable outcomes that indicate progress toward an objective.</li>
              <li><span className="font-medium text-foreground">Milestones</span>: Actionable steps or checkpoints that help deliver a key result.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How-To Guides by Role</h2>
            <div className="mt-3 space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground">For CEOs/Admins: Create a company-wide Objective</h3>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Go to Settings → Organization to confirm the active time period.</li>
                  <li>Open the OKRs page and click “Add OKR”.</li>
                  <li>Set the owner to CEO and define Key Results and Milestones.</li>
                  <li>Save and share with managers.</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-foreground">For Managers: Request a new team Objective</h3>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Open the OKRs page and click “Request Objective”.</li>
                  <li>Fill in the title, department, and business context.</li>
                  <li>Submit for admin/CEO review.</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-foreground">For Users: Add and update Milestones</h3>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Expand your Objective and Key Results.</li>
                  <li>Click “Add Milestone”, add optional attachments as proof.</li>
                  <li>Update milestone status as you progress.</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Frequently Asked Questions (FAQ)</h2>
            <div className="mt-2 space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">How do I change my name or password?</p>
                <p>Go to Settings → My Profile, update your details, then save.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Why can’t I see company-wide objectives?</p>
                <p>Use the view switcher (All/My/Company) on the dashboard or organization page. Company view is visible to all users.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Who can edit roles?</p>
                <p>Only admins can manage roles at Settings → User Management.</p>
              </div>
            </div>
          </section>
        </Card>
      </div>
  );
}
