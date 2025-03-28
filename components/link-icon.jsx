import Link from "next/link"

const IconLink = ({children, href, className}) => {
  return <Link href={href} className={
    "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full " 
    + className}>{children}</Link>
}

export { IconLink as Link }
