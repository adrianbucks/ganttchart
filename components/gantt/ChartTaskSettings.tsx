import { useState } from "react"
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartSettings {
  showWeekends: boolean
  showProgress: boolean
  showDependencies: boolean
  dayWidth: number
  viewMode: 'day' | 'week' | 'month'
  theme: 'light' | 'dark' | 'system'
}

interface ChartTaskSettingsProps {
  settings: ChartSettings
  onSettingsChange: (settings: ChartSettings) => void
  className?: string
}

export function ChartTaskSettings({
  settings,
  onSettingsChange,
  className
}: ChartTaskSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleChange = (key: keyof ChartSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <h3 className="font-medium">Chart Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Show Weekends</span>
          <Switch 
            checked={localSettings.showWeekends}
            onCheckedChange={(checked) => handleChange('showWeekends', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Show Progress</span>
          <Switch 
            checked={localSettings.showProgress}
            onCheckedChange={(checked) => handleChange('showProgress', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Show Dependencies</span>
          <Switch 
            checked={localSettings.showDependencies}
            onCheckedChange={(checked) => handleChange('showDependencies', checked)}
          />
        </div>

        <div className="space-y-2">
          <span>Day Width</span>
          <Slider
            value={[localSettings.dayWidth]}
            min={20}
            max={100}
            step={10}
            onValueChange={([value]) => handleChange('dayWidth', value)}
          />
        </div>

        <div className="space-y-2">
          <span>View Mode</span>
          <Select 
            value={localSettings.viewMode}
            onValueChange={(value) => handleChange('viewMode', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span>Theme</span>
          <Select 
            value={localSettings.theme}
            onValueChange={(value) => handleChange('theme', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
