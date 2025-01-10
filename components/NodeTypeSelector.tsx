import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Box, Type, List, ToggleLeft, Hash, Ban } from 'lucide-react'

interface NodeTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function NodeTypeSelector({ value, onChange }: NodeTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px] h-8">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Complex Types</SelectLabel>
          <SelectItem value="object">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Object
            </div>
          </SelectItem>
          <SelectItem value="array">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Array
            </div>
          </SelectItem>
          <SelectLabel>Simple Types</SelectLabel>
          <SelectItem value="string">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              String
            </div>
          </SelectItem>
          <SelectItem value="number">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Number
            </div>
          </SelectItem>
          <SelectItem value="boolean">
            <div className="flex items-center gap-2">
              <ToggleLeft className="h-4 w-4" />
              Boolean
            </div>
          </SelectItem>
          <SelectItem value="null">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Null
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

