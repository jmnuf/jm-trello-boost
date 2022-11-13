

type ShieldSimpleColors = 'brightgreen'|'green'|'yellowgreen'|'orange'|'red'|'blue'|'lightgray';

type ShieldPriorityColors = 'success'|'important'|'critical'|'informational'|'inactive';

type ShieldStyle = 'plastic'|'flat'|'flat-square'|'for-the-badge'|'social'

type ShieldColors = ShieldSimpleColors|ShieldPriorityColors;

type BasicShieldProps = {
	type: 'custom'|'raw';
	style?: ShieldStyle
	label?: string;
	color?:ShieldColors;
	altText?:string
}

type ShieldProps = BasicShieldProps & ({
	type:'custom';
	label:string;
	message:string;
}|{
	type:'raw';
	url:string;
})

export default function Shield(props:ShieldProps) {
	const type = props.type;
	let altText = props.altText;
	let shieldLink = '';
	const query:string[] = [];
	if (props.style) {
		query.push(`style=${props.style}`);
	}
	switch(type) {
		case 'custom': {
			const { color, label, message } = props;
			if (!altText) {
				altText = label;
			}
			query.push(`label=${encodeURIComponent(label)}`);
			query.push(`message=${encodeURIComponent(message)}`);
			if (color) {
				query.push(`color=${encodeURIComponent(color)}`);
			}
			shieldLink = `https://img.shields.io/static/v1?`;
			break;
		}
		case 'raw': {
			if (!altText) {
				altText = 'Shield.io Badge'
			}
			if (props.label) {
				query.push(`label=${encodeURIComponent(props.label)}`);
			}
			shieldLink = props.url;
			break;
		}
	}

	if (query.length > 0) {
		if (shieldLink.indexOf('?') == -1) {
			shieldLink += '?';
		} else {
			shieldLink += '&';
		}
		shieldLink += query.join('&');
	}
	
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={shieldLink}
			alt={altText}
		/>
	)
}