import { fetchAssistantEditorInfoSS } from "@/lib/assistants/fetchPersonaEditorInfoSS";
import { ErrorCallout } from "@/components/ErrorCallout";
import { ProjectsProvider } from "@/app/chat/projects/ProjectsContext";
import AgentsCreationPage from "@/refresh-pages/AgentsCreationPage";

export default async function Page() {
  const [values, error] = await fetchAssistantEditorInfoSS();

  if (!values) {
    return (
      <div className="px-32">
        <ErrorCallout errorTitle="Something went wrong :(" errorMsg={error} />
      </div>
    );
  }

  return (
    <ProjectsProvider>
      <AgentsCreationPage
        {...values}
        defaultPublic={false}
        shouldAddAssistantToUserPreferences={true}
      />
    </ProjectsProvider>
  );
}
