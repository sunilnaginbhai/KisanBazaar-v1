import type { ReactNode } from 'react'

type PageLayoutProps = {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <main className={`mx-auto min-h-[65vh] w-full max-w-[1180px] px-[5.5%] py-12 sm:py-16 ${className}`}>
      {children}
    </main>
  )
}

export function PageHeader({ eyebrow, title, description, action }: {
  eyebrow: string
  title: ReactNode
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="mb-8 flex flex-col items-start justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-[#789b46]">{eyebrow}</p>
        <h1 className="m-0 text-4xl font-semibold tracking-[-0.04em] text-[#20342c] sm:text-6xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-sm leading-6 text-[#7a857e]">{description}</p>}
      </div>
      {action}
    </header>
  )
}
