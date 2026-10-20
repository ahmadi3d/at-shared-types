import type { AtApplicationEvent, AtEventAudience, AtEventSubscription } from "../src/domain";

function consume(event: AtApplicationEvent) {
    if (event.type === "support.ticket.activity.created") {
        const activityId: string = event.payload.activityId;
        return activityId;
    }
    // @ts-expect-error Other ticket facts do not contain activity identities.
    return event.payload.activityId;
}

const audience: AtEventAudience = { kind: "resource", resourceType: "support.ticket", resourceId: "1" };
const subscription: AtEventSubscription = { mode: "competing", subscriberId: "worker-1", group: "worker" };
// @ts-expect-error Competing subscriptions must name their logical work group.
const missingGroup: AtEventSubscription = { mode: "competing", subscriberId: "worker-2" };

void [consume, audience, subscription, missingGroup];
