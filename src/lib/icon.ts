/**
 * src/lib/icon.ts
 *
 * How Hugeicons free icons work:
 *
 *   @hugeicons/core-free-icons exports raw SVG path data as an array of tuples:
 *   [ ["path", { d: "...", stroke: "currentColor", ... }], ... ]
 *
 *   Each tuple is [SVG element tag, its props].
 *
 *   This module provides:
 *   1. `makeIcon(data)` — wraps the raw data into a proper React component.
 *   2. Named icon exports for every icon used in this app.
 *
 *   Usage in JSX:  <Search01Icon size={16} aria-hidden="true" />
 *
 * To add a new icon: import its raw data from @hugeicons/core-free-icons,
 * then export makeIcon(rawData) with a descriptive name below.
 */

import { createElement } from 'react'
import type { SVGAttributes } from 'react'

// ── Raw data type ────────────────────────────────────────────────────────────
// Each entry is [svgTagName, attributeObject]
type SvgTuple = [string, Record<string, string | number>]
type IconData = SvgTuple[]

// ── Props every icon component accepts ──────────────────────────────────────
export interface HugeIconProps extends SVGAttributes<SVGSVGElement> {
  size?: number
  color?: string
}

// ── Factory ──────────────────────────────────────────────────────────────────
/**
 * Turns raw Hugeicons SVG data into a React component.
 *
 * @param data  - The array of [tag, attrs] tuples exported by core-free-icons
 * @returns A React function component that accepts HugeIconProps
 */
export function makeIcon(data: IconData) {
  return function HugeIcon({ size = 24, color = 'currentColor', ...rest }: HugeIconProps) {
    return createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        color,
        ...rest,
      },
      // Render each SVG child element from the data array
      ...data.map(([tag, attrs], i) =>
        createElement(tag, { key: i, ...attrs }),
      ),
    )
  }
}

// ── Raw icon data imports ────────────────────────────────────────────────────
import {
  AirplaneTakeOff01Icon as _AirplaneTakeOff01,
  AirplaneTakeOff02Icon as _AirplaneTakeOff02,
  Alert01Icon           as _Alert01,
  AlertCircleIcon       as _AlertCircle,
  AlertDiamondIcon      as _AlertDiamond,
  ArrowRight01Icon      as _ArrowRight01,
  BarChartIcon          as _BarChart,
  BookOpen01Icon        as _BookOpen01,
  Building03Icon        as _Building03,
  Building04Icon        as _Building04,
  Cancel01Icon          as _Cancel01,
  CheckmarkCircle01Icon as _CheckmarkCircle01,
  ComputerActivityIcon  as _ComputerActivity,
  GraduateMaleIcon      as _GraduateMale,
  InformationCircleIcon as _InformationCircle,
  Search01Icon          as _Search01,
  SearchMinusIcon       as _SearchMinus,
  Settings02Icon        as _Settings02,
  Sun01Icon             as _Sun01,
  UserAccountIcon       as _UserAccount,
  UserIdVerificationIcon as _UserIdVerification,
  WifiOff01Icon         as _WifiOff01,
} from '@hugeicons/core-free-icons'

// ── Named icon components ────────────────────────────────────────────────────
// Each one is a real React component: <AirplaneTakeOff01Icon size={16} />
export const AirplaneTakeOff01Icon  = makeIcon(_AirplaneTakeOff01  as unknown as IconData)
export const AirplaneTakeOff02Icon  = makeIcon(_AirplaneTakeOff02  as unknown as IconData)
export const Alert01Icon            = makeIcon(_Alert01            as unknown as IconData)
export const AlertCircleIcon        = makeIcon(_AlertCircle        as unknown as IconData)
export const AlertDiamondIcon       = makeIcon(_AlertDiamond       as unknown as IconData)
export const ArrowRight01Icon       = makeIcon(_ArrowRight01       as unknown as IconData)
export const BarChartIcon           = makeIcon(_BarChart           as unknown as IconData)
export const BookOpen01Icon         = makeIcon(_BookOpen01         as unknown as IconData)
export const Building03Icon         = makeIcon(_Building03         as unknown as IconData)
export const Building04Icon         = makeIcon(_Building04         as unknown as IconData)
export const Cancel01Icon           = makeIcon(_Cancel01           as unknown as IconData)
export const CheckmarkCircle01Icon  = makeIcon(_CheckmarkCircle01  as unknown as IconData)
export const ComputerActivityIcon   = makeIcon(_ComputerActivity   as unknown as IconData)
export const GraduateMaleIcon       = makeIcon(_GraduateMale       as unknown as IconData)
export const InformationCircleIcon  = makeIcon(_InformationCircle  as unknown as IconData)
export const Search01Icon           = makeIcon(_Search01           as unknown as IconData)
export const SearchMinusIcon        = makeIcon(_SearchMinus        as unknown as IconData)
export const Settings02Icon         = makeIcon(_Settings02         as unknown as IconData)
export const Sun01Icon              = makeIcon(_Sun01              as unknown as IconData)
export const UserAccountIcon        = makeIcon(_UserAccount        as unknown as IconData)
export const UserIdVerificationIcon = makeIcon(_UserIdVerification as unknown as IconData)
export const WifiOff01Icon          = makeIcon(_WifiOff01          as unknown as IconData)
