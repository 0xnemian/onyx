"use client";

import PageHeader from "@/refresh-components/headers/PageHeader";
import SvgOnyxOctagon from "@/icons/onyx-octagon";
import PageLayout from "@/refresh-components/layouts/PageLayout";
import Button from "@/refresh-components/buttons/Button";

export default function AgentsCreationPage() {
  const handleCancel = () => {
    // Navigate back or to agents page
    window.history.back();
  };

  const handleCreate = () => {
    // TODO: Implement agent creation logic
    console.log("Create agent");
  };

  return (
    <PageLayout
      data-testid="AgentsCreationPage/container"
      aria-label="Create Agent Page"
    >
      <PageHeader
        icon={SvgOnyxOctagon}
        title="Create Agent"
        description=""
        className="bg-background-tint-01"
        back
        rightChildren={
          <div className="flex flex-row gap-2">
            <Button secondary onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        }
      />

      {/* Agent creation form content goes here */}
      <div className="p-4">{/* TODO: Add agent creation form fields */}</div>
    </PageLayout>
  );
}
