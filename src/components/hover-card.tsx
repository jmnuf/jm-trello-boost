import type { ReactFragment } from "react";
import Zelda from "./zelda";

type HoverCardProps = {
	name:string,
	description:string,
	href:string;
	nextLink?:boolean;
	openNewTab?:boolean;
	linkContents:JSX.Element|ReactFragment|string
}


export default function HoverCard({
  name,
  description,
  href,
	nextLink,
	openNewTab,
	linkContents
}:HoverCardProps) {
  return (
    <section className="flex flex-col justify-center rounded border-2 bg-slate-300 border-gray-500 p-6 shadow-2xl hover:shadow-md duration-500 motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <Zelda
        className="m-auto mt-3 w-fit text-sm text-violet-500 underline decoration-dotted underline-offset-2"
        href={href}
				next={nextLink}
				target={openNewTab ? '_blank' : '_self'}
      >
        {linkContents}
      </Zelda>
    </section>
  );
}
