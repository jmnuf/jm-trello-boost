

type ShieldSimpleColors = "brightgreen"|"green"|"yellowgreen"|"orange"|"red"|"blue"|"lightgray";

type ShieldPriorityColors = "success"|"important"|"critical"|"informational"|"inactive";

type ShieldStyle = "plastic"|"flat"|"flat-square"|"for-the-badge"|"social"

type ShieldColors = ShieldSimpleColors|ShieldPriorityColors;

type BasicShieldProps = {
	type: "custom"|"raw";
	width?: number,
	height?: number,
	style?: ShieldStyle
	label?: string;
	color?:ShieldColors;
	altText?:string
}

type ShieldProps = BasicShieldProps & ({
	type:"custom";
	label:string;
	message:string;
}|{
	type:"raw";
	url:string;
})

export default function Shield(props:ShieldProps) {
	const type = props.type;
	let altText = props.altText;
	let shieldLink = "";
	const query:string[] = [];
	if (props.style) {
		query.push(`style=${props.style}`);
	}
	switch(type) {
		case "custom": {
			const { color, label, message } = props;
			if (!altText) {
				altText = label;
			}
			query.push(`label=${label}`);
			query.push(`message=${message}`);
			if (color) {
				query.push(`color=${color}`);
			}
			shieldLink = "https://img.shields.io/static/v1?";
			break;
		}
		case "raw": {
			if (!altText) {
				altText = "Shield.io Badge"
			}
			if (props.label) {
				query.push(`label=${props.label}`);
			}
			shieldLink = props.url;
			break;
		}
	}

	if (query.length > 0) {
		if (shieldLink.indexOf("?") == -1) {
			shieldLink += "?";
		} else if (!shieldLink.endsWith("?")) {
			shieldLink += "&";
		}
		shieldLink += query.join("&");
	}

	// const width = props.width ? props.width : 150;
	// const height = props.height ? props.height : 75;

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={shieldLink}
			alt={altText}
			width={150}
			// height={height}
		/>
	)
}
