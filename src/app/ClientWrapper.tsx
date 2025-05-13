'use client'
import { ReactNode } from 'react'
import MobileProvider from '@/components_mobile/MobileProvider'

export default function ClientWrapper({ children }: { children: ReactNode }) {
    return <MobileProvider>{children}</MobileProvider>
}