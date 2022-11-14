(function() {
	/*
	 * Boost Icon: https://www.svgrepo.com/svg/429319/essential-upload-web-2
	 * Info Icon: https://www.svgrepo.com/svg/429304/essential-information-web
	 * 
	 */
	const BOOST_ICON = "https://www.svgrepo.com/show/429319/essential-upload-web-2.svg";
	const INFO_ICON  = "https://www.svgrepo.com/show/429304/essential-information-web.svg";
	
	const prioritySorter = (asc) => {
		return async function(t, { cards }) {
			const priorityCards = await (async () => {
				/** @type {{id:string, priority:number}[]} */
				const toSort = [];
				for(const c of cards) {
					const id = c.id;
					const priority = await t.get(id, "shared", "priority", null);
					if (priority != null) {
						toSort.push({ id, priority });
					}
				}
				return toSort.sort((a, b) => a.priority - b.priority);
			})();
			// If no priority cards, we aren't sorting the list cause we can't
			if (priorityCards.length == 0) {
				return { sortedIds: priorityCards };
			}
			const sortedPriority = priorityCards.map(c => c.id);
			const unsorted = cards.filter(c => !sortedPriority.includes(c.id)).map(c => c.id);
			const sortedIds = (asc ? sortedPriority : sortedPriority.reverse()).concat(unsorted);
			return { sortedIds };
		}
	}

	/**
	 * @type {import('../src/utils/types/trello').Trello.PowerUp}
	 */
	window.TrelloPowerUp.initialize({
		"card-back-section": (t) => {
			return t.get("card", "shared", "priority", null)
				.then(value => {
					if (typeof value != "number") {
						throw t.NotHandled();
					}
					return {
						title: "My Back Section",
						icon: BOOST_ICON,
						content: {
							type: "iframe",
							url: t.signUrl("./card-back-section"),
							height: 120,
						},
					};
				})
		},
		"card-badges": (t) => {
			return t.get("card", "shared", "priority").then(value => {
				if (typeof value != "number") {
					throw t.NotHandled();
				}
				return [
					{
						title: "Priority",
						icon: INFO_ICON,
						text: "Level " + value,
					}
				]
			})
		},
		"list-sorters": () => {
			return [
				{
					text: "Priority: High to Low",
					callback: prioritySorter(false)
				},
				{
					text: "Priority Low to High",
					callback: prioritySorter(true)
				}
			];
		},
		"card-buttons": (t) => {
			return t.get("card", "shared", "priority", null)
				.then(value => {
					if (typeof value == "number") {
						return [
							{
								text: "Remove priority",
								icon: BOOST_ICON,
								condition: "edit",
								callback: async () => await t.remove("card", "shared", "priority")
							}
						]
					}
					return [
						{
							text: "Add priority",
							icon: BOOST_ICON,
							condition: "edit",
							callback: async () => await t.set("card", "shared", "priority", 5)
						}
					]
			});
		}
	});
})()
