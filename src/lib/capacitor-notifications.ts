import { LocalNotifications } from "@capacitor/local-notifications";
import { Todo } from "../todo/todo-main-page";

export async function requestPermissions() {
  await LocalNotifications.requestPermissions();
}

export async function scheduleUrgentTodoNotification(
  todoId: string,
  title: string,
  message: string
) {
  const notificationId = Number(todoId);

  const now = new Date();
  const firstTrigger = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0,
    0
  );
  if (firstTrigger < now) {
    firstTrigger.setDate(firstTrigger.getDate() + 1);
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: notificationId,
        title,
        body: message,
        schedule: {
          at: firstTrigger,
          repeats: true,
          every: "day",
        },
      },
    ],
  });
}

export async function cancelNotification(todoId: string) {
  const notificationId = Number(todoId);

  await LocalNotifications.cancel({
    notifications: [{ id: notificationId }],
  });
}

export async function cleanupNotifications(todos: Todo[]) {
  const scheduled = await LocalNotifications.getPending();
  const validIds = todos
    .filter((todo) => todo.status === "urgent")
    .map((todo) => Number(todo.id));

  const toCancel = scheduled.notifications
    .filter((n) => !validIds.includes(n.id))
    .map((n) => ({ id: n.id }));

  if (toCancel.length > 0) {
    await LocalNotifications.cancel({ notifications: toCancel });
  }
}

export async function checkHasNotification(todoId: string) {
  const delivered = await LocalNotifications.getDeliveredNotifications();

  const scheduled = await LocalNotifications.getPending();

  const notificationId = Number(todoId);
  const hasNotificationDelivered = delivered.notifications.some(
    (n) => n.id === notificationId
  );
  const hasNotificationScheduled = scheduled.notifications.some(
    (n) => n.id === notificationId
  );

  if (hasNotificationDelivered || hasNotificationScheduled) {
    await cancelNotification(todoId);
  }
}
