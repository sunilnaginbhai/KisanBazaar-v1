import type { ReactNode } from 'react'
import { PageHeader, PageLayout } from '../layouts'

type MarketplacePageProps = {
  children: ReactNode
  action?: ReactNode
}

export function MarketplacePage({ children, action }: MarketplacePageProps) {
  return (
    <PageLayout className="bg-[#f6f6f0]">
      <PageHeader
        eyebrow="VERIFIED SOURCES · PAN-INDIA"
        title={<>India's best <i className="font-serif font-medium">marketplace</i></>}
        description="Fresh produce, transparent prices and trusted farmers in one place."
        action={action}
      />
      {children}
    </PageLayout>
  )
}
