//#region sw/notification-sw.ts
var e = location.origin + "/api/client";
async function t(t, n, r) {
	return fetch(`${e}${t}`, {
		method: n,
		body: r,
		headers: {
			pragma: "no-cache",
			"cache-control": "no-cache"
		}
	});
}
self.addEventListener("install", () => {
	console.log("bg install", e);
}), self.addEventListener("activate", () => {
	console.log("bg activate", e);
});
function n(e) {
	try {
		return e.json();
	} catch {
		return e.text();
	}
}
self.addEventListener("push", (e) => {
	if (console.log("push event:", e), !e.data) return;
	let t = n(e.data);
	console.log("push data:", t), typeof t == "string" ? self.registration.showNotification(t) : self.registration.showNotification(t.title, {
		body: t.body,
		image: t.image,
		actions: t.actions ? t.actions.map((e) => ({
			action: e.title,
			title: e.title
		})) : [],
		data: t,
		silent: !1,
		requireInteraction: !0
	});
}), self.addEventListener("notificationclick", async (e) => {
	console.log("notificationclick event:", e), e.notification.close();
	let n = e.notification.data;
	if (n.pushRecordId && t(`/notice/${n.pushRecordId}/click`, "get"), e.action) {
		let t = n.actions?.find((t) => t.title == e.action);
		t?.link && self.clients.openWindow(t.link);
	} else n.link && self.clients.openWindow(n.link);
});
//#endregion
