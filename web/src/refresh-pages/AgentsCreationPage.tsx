"use client";

import SimplePageHeader from "@/refresh-components/headers/SimplePageHeader";
import PageLayout from "@/refresh-components/layouts/PageLayout";
import Button from "@/refresh-components/buttons/Button";
import { AssistantEditor } from "@/app/admin/assistants/AssistantEditor";
import { CCPairBasicInfo, DocumentSetSummary, User } from "@/lib/types";
import { LLMProviderView } from "@/app/admin/configuration/llm/interfaces";
import { ToolSnapshot } from "@/lib/tools/interfaces";
import { FullPersona } from "@/app/admin/assistants/interfaces";

export interface AgentsCreationPageProps {
  existingPersona?: FullPersona | null;
  ccPairs: CCPairBasicInfo[];
  documentSets: DocumentSetSummary[];
  user: User | null;
  defaultPublic: boolean;
  llmProviders: LLMProviderView[];
  tools: ToolSnapshot[];
  shouldAddAssistantToUserPreferences?: boolean;
}

export default function AgentsCreationPage({
  existingPersona,
  ccPairs,
  documentSets,
  user,
  defaultPublic,
  llmProviders,
  tools,
  shouldAddAssistantToUserPreferences,
}: AgentsCreationPageProps) {
  const handleCancel = () => {
    // Navigate back or to agents page
    window.history.back();
  };

  const handleCreate = () => {
    // The AssistantEditor handles the creation logic
    // This button will be replaced by the form submit in AssistantEditor
    console.log("Create agent");
  };

  return (
    <PageLayout
      data-testid="AgentsCreationPage/container"
      aria-label="Create Agent Page"
    >
      <SimplePageHeader
        title="Create Agent"
        className="bg-background-tint-01"
        rightChildren={
          <div className="flex flex-row gap-2">
            <Button secondary onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        }
      />

      {/* Agent creation form */}
      {/*<div className="p-4">
        <AssistantEditor
          existingPersona={existingPersona}
          ccPairs={ccPairs}
          documentSets={documentSets}
          user={user}
          defaultPublic={defaultPublic}
          llmProviders={llmProviders}
          tools={tools}
          shouldAddAssistantToUserPreferences={
            shouldAddAssistantToUserPreferences
          }
        />
      </div>*/}
    </PageLayout>
  );
}
