"use client"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ReactNode } from "react"

export default function Providers({ children }: { children: ReactNode }) {

    return (
        <TooltipProvider>
            {children}
            <Toaster richColors/>
        </TooltipProvider>
    )
}