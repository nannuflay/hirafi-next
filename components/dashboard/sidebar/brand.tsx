'use client'

import { Zap } from 'lucide-react'
import { SidebarCollapseIcon } from '@/components/icons/SidebarCollapseIcon'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip, TooltipTrigger, TooltipContent,
} from '@/components/ui/tooltip'

export function Brand({
  collapsed, onToggle, showToggle = true,
}: {
  collapsed: boolean; onToggle: () => void; showToggle?: boolean
}) {
  return (
    <div className={cn(
      'group/brand relative flex items-center gap-2 px-4 py-4',
      collapsed ? 'justify-center px-2' : 'justify-between',
    )}>
      <div className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200',
        collapsed ? 'group-hover/brand:opacity-0 group-hover/brand:scale-75' : 'hover:shadow-lg hover:shadow-primary/30',
      )}>
        <Zap className="size-[16px]" />
      </div>
      {!collapsed && (
        <span className="flex-1 text-lg font-bold tracking-tight text-sidebar-foreground">
          Hirafi
        </span>
      )}
      {showToggle && (collapsed ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover/brand:opacity-100">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  className="flex size-9 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                  onClick={onToggle}
                />
              }
            >
              <SidebarCollapseIcon className="size-4" />
              <span className="sr-only">Open sidebar</span>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Open sidebar
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={onToggle}
              />
            }
          >
            <SidebarCollapseIcon className="size-4" />
            <span className="sr-only">Close sidebar</span>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            Close sidebar
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
