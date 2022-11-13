
setTimeout(() => {
	window.TrelloPowerUp.initialize({
		"card-back-section": (t) => {
			return {
				title: "My Back Section",
				icon: "/favicon.ico",
				content: {
					type: "iframe",
					url: t.signUrl("./card-back-section"),
				},
			};
		}
	});
}, 500);
