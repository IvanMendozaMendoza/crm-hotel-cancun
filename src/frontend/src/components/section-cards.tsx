import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type SectionCardItem = {
  description: string
  value: string | number | React.ReactNode
  trend: {
    direction: "up" | "down"
    text: string
  }
  footerPrimary: string
  footerSecondary: string
}

export const SectionCards = ({ items }: { items: SectionCardItem[] }) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item, index) => {
        const isUp = item.trend.direction === "up"
        const TrendIcon = isUp ? IconTrendingUp : IconTrendingDown
        return (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription>{item.description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {item.trend.text}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {item.footerPrimary} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {item.footerSecondary}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
