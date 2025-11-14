"use client";

import { useState } from "react";
import SimplePageHeader from "@/refresh-components/headers/SimplePageHeader";
import PageLayout from "@/refresh-components/layouts/PageLayout";
import Button from "@/refresh-components/buttons/Button";
import { CCPairBasicInfo, DocumentSetSummary } from "@/lib/types";
import { LLMProviderView } from "@/app/admin/configuration/llm/interfaces";
import { ToolSnapshot } from "@/lib/tools/interfaces";
import { FullPersona } from "@/app/admin/assistants/interfaces";
import SvgTrash from "@/icons/trash";
import SvgEditBig from "@/icons/edit-big";
import { buildImgUrl } from "@/app/chat/components/files/images/utils";
import { cn } from "@/lib/utils";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LabeledInputTypeIn from "@/refresh-components/formik-fields/LabeledInputTypeIn";
import LabeledInputTextArea from "@/refresh-components/formik-fields/LabeledInputTextArea";

interface AgentIconEditorProps {
  existingAgent?: FullPersona | null;
}

function AgentIconEditor({ existingAgent }: AgentIconEditorProps) {
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [removeAgentImage, setRemoveAgentImage] = useState(false);

  const agentName = existingAgent?.name ?? "";
  const firstLetter = agentName.trim().charAt(0).toUpperCase() || "A";

  const iconElement = (() => {
    if (uploadedImagePreview) {
      return (
        <img
          src={uploadedImagePreview}
          alt="Uploaded agent icon"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }

    if (existingAgent?.uploaded_image_id && !removeAgentImage) {
      return (
        <img
          src={buildImgUrl(existingAgent?.uploaded_image_id)}
          alt="Uploaded agent icon"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }

    // Fallback: first letter of agent name
    return (
      <div className="w-12 h-12 rounded-full bg-background-tint-03 flex items-center justify-center">
        <span className="text-xl font-semibold text-text-04">
          {firstLetter}
        </span>
      </div>
    );
  })();

  return (
    <div className="flex gap-2 items-center">
      <div
        className="p-4 cursor-pointer rounded-full flex"
        style={{
          borderStyle: "dashed",
          borderWidth: "1.5px",
          borderSpacing: "4px",
        }}
      >
        {iconElement}
      </div>

      <div className="flex flex-col gap-2 items-start justify-center">
        <div className="text-sm font-medium">Choose Avatar</div>
        <Button
          secondary
          type="button"
          onClick={() => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setUploadedImagePreview(previewUrl);
              }
            };
            fileInput.click();
          }}
          leftIcon={SvgEditBig}
        >
          Edit
        </Button>

        {uploadedImagePreview && (
          <Button
            secondary
            type="button"
            onClick={() => {
              setUploadedImagePreview(null);
              setRemoveAgentImage(false);
            }}
            leftIcon={SvgTrash}
          >
            Remove Image
          </Button>
        )}

        {existingAgent?.uploaded_image_id &&
          removeAgentImage &&
          !uploadedImagePreview && (
            <Button
              secondary
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRemoveAgentImage(false);
                setUploadedImagePreview(null);
              }}
              leftIcon={() => <span>↩</span>}
            >
              Revert to Previous Image
            </Button>
          )}

        {existingAgent?.uploaded_image_id &&
          !removeAgentImage &&
          !uploadedImagePreview && (
            <Button
              secondary
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRemoveAgentImage(true);
              }}
              leftIcon={SvgTrash}
            >
              Remove Image
            </Button>
          )}
      </div>
    </div>
  );
}

function Section({
  className,
  ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col w-full gap-4", className)} {...rest} />
  );
}

export interface AgentsCreationPageProps {
  // If this is non-null, we assume that we are "editing an existing agent".
  // Otherwise, if this is null, we assume that we are "creating a new agent".
  existingAgent?: FullPersona | null;
  ccPairs: CCPairBasicInfo[];
  documentSets: DocumentSetSummary[];
  defaultPublic: boolean;
  llmProviders: LLMProviderView[];
  tools: ToolSnapshot[];
  shouldAddAssistantToUserPreferences?: boolean;
}

export default function AgentsEditorPage({
  existingAgent,
  ccPairs,
  documentSets,
  defaultPublic,
  llmProviders,
  tools,
  shouldAddAssistantToUserPreferences,
}: AgentsCreationPageProps) {
  const initialValues = {
    name: existingAgent?.name ?? "",
    description: existingAgent?.description ?? "",
    icon_color: existingAgent?.icon_color ?? "",
    icon_shape: existingAgent?.icon_shape ?? 0,
    uploaded_image: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Agent name is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("Form submitted:", values);
    // TODO: Implement agent creation/update logic
  };

  return (
    <PageLayout
      data-testid="AgentsEditorPage/container"
      aria-label="Agents Editor Page"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting }) => (
          <Form className="w-full h-full flex flex-col">
            <SimplePageHeader
              title={existingAgent ? "Edit Agent" : "Create Agent"}
              rightChildren={
                <Button type="submit" disabled={isSubmitting}>
                  {existingAgent ? "Save" : "Create"}
                </Button>
              }
            />

            {/* Agent Form Content */}
            <div className="py-6 px-8 flex flex-col gap-8 w-full">
              <Section className="max-w-4xl">
                <AgentIconEditor existingAgent={existingAgent} />

                {/* Name */}
                <LabeledInputTypeIn
                  name="name"
                  label="Name"
                  placeholder="Name your agent"
                  aria-label="agent-name-input"
                />

                {/* Description */}
                <LabeledInputTextArea
                  name="description"
                  label="Description"
                  placeholder="What does this agent do?"
                />

                {/* Labels - TODO: Implement later */}
                <div className="text-sm text-text-03">
                  Labels: Coming soon...
                </div>
              </Section>

              <Section>
                {/* Instructions */}
                <div className="text-sm text-text-03">
                  Instructions: Coming soon...
                </div>
                {/* Conversation Starters */}
                <div className="text-sm text-text-03">
                  Conversation Starters: Coming soon...
                </div>
              </Section>

              <Section>
                {/* Knowledge */}
                <div className="text-sm text-text-03">
                  Knowledge: Coming soon...
                </div>
              </Section>

              {/* More to implement later ... */}
            </div>
          </Form>
        )}
      </Formik>
    </PageLayout>
  );
}
