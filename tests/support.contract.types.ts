import type { SupportCreateTicket, SupportTicketAction, SupportTicketDetail, SupportTicketActivity } from "../src/domain";

const create: SupportCreateTicket = {
    projectId: 1, subProjectId: 1, categoryId: 1, priorityId: 1, departmentId: 1,
    subject: "Help", context: { version: 1, path: "/support" },
};
const close: SupportTicketAction = { action: "close", resolveTypeId: 1 };
// @ts-expect-error Closing requires a resolution classification.
const invalidClose: SupportTicketAction = { action: "close" };
// @ts-expect-error Client identity is never part of the create contract.
const invalidCreate: SupportCreateTicket = { ...create, userId: "1" };
// @ts-expect-error A large ticket identity remains a decimal string in JSON.
const invalidId: SupportTicketActivity["ticketId"] = 9007199254740993;
const id: SupportTicketDetail["id"] = "9223372036854775807";
void [create, close, invalidClose, invalidCreate, invalidId, id];
