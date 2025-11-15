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
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import LabeledInputTypeIn from "@/refresh-components/formik-fields/LabeledInputTypeIn";
import LabeledInputTextArea from "@/refresh-components/formik-fields/LabeledInputTextArea";
import UnlabeledInputTypeInElement from "@/refresh-components/formik-fields/UnlabeledInputTypeInElement";
import LabeledSwitchField from "@/refresh-components/formik-fields/LabeledSwitchField";
import Separator from "@/refresh-components/Separator";
import { FieldLabel } from "@/refresh-components/formik-fields/helpers";
import { useFormikContext } from "formik";
import { CONVERSATION_STARTERS } from "@/lib/constants";
import CollapsibleSection from "@/refresh-components/CollapsibleSection";
import Text from "@/refresh-components/texts/Text";
import Card from "@/refresh-components/Card";

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

interface ConversationStartersProps {
  maxStarters: number;
}

function ConversationStarters({ maxStarters }: ConversationStartersProps) {
  const { values } = useFormikContext<{
    starters: string[];
  }>();

  const starters = values.starters || [];

  // Count how many non-empty starters we have
  const filledStarters = starters.filter((s) => s).length;
  const canAddMore = filledStarters < maxStarters;

  // Show at least 1, or all filled ones, or filled + 1 empty (up to max)
  const visibleCount = Math.min(
    maxStarters,
    Math.max(
      1,
      filledStarters === 0 ? 1 : filledStarters + (canAddMore ? 1 : 0)
    )
  );

  return (
    <FieldArray name="starters">
      {(arrayHelpers) => (
        <div className="flex flex-col gap-2">
          {Array.from({ length: visibleCount }, (_, i) => (
            <UnlabeledInputTypeInElement
              key={`starters.${i}`}
              name={`starters.${i}`}
              placeholder={
                CONVERSATION_STARTERS[i] || "Enter a conversation starter..."
              }
              onRemove={() => arrayHelpers.remove(i)}
            />
          ))}
        </div>
      )}
    </FieldArray>
  );
}

export interface AgentEditorPageProps {
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

export default function AgentEditorPage({
  existingAgent,
  ccPairs,
  documentSets,
  defaultPublic,
  llmProviders,
  tools,
  shouldAddAssistantToUserPreferences,
}: AgentEditorPageProps) {
  const MAX_STARTERS = 4;

  const initialValues = {
    // General
    icon_color: existingAgent?.icon_color ?? "",
    icon_shape: existingAgent?.icon_shape ?? 0,
    uploaded_image_id: existingAgent?.uploaded_image_id ?? null,
    name: existingAgent?.name ?? "",
    description: existingAgent?.description ?? "",

    // Prompts
    instructions: existingAgent?.system_prompt ?? "",
    conversation_starters: Array.from(
      { length: MAX_STARTERS },
      (_, i) => existingAgent?.starter_messages?.[i] ?? ""
    ),

    // Knowledge

    // Access
    feature_this_agent: false,

    // Advanced
    knowledge_cutoff_date: new Date(),
    current_datetime_aware: false,
    overwrite_system_prompts: false,
    reminders: "",
  };

  const validationSchema = Yup.object().shape({
    // General
    name: Yup.string().required("Agent name is required."),
    description: Yup.string().required("Description is required."),

    // Prompts
    instructions: Yup.string().optional(),
    conversation_starters: Yup.array().of(Yup.string()),

    // Knowledge

    // Access
    feature_this_agent: Yup.boolean(),

    // Advanced
    knowledge_cutoff_date: Yup.date().optional(),
    current_datetime_aware: Yup.boolean(),
    overwrite_system_prompts: Yup.boolean(),
    reminders: Yup.string().optional(),
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
              {/* General */}
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
              </Section>

              <Separator />

              {/* Prompts */}
              <Section>
                {/* Instructions */}
                <LabeledInputTextArea
                  name="instructions"
                  label="Instructions"
                  placeholder="Think step by step and show reasoning for complex problems. Use specific examples. Emphasize action items, and leave blanks for the human to fill in when you have unknown. Use a polite enthusiastic tone."
                  optional
                  description="Add instructions to tailor the response for this agent."
                />

                {/* Conversation Starters */}
                <div className="flex flex-col gap-1">
                  <FieldLabel
                    name="conversation_starters"
                    label="Conversation Starters"
                    description="Example messages that help users understand what this agent can do and how to interact with it effectively."
                    optional
                  />
                  <ConversationStarters maxStarters={MAX_STARTERS} />
                </div>
              </Section>

              <Separator />

              {/* Knowledge */}
              <Section>
                <div className="flex flex-col gap-1">
                  <FieldLabel
                    name="knowledge"
                    label="Knowledge"
                    description="Add specific connectors and documents for this agent should use to inform its responses."
                  />
                </div>
              </Section>

              <Separator />

              {/* Actions */}
              <CollapsibleSection
                title="Actions"
                description="Tools and capabilities available for this agent to use."
              >
                <Section></Section>
              </CollapsibleSection>

              <Separator />

              {/* Access */}
              <Section>
                <FieldLabel
                  name="access"
                  label="Access"
                  description="Control who can view and use this agent."
                />

                <Card>
                  <LabeledSwitchField
                    name="feature_this_agent"
                    label="Feature This Agent"
                    description="Show this agent in the featured section in the explore list for everyone in your organization. This will also pin the agent for any new users."
                  />
                </Card>
              </Section>

              <Separator />

              {/* Advanced */}
              <CollapsibleSection
                title="Advanced"
                description="Fine-tune agent prompts and knowledge."
              >
                <Section>
                  <Card>
                    {/* Current Datetime Aware */}
                    <LabeledSwitchField
                      name="current_datetime_aware"
                      label="Current Datetime Aware"
                      description='Include the current date and time explicitly in the agent prompt (formatted as "Thursday Jan 1, 1970 00:01"). To inject it in a specific place in the prompt, use the pattern [[CURRENT_DATETIME]].'
                    />

                    {/* Prompt Override */}
                    <LabeledSwitchField
                      name="overwrite_system_prompts"
                      label="Overwrite System Prompts"
                      description='Completely replace the base system prompt. This might affect response quality since it will also overwrite useful system instructions (e.g. "you (the LLM) can provide markdown and it will be rendered").'
                    />
                  </Card>

                  <div className="flex flex-col gap-1">
                    {/* Reminders */}
                    <LabeledInputTextArea
                      name="reminders"
                      label="Reminders"
                      placeholder="Remember, I want you to always format your response as a numbered list."
                    />
                    <Text text03 secondaryBody>
                      Append a brief reminder to the prompt messages. Use this
                      to remind the agent if you find that it tends to forget
                      certain instructions as the chat progresses. This should
                      be brief and not interfere with the user messages.
                    </Text>
                  </div>
                </Section>
              </CollapsibleSection>
            </div>
          </Form>
        )}
      </Formik>
    </PageLayout>
  );
}
