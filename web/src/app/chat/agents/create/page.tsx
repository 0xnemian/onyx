import fetchAgentEditorInfoSS from "@/lib/assistants/fetchAgentEditorInfoSS";
import { ErrorCallout } from "@/components/ErrorCallout";
import AgentsCreationPage from "@/refresh-pages/AgentsEditorPage";

export default async function Page() {
  const [values, error] = await fetchAgentEditorInfoSS();

  if (!values) {
    return (
      <div className="px-32">
        <ErrorCallout errorTitle="Something went wrong :(" errorMsg={error} />
      </div>
    );
  }

  return (
    <AgentsCreationPage
      {...values}
      defaultPublic={false}
      shouldAddAssistantToUserPreferences={true}
    />
  );
}
