
import Link from "next/link";
import type { PropsWithChildren } from "react";

type LinkProps = {
	href:string;
	next?:boolean;
	className?: string;
	target?:"_blank"|"_self"|"_parent"|"_top"|string;
} & PropsWithChildren

export default function Zelda(props:LinkProps) {
	const anchorAttr:Partial<typeof props> = Object.assign({}, props);
	const { children } = props;
	delete anchorAttr.href;
	if (anchorAttr.children) delete anchorAttr.children;
	const nextProps:Record<string, unknown> = Object.assign({}, anchorAttr);
	if (!props.next || !props.href.startsWith('/')) {
		nextProps.target = props.target || "_blank"
    nextProps.rel = "noreferrer"
	}
	return (
		<Link
			href={props.href}
			{...nextProps}
		>
			{children}
		</Link>
	)
}


