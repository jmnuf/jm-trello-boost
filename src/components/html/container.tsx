import type { ReactNode } from "react";

type ContainerProps = {
	id?:string;
	children:ReactNode
};

export default function Container({ id, children }:ContainerProps) {
	return (
		<div id={id} className="container flex flex-col mx-auto p-1">
			{children}
		</div>
	)
}
