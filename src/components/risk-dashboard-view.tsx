import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { AlertCircle, CheckCircle, TrendingUp, Users } from "lucide-react"

export function RiskDashboardView() {
  const stats = [
    { title: "Total Risks Detected", value: "142", icon: AlertCircle, change: "+12 since last scan" },
    { title: "High-Priority Zones", value: "18", icon: TrendingUp, change: "+3 new zones" },
    { title: "Safe Landing Sites", value: "34", icon: CheckCircle, change: "Verified" },
    { title: "Team Members Active", value: "5", icon: Users, change: "Online" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>Interactive Risk Zone Map</CardTitle>
          <CardDescription>
            Overlay of detected landslides, boulders, and other geological features from Chandrayaan data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg bg-muted relative overflow-hidden">
            <Image
              src="https://placehold.co/1200x800.png"
              alt="Interactive Map of Lunar Surface"
              layout="fill"
              objectFit="cover"
              className="opacity-75"
              data-ai-hint="moon surface map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 p-4 rounded-lg text-center">
                <h3 className="font-bold text-lg">Map Visualization</h3>
                <p className="text-sm text-muted-foreground">Data overlays will be rendered here.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
